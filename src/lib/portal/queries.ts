import { prisma } from "@/lib/portal/prisma";
import { ensureLessonBoard, syncCoachLessonSlots } from "@/lib/portal/availability";
import type { CalendarMark } from "@/lib/calendar-grid";
import { lessonBoardWindow, now } from "@/lib/portal/time";

export async function getOpenSlotsByCoach() {
  await ensureLessonBoard();
  const { start, end } = lessonBoardWindow();
  return prisma.lessonSlot.findMany({
    where: {
      status: "open",
      startsAt: { gte: start, lt: end },
      coach: { weeklyHours: { some: {} } },
    },
    select: {
      id: true,
      coachId: true,
      startsAt: true,
      endsAt: true,
      coach: { select: { name: true, email: true } },
    },
    orderBy: { startsAt: "asc" },
  });
}

export function getLessonCoaches() {
  return prisma.profile.findMany({
    where: { role: "coach", weeklyHours: { some: {} } },
    select: {
      id: true,
      name: true,
      email: true,
      lessonSpec: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getCoachSlots(coachId: string) {
  await syncCoachLessonSlots(coachId);
  return prisma.lessonSlot.findMany({
    where: {
      coachId,
      startsAt: { gte: now() },
    },
    include: {
      booking: { include: { player: true, parent: true } },
    },
    orderBy: { startsAt: "asc" },
  });
}

export function getCoachBookings(coachId: string) {
  return prisma.booking.findMany({
    where: {
      status: "booked",
      slot: { coachId, startsAt: { gte: now() } },
    },
    include: { player: true, parent: true, slot: true },
    orderBy: { slot: { startsAt: "asc" } },
  });
}

export function getParentLessonBookings(parentId: string) {
  return prisma.booking.findMany({
    where: {
      parentId,
      status: "booked",
      slot: { startsAt: { gte: now() } },
    },
    include: { player: true, slot: { include: { coach: true } } },
    orderBy: { slot: { startsAt: "asc" } },
  });
}

export function getPublicEvents() {
  return prisma.upcomingEvent.findMany({
    where: { endsAt: { gte: now() } },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      location: true,
      startsAt: true,
      endsAt: true,
      capacity: true,
      price: true,
      _count: { select: { signups: { where: { status: "booked" } } } },
    },
    orderBy: { startsAt: "asc" },
  });
}

export function getUpcomingEvents() {
  return prisma.upcomingEvent.findMany({
    where: { endsAt: { gte: now() } },
    include: {
      signups: { where: { status: "booked" }, include: { player: true, parent: true } },
    },
    orderBy: { startsAt: "asc" },
  });
}

export function getParentEventSignups(parentId: string) {
  return prisma.eventSignup.findMany({
    where: {
      parentId,
      status: "booked",
      event: { endsAt: { gte: now() } },
    },
    include: { player: true, event: true },
    orderBy: { event: { startsAt: "asc" } },
  });
}

export async function getYearCalendarEvents(from: Date, to: Date): Promise<CalendarMark[]> {
  const overlap = {
    startsAt: { lt: to },
    endsAt: { gte: from },
  };
  const [calendar, upcoming] = await Promise.all([
    prisma.calendarEvent.findMany({
      where: overlap,
      select: {
        id: true,
        title: true,
        notes: true,
        location: true,
        startsAt: true,
        endsAt: true,
      },
      orderBy: { startsAt: "asc" },
    }),
    prisma.upcomingEvent.findMany({
      where: overlap,
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        location: true,
        startsAt: true,
        endsAt: true,
        capacity: true,
        price: true,
      },
      orderBy: { startsAt: "asc" },
    }),
  ]);

  return [
    ...calendar.map((event) => ({
      id: event.id,
      title: event.title,
      notes: event.notes,
      location: event.location,
      startsAt: event.startsAt.toISOString(),
      endsAt: event.endsAt.toISOString(),
      source: "calendar" as const,
    })),
    ...upcoming.map((event) => ({
      id: `upcoming:${event.id}`,
      title: event.title,
      notes: event.description,
      location: event.location,
      startsAt: event.startsAt.toISOString(),
      endsAt: event.endsAt.toISOString(),
      source: "upcoming" as const,
      upcomingId: event.id,
      type: event.type,
      capacity: event.capacity,
      price: event.price,
    })),
  ].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}
