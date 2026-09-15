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
      coach: { offersLessons: true },
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
    where: { role: "coach", offersLessons: true },
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
    where: { status: "open", endsAt: { gte: now() } },
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

const eventSignupInclude = {
  signups: { where: { status: "booked" as const }, include: { player: true, parent: true } },
};

export function getUpcomingEvents() {
  return prisma.upcomingEvent.findMany({
    where: { endsAt: { gte: now() } },
    include: eventSignupInclude,
    orderBy: { startsAt: "asc" },
  });
}

export const EVENT_HISTORY_PAGE_SIZE = 8;

export function getPastEventPage(page = 1) {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const skip = (safePage - 1) * EVENT_HISTORY_PAGE_SIZE;
  return Promise.all([
    prisma.upcomingEvent.findMany({
      where: { endsAt: { lt: now() } },
      include: eventSignupInclude,
      orderBy: { startsAt: "desc" },
      skip,
      take: EVENT_HISTORY_PAGE_SIZE,
    }),
    prisma.upcomingEvent.count({ where: { endsAt: { lt: now() } } }),
  ]).then(([items, total]) => ({
    items,
    total,
    page: safePage,
    pageCount: Math.max(1, Math.ceil(total / EVENT_HISTORY_PAGE_SIZE)),
  }));
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

export const CAREER_PAGE_SIZE = 8;
export const TESTIMONIAL_PAGE_SIZE = 8;

export function getFeaturedTestimonials() {
  return prisma.testimonial.findMany({
    where: { featuredSlot: { not: null } },
    orderBy: { featuredSlot: "asc" },
    take: 3,
    select: {
      id: true,
      quote: true,
      displayName: true,
      roleLabel: true,
      featuredSlot: true,
    },
  });
}

export function getTestimonialPage(page = 1) {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const skip = (safePage - 1) * TESTIMONIAL_PAGE_SIZE;
  return Promise.all([
    prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: TESTIMONIAL_PAGE_SIZE,
      include: { parent: { select: { name: true, email: true } } },
    }),
    prisma.testimonial.count(),
    prisma.testimonial.findMany({
      where: { featuredSlot: { not: null } },
      orderBy: { featuredSlot: "asc" },
      take: 3,
      select: {
        id: true,
        quote: true,
        displayName: true,
        roleLabel: true,
        featuredSlot: true,
      },
    }),
  ]).then(([items, total, featured]) => ({
    items,
    total,
    featured,
    page: safePage,
    pageCount: Math.max(1, Math.ceil(total / TESTIMONIAL_PAGE_SIZE)),
  }));
}

export function getCareerSubmissionPage(page = 1) {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const skip = (safePage - 1) * CAREER_PAGE_SIZE;
  return Promise.all([
    prisma.careerSubmission.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: CAREER_PAGE_SIZE,
    }),
    prisma.careerSubmission.count(),
  ]).then(([items, total]) => ({
    items,
    total,
    page: safePage,
    pageCount: Math.max(1, Math.ceil(total / CAREER_PAGE_SIZE)),
  }));
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
      where: { ...overlap, status: "open" },
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
