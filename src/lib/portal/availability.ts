import { prisma } from "@/lib/portal/prisma";
import { parseLessonMinutes } from "@/lib/portal/hours";
import { lessonBoardWindow, now } from "@/lib/portal/time";

export { WEEKDAYS, minutesToTime, parseLessonMinutes, parseTimeToMinutes } from "@/lib/portal/hours";

const ZONE = "America/Los_Angeles";
const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

type WeeklyRule = {
  weekday: number;
  startMinutes: number;
  endMinutes: number;
};

function partsInZone(date: Date) {
  const map = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    weekday: WEEKDAY_SHORT.indexOf(map.weekday as (typeof WEEKDAY_SHORT)[number]),
  };
}

export function zonedLocalDate(year: number, month: number, day: number, minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const wanted = Date.UTC(year, month - 1, day, hour, minute);
  let date = new Date(Date.UTC(year, month - 1, day, hour + 8, minute));
  for (let i = 0; i < 3; i += 1) {
    const shown = partsInZone(date);
    const got = Date.UTC(shown.year, shown.month - 1, shown.day, shown.hour, shown.minute);
    date = new Date(date.getTime() + (wanted - got));
  }
  return date;
}

function addCivilDays(year: number, month: number, day: number, add: number) {
  const date = new Date(Date.UTC(year, month - 1, day + add));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    weekday: date.getUTCDay(),
  };
}

export function generateWeeklySlots(rules: WeeklyRule[], durationMinutes: number, from = now()) {
  const { end } = lessonBoardWindow();
  const start = partsInZone(from);
  const byWeekday = new Map(rules.map((rule) => [rule.weekday, rule]));
  const slots: { startsAt: Date; endsAt: Date }[] = [];

  for (let index = 0; index < 16; index += 1) {
    const civil = addCivilDays(start.year, start.month, start.day, index);
    const rule = byWeekday.get(civil.weekday);
    if (!rule) continue;
    for (
      let minutes = rule.startMinutes;
      minutes + durationMinutes <= rule.endMinutes;
      minutes += durationMinutes
    ) {
      const startsAt = zonedLocalDate(civil.year, civil.month, civil.day, minutes);
      const endsAt = zonedLocalDate(civil.year, civil.month, civil.day, minutes + durationMinutes);
      if (startsAt <= from || startsAt >= end) continue;
      slots.push({ startsAt, endsAt });
    }
  }

  return slots;
}

export async function getWeeklyHours(coachId: string) {
  return prisma.weeklyHours.findMany({
    where: { coachId },
    orderBy: { weekday: "asc" },
  });
}

export async function replaceWeeklyHours(coachId: string, rules: WeeklyRule[]) {
  await prisma.$transaction([
    prisma.weeklyHours.deleteMany({ where: { coachId } }),
    ...(rules.length
      ? [
          prisma.weeklyHours.createMany({
            data: rules.map((rule) => ({
              coachId,
              weekday: rule.weekday,
              startMinutes: rule.startMinutes,
              endMinutes: rule.endMinutes,
            })),
          }),
        ]
      : []),
  ]);
}

export async function syncCoachLessonSlots(coachId: string, options?: { replaceOpen?: boolean }) {
  const rules = await prisma.weeklyHours.findMany({ where: { coachId } });
  const { start, end } = lessonBoardWindow();

  if (rules.length === 0) {
    if (options?.replaceOpen) {
      await prisma.lessonSlot.deleteMany({
        where: {
          coachId,
          source: "weekly",
          status: { in: ["open", "blocked"] },
          startsAt: { gte: start, lt: end },
        },
      });
    }
    return;
  }

  const wanted = generateWeeklySlots(rules, parseLessonMinutes());
  const wantedByStart = new Map(wanted.map((slot) => [slot.startsAt.getTime(), slot]));
  const existing = await prisma.lessonSlot.findMany({
    where: { coachId, startsAt: { gte: start, lt: end } },
  });
  const managed = existing.filter((slot) => slot.source !== "once");

  const staleIds = managed
    .filter((slot) => slot.status !== "booked" && !wantedByStart.has(slot.startsAt.getTime()))
    .map((slot) => slot.id);
  if (staleIds.length) {
    await prisma.lessonSlot.deleteMany({ where: { id: { in: staleIds } } });
  }

  if (options?.replaceOpen) {
    const restoreIds = managed
      .filter((slot) => slot.status === "blocked" && wantedByStart.has(slot.startsAt.getTime()))
      .map((slot) => slot.id);
    if (restoreIds.length) {
      await prisma.lessonSlot.updateMany({
        where: { id: { in: restoreIds } },
        data: { status: "open" },
      });
    }
  }

  await Promise.all(
    managed
      .filter((slot) => {
        const match = wantedByStart.get(slot.startsAt.getTime());
        return Boolean(match && slot.status === "open" && slot.endsAt.getTime() !== match.endsAt.getTime());
      })
      .map((slot) => {
        const match = wantedByStart.get(slot.startsAt.getTime());
        if (!match) return Promise.resolve();
        return prisma.lessonSlot.update({
          where: { id: slot.id },
          data: { endsAt: match.endsAt },
        });
      }),
  );

  const created = wanted.filter((slot) => {
    return !existing.some(
      (row) => row.startsAt.getTime() < slot.endsAt.getTime() && row.endsAt.getTime() > slot.startsAt.getTime(),
    );
  });
  if (created.length) {
    await prisma.lessonSlot.createMany({
      data: created.map((slot) => ({
        coachId,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        status: "open",
        source: "weekly",
      })),
    });
  }
}

export async function ensureLessonBoard() {
  const coaches = await prisma.weeklyHours.findMany({
    distinct: ["coachId"],
    select: { coachId: true },
  });
  await Promise.all(coaches.map((coach) => syncCoachLessonSlots(coach.coachId)));
}
