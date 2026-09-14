import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/portal/prisma";
import { isWithinLessonBoard, now } from "@/lib/portal/time";

export type ClaimError =
  | "gone"
  | "taken"
  | "past"
  | "ahead"
  | "overlap"
  | "started"
  | "already"
  | "full";

export class ClaimFailed extends Error {
  code: ClaimError;
  constructor(code: ClaimError) {
    super(code);
    this.code = code;
  }
}

export async function readLessonSlotState(slotId: string) {
  const slot = await prisma.lessonSlot.findUnique({
    where: { id: slotId },
    select: {
      id: true,
      status: true,
      startsAt: true,
      coach: { select: { offersLessons: true } },
    },
  });
  if (!slot || !slot.coach.offersLessons) {
    return { ok: false as const, error: "That time is no longer on the board." };
  }
  if (slot.startsAt <= now()) return { ok: false as const, error: "That time already started." };
  if (!isWithinLessonBoard(slot.startsAt)) {
    return { ok: false as const, error: "Families can only book this week." };
  }
  if (slot.status !== "open") return { ok: false as const, error: "That time was just taken." };
  return { ok: true as const };
}

export async function readEventState(eventId: string, playerId?: string) {
  const event = await prisma.upcomingEvent.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      startsAt: true,
      capacity: true,
      status: true,
      _count: { select: { signups: { where: { status: "booked" } } } },
    },
  });
  if (!event || event.status !== "open") {
    return { ok: false as const, error: "That event is no longer listed." };
  }
  if (event.startsAt <= now()) return { ok: false as const, error: "That event already started." };
  if (event._count.signups >= event.capacity) {
    return { ok: false as const, error: "That event just filled up." };
  }
  if (playerId) {
    const existing = await prisma.eventSignup.findUnique({
      where: { eventId_playerId: { eventId, playerId } },
      select: { status: true },
    });
    if (existing?.status === "booked") {
      return { ok: false as const, error: "That player is already on this event." };
    }
  }
  return { ok: true as const };
}

export async function claimLessonSlot(
  tx: Prisma.TransactionClient,
  input: { slotId: string; parentId: string; playerId: string },
) {
  const current = now();
  const existing = await tx.booking.findUnique({
    where: { slotId: input.slotId },
    select: { id: true, parentId: true, status: true },
  });
  if (existing?.status === "booked") {
    if (existing.parentId === input.parentId) return "owned";
    throw new ClaimFailed("taken");
  }

  const slot = await tx.lessonSlot.findUnique({
    where: { id: input.slotId },
    include: { coach: { select: { offersLessons: true } } },
  });
  if (!slot || !slot.coach.offersLessons) throw new ClaimFailed("gone");
  if (slot.startsAt <= current) throw new ClaimFailed("past");
  if (!isWithinLessonBoard(slot.startsAt)) throw new ClaimFailed("ahead");
  if (slot.status !== "open") throw new ClaimFailed("taken");

  const overlap = await tx.booking.findFirst({
    where: {
      playerId: input.playerId,
      status: "booked",
      slot: {
        startsAt: { lt: slot.endsAt },
        endsAt: { gt: slot.startsAt },
      },
    },
    select: { id: true },
  });
  if (overlap) throw new ClaimFailed("overlap");

  const claimed = await tx.lessonSlot.updateMany({
    where: { id: input.slotId, status: "open", startsAt: { gt: current } },
    data: { status: "booked" },
  });
  if (claimed.count !== 1) throw new ClaimFailed("taken");

  if (existing) {
    await tx.booking.update({
      where: { id: existing.id },
      data: {
        parentId: input.parentId,
        playerId: input.playerId,
        status: "booked",
      },
    });
    return "created";
  }

  await tx.booking.create({
    data: {
      slotId: input.slotId,
      parentId: input.parentId,
      playerId: input.playerId,
      status: "booked",
    },
  });
  return "created";
}

export async function claimEventSpot(
  tx: Prisma.TransactionClient,
  input: { eventId: string; parentId: string; playerId: string },
) {
  const locked = await tx.$queryRaw<Array<{ id: string; capacity: number; startsAt: Date; status: string }>>`
    SELECT id, capacity, "startsAt", status
    FROM "UpcomingEvent"
    WHERE id = ${input.eventId}
    FOR UPDATE
  `;
  const event = locked[0];
  if (!event || event.status !== "open") throw new ClaimFailed("gone");
  if (event.startsAt <= now()) throw new ClaimFailed("started");

  const existing = await tx.eventSignup.findUnique({
    where: { eventId_playerId: { eventId: input.eventId, playerId: input.playerId } },
  });
  if (existing?.status === "booked") {
    if (existing.parentId === input.parentId) return "owned";
    throw new ClaimFailed("already");
  }

  const taken = await tx.eventSignup.count({
    where: { eventId: input.eventId, status: "booked" },
  });
  if (taken >= event.capacity) throw new ClaimFailed("full");

  if (existing) {
    await tx.eventSignup.update({
      where: { id: existing.id },
      data: { status: "booked", parentId: input.parentId },
    });
    return "created";
  }

  await tx.eventSignup.create({
    data: {
      eventId: input.eventId,
      parentId: input.parentId,
      playerId: input.playerId,
      status: "booked",
    },
  });
  return "created";
}
