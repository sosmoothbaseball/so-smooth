"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/portal/prisma";
import {
  clearSession,
  getSession,
  ensureParentProfile,
  linkAuthUser,
  portalHome,
  requireCoach,
  requireParent,
} from "@/lib/portal/auth";
import { now } from "@/lib/portal/time";
import { parseLessonMinutes, parseTimeToMinutes } from "@/lib/portal/hours";
import {
  clearUnbookedLessonSlots,
  replaceWeeklyHours,
  syncCoachLessonSlots,
} from "@/lib/portal/availability";
import { createSupabaseServer } from "@/lib/supabase/server";
import { AUTH_UNAVAILABLE } from "@/lib/supabase/config";
import { appOrigin } from "@/lib/supabase/origin";
import {
  ClaimFailed,
  claimEventSpot,
  claimLessonSlot,
  readEventState,
  readLessonSlotState,
} from "@/lib/portal/booking";
import { passwordMeetsRules, PASSWORD_RULES_MESSAGE } from "@/lib/portal/password";
import { clearPasswordResetSession, hasPasswordResetSession } from "@/lib/portal/password-reset";
import { normalizePhone, phoneLooksValid, PHONE_REQUIRED_MESSAGE } from "@/lib/portal/phone";
import { careerRecentlySent, CAREER_WAIT_MS, markCareerSent } from "@/lib/portal/career-limit";
import { Prisma } from "@prisma/client";
import { safeReturnPath } from "@/lib/portal/paths";
import {
  markTestimonialSent,
  testimonialRecentlySent,
} from "@/lib/portal/testimonial-limit";
import {
  nextOpenSlot,
  parseAgeGroup,
  TESTIMONIAL_NAME_MAX,
  TESTIMONIAL_QUOTE_MAX,
  TESTIMONIAL_QUOTE_MIN,
  TESTIMONIAL_WAIT_MS,
  testimonialRoleLabel,
} from "@/lib/portal/testimonials";

export type ActionResult = { ok: true } | { ok: false; error: string };

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

function ok(): ActionResult {
  return { ok: true };
}

function parseDate(value: FormDataEntryValue | null) {
  const date = new Date(String(value || ""));
  return Number.isNaN(date.getTime()) ? null : date;
}

function refreshLessons() {
  revalidatePath("/lessons");
  revalidatePath("/portal/coach");
  revalidatePath("/portal/parent");
}

function refreshEvents() {
  revalidatePath("/events");
  revalidatePath("/portal/coach/events");
  revalidatePath("/portal/parent");
  refreshCalendar();
}

function refreshCalendar() {
  revalidatePath("/calendar");
  revalidatePath("/portal/coach/calendar");
}

function refreshProfiles() {
  revalidatePath("/portal/coach/profile");
  revalidatePath("/portal/parent/profile");
  revalidatePath("/lessons");
}

function refreshCareers() {
  revalidatePath("/portal/coach/careers");
  revalidatePath("/careers");
}

function refreshTestimonials() {
  revalidatePath("/");
  revalidatePath("/portal/coach/testimonials");
}

function parentReturnPath(formData: FormData) {
  return safeReturnPath(formData.get("next"));
}


export async function loginAction(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const supabase = await createSupabaseServer();
  if (!supabase) return fail(AUTH_UNAVAILABLE);

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return fail("Incorrect password");
  const profile = await linkAuthUser(data.user);
  if (!profile) return fail("Incorrect password");
  const next = parentReturnPath(formData);
  if (profile.role === "parent" && next) redirect(next);
  redirect(portalHome(profile.role));
}

export async function signupAction(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const phone = normalizePhone(String(formData.get("phone") || ""));
  const password = String(formData.get("password") || "");

  if (!name || !email || !password) {
    return fail("Name, email, and password are required.");
  }
  if (!phoneLooksValid(phone)) {
    return fail(PHONE_REQUIRED_MESSAGE);
  }
  if (!passwordMeetsRules(password)) {
    return fail(PASSWORD_RULES_MESSAGE);
  }

  let existing;
  try {
    existing = await prisma.profile.findUnique({ where: { email } });
  } catch {
    return fail("Could not create the account right now. Try again.");
  }
  if (existing) {
    return fail("That email already has an account. Sign in instead.");
  }

  const supabase = await createSupabaseServer();
  if (!supabase) return fail(AUTH_UNAVAILABLE);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, phone } },
  });
  if (error) return fail(error.message);
  if (!data.user) {
    return fail("Check your email to confirm the account, then sign in.");
  }
  try {
    await ensureParentProfile({
      authId: data.user.id,
      name,
      email,
      phone,
    });
  } catch {
    return fail("Account started. Sign in and we will finish setting up your profile.");
  }
  if (!data.session) {
    const signedIn = await supabase.auth.signInWithPassword({ email, password });
    if (signedIn.error) {
      redirect("/portal/check-email");
    }
  }
  const next = parentReturnPath(formData);
  if (next) redirect(next);
  redirect(portalHome("parent"));
}

export async function logoutAction() {
  await clearSession();
  redirect("/portal");
}

export async function requestPasswordResetAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createSupabaseServer();
  if (!supabase) return fail(AUTH_UNAVAILABLE);

  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  if (!email) return fail("Enter the email for your account.");

  const origin = await appOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/portal/update-password`,
  });
  if (error) return fail(error.message);
  return ok();
}

export async function updatePasswordAfterResetAction(formData: FormData): Promise<ActionResult> {
  const user = await getSession();
  if (!user || !(await hasPasswordResetSession())) {
    return fail("Use the reset link from your email first.");
  }

  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  if (!newPassword || !confirmPassword) return fail("Enter the new password twice.");
  if (newPassword !== confirmPassword) return fail("The new passwords do not match.");
  if (!passwordMeetsRules(newPassword)) return fail(PASSWORD_RULES_MESSAGE);

  const supabase = await createSupabaseServer();
  if (!supabase) return fail(AUTH_UNAVAILABLE);
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return fail(error.message);

  await clearPasswordResetSession();
  refreshProfiles();
  return ok();
}

export async function setOffersLessonsAction(formData: FormData): Promise<ActionResult> {
  const coach = await requireCoach();
  const offersLessons = String(formData.get("offersLessons") || "") === "on";

  await prisma.profile.update({
    where: { id: coach.id },
    data: { offersLessons },
  });

  if (offersLessons) {
    await syncCoachLessonSlots(coach.id, { replaceOpen: true });
  } else {
    await clearUnbookedLessonSlots(coach.id);
  }

  refreshLessons();
  return ok();
}

export async function saveWeeklyHoursAction(formData: FormData): Promise<ActionResult> {
  const coach = await requireCoach();
  if (!coach.offersLessons) {
    return fail("Turn on private lessons first, then you can set weekly hours.");
  }
  const duration = parseLessonMinutes();
  const rules: { weekday: number; startMinutes: number; endMinutes: number }[] = [];

  for (const weekday of [0, 1, 2, 3, 4, 5, 6]) {
    if (String(formData.get(`day-${weekday}-on`) || "") !== "on") continue;
    const startMinutes = parseTimeToMinutes(String(formData.get(`day-${weekday}-start`) || ""));
    const endMinutes = parseTimeToMinutes(String(formData.get(`day-${weekday}-end`) || ""));
    if (startMinutes == null || endMinutes == null) {
      return fail("Use a start and end time on every selected day.");
    }
    if (endMinutes <= startMinutes) return fail("End time must be after the start.");
    if (endMinutes - startMinutes < duration) {
      return fail(`Each day needs at least one ${duration}-minute lesson.`);
    }
    rules.push({ weekday, startMinutes, endMinutes });
  }

  await replaceWeeklyHours(coach.id, rules);
  await syncCoachLessonSlots(coach.id, { replaceOpen: true });
  refreshLessons();
  return ok();
}

export async function removeLessonSlotAction(formData: FormData): Promise<ActionResult> {
  const coach = await requireCoach();
  const id = String(formData.get("slotId") || "");
  const slot = await prisma.lessonSlot.findFirst({
    where: { id, coachId: coach.id },
    include: { booking: { select: { status: true } } },
  });
  if (!slot) return fail("That slot is already gone.");
  if (slot.status === "booked" || slot.booking?.status === "booked") {
    return fail("That time is booked. Cancel the lesson first, then you can remove the slot.");
  }

  const result = await prisma.lessonSlot.updateMany({
    where: { id: slot.id, coachId: coach.id, status: "open", startsAt: { gt: now() } },
    data: { status: "blocked" },
  });
  if (result.count === 0) {
    const latest = await prisma.lessonSlot.findFirst({
      where: { id: slot.id, coachId: coach.id },
      include: { booking: { select: { status: true } } },
    });
    if (latest?.status === "booked" || latest?.booking?.status === "booked") {
      return fail("That time is booked. Cancel the lesson first, then you can remove the slot.");
    }
    return fail("That slot is gone or already booked.");
  }
  refreshLessons();
  return ok();
}

export async function blockLessonDayAction(formData: FormData): Promise<ActionResult> {
  const coach = await requireCoach();
  const day = String(formData.get("day") || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return fail("Pick a day to clear.");

  const slots = await prisma.lessonSlot.findMany({
    where: { coachId: coach.id, status: "open", startsAt: { gt: now() } },
    select: { id: true, startsAt: true },
  });
  const ids = slots
    .filter((slot) => {
      const key = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Los_Angeles",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(slot.startsAt);
      return key === day;
    })
    .map((slot) => slot.id);
  if (ids.length === 0) {
    const bookedThatDay = await prisma.lessonSlot.findMany({
      where: { coachId: coach.id, status: "booked", startsAt: { gt: now() } },
      select: { startsAt: true },
    });
    const hasBooked = bookedThatDay.some((slot) => {
      const key = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Los_Angeles",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(slot.startsAt);
      return key === day;
    });
    if (hasBooked) {
      return fail("Booked lessons stay on the day. Cancel those first if you need the times gone.");
    }
    return fail("No open times left on that day.");
  }

  await prisma.lessonSlot.updateMany({
    where: { id: { in: ids }, coachId: coach.id, status: "open" },
    data: { status: "blocked" },
  });
  refreshLessons();
  return ok();
}

export async function loginForBookingAction(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const slotId = String(formData.get("slotId") || "");
  const supabase = await createSupabaseServer();
  if (!supabase) return { ok: false, error: AUTH_UNAVAILABLE };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { ok: false, error: "Incorrect password" };
  }
  const profile = await linkAuthUser(data.user);
  if (!profile) return { ok: false, error: "Incorrect password" };
  if (profile.role === "coach") redirect("/portal/coach");
  redirect(slotId ? `/lessons?book=${slotId}` : "/lessons");
}

export async function createParentForBookingAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const phone = normalizePhone(String(formData.get("phone") || ""));
  const password = String(formData.get("password") || "");
  const playerName = String(formData.get("playerName") || "").trim();
  const ageGroup = String(formData.get("ageGroup") || "Youth").trim() || "Youth";
  const slotId = String(formData.get("slotId") || "");

  if (!name || !email || !password) {
    return { ok: false, error: "Name, email, and password are required." };
  }
  if (!phoneLooksValid(phone)) {
    return { ok: false, error: PHONE_REQUIRED_MESSAGE };
  }
  if (!passwordMeetsRules(password)) {
    return { ok: false, error: PASSWORD_RULES_MESSAGE };
  }
  if (!playerName) {
    return { ok: false, error: "Add the player this lesson is for." };
  }

  const existing = await prisma.profile.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "That email already has an account. Sign in instead." };
  }

  const supabase = await createSupabaseServer();
  if (!supabase) return { ok: false, error: AUTH_UNAVAILABLE };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, phone } },
  });
  if (error) return { ok: false, error: error.message };
  if (!data.user) {
    return { ok: false, error: "Check your email to confirm the account, then sign in." };
  }
  try {
    await ensureParentProfile({
      authId: data.user.id,
      name,
      email,
      phone,
      player: { name: playerName, ageGroup },
    });
  } catch {
    return { ok: false, error: "Account started. Sign in and we will finish setting up your profile." };
  }
  if (!data.session) {
    const signedIn = await supabase.auth.signInWithPassword({ email, password });
    if (signedIn.error) {
      redirect("/portal/check-email");
    }
  }
  redirect(slotId ? `/lessons?book=${slotId}` : "/lessons");
}

export async function checkLessonSlotAction(formData: FormData): Promise<ActionResult> {
  const slotId = String(formData.get("slotId") || "");
  if (!slotId) return fail("Pick a lesson time.");
  return readLessonSlotState(slotId);
}

export async function bookLessonAction(formData: FormData): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("Sign in to book.");
  if (user.role !== "parent") return fail("Book from a parent account.");

  const slotId = String(formData.get("slotId") || "");
  const playerId = String(formData.get("playerId") || user.players[0]?.id || "");
  const player = user.players.find((row) => row.id === playerId);
  if (!player) return fail("Pick a player on your account.");

  try {
    await prisma.$transaction(async (tx) => {
      await claimLessonSlot(tx, { slotId, parentId: user.id, playerId: player.id });
    });
  } catch (error) {
    const code = error instanceof ClaimFailed ? error.code : "";
    if (code === "past") return fail("That time already started.");
    if (code === "ahead") return fail("Families can only book this week.");
    if (code === "overlap") return fail("That player already has a lesson in this window.");
    if (code === "gone") return fail("That time is no longer on the board.");
    return fail("That time was just taken. Pick another open slot.");
  }

  refreshLessons();
  return ok();
}

export async function cancelLessonBookingAction(formData: FormData): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("Sign in first.");
  const bookingId = String(formData.get("bookingId") || "");
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { slot: { include: { coach: { select: { offersLessons: true } } } } },
  });
  if (!booking || booking.status !== "booked") return fail("That booking is already gone.");
  if (user.role === "coach" && booking.slot.coachId !== user.id) {
    return fail("You can only cancel lessons on your schedule.");
  }
  if (user.role !== "coach" && booking.parentId !== user.id) {
    return fail("You can only cancel your own booking.");
  }

  const stillUpcoming = booking.slot.startsAt > now();
  const canReopen = stillUpcoming && booking.slot.coach.offersLessons;
  await prisma.$transaction([
    prisma.booking.update({ where: { id: bookingId }, data: { status: "cancelled" } }),
    prisma.lessonSlot.update({
      where: { id: booking.slotId },
      data: { status: canReopen ? "open" : stillUpcoming ? "blocked" : "closed" },
    }),
  ]);
  refreshLessons();
  return ok();
}

function readEventFields(formData: FormData) {
  const type = String(formData.get("type") || "clinic");
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const startsAt = parseDate(formData.get("startsAt"));
  const endsAt = parseDate(formData.get("endsAt"));
  const capacity = Number(formData.get("capacity") || 12);
  const price = String(formData.get("price") || "").trim() || "$75";
  return { type, title, description, location, startsAt, endsAt, capacity, price };
}

function eventFieldError(
  fields: ReturnType<typeof readEventFields>,
  options?: { allowPastStart?: boolean },
) {
  if (!fields.title) return "Give the event a title.";
  if (!fields.startsAt || !fields.endsAt) return "Enter a start and end time.";
  if (fields.endsAt <= fields.startsAt) return "End time must be after the start.";
  if (!options?.allowPastStart && fields.startsAt <= now()) {
    return "That start time already passed.";
  }
  if (!Number.isFinite(fields.capacity) || fields.capacity < 1 || fields.capacity > 200) {
    return "Capacity needs to be between 1 and 200.";
  }
  if (fields.price.length > 24) {
    return "Keep the price short, like $75 or Free.";
  }
  return null;
}

function eventType(type: string) {
  return ["camp", "clinic", "tryout"].includes(type) ? type : "clinic";
}

export async function addUpcomingEventAction(formData: FormData): Promise<ActionResult> {
  const coach = await requireCoach();
  const fields = readEventFields(formData);
  const error = eventFieldError(fields);
  if (error) return fail(error);

  await prisma.upcomingEvent.create({
    data: {
      type: eventType(fields.type),
      title: fields.title,
      description: fields.description,
      location: fields.location,
      startsAt: fields.startsAt!,
      endsAt: fields.endsAt!,
      capacity: Math.round(fields.capacity),
      price: fields.price,
      createdById: coach.id,
    },
  });
  refreshEvents();
  return ok();
}

export async function updateUpcomingEventAction(formData: FormData): Promise<ActionResult> {
  await requireCoach();
  const id = String(formData.get("eventId") || "");
  const fields = readEventFields(formData);
  if (!id) return fail("That event is missing.");

  const existing = await prisma.upcomingEvent.findUnique({
    where: { id },
    include: { _count: { select: { signups: { where: { status: "booked" } } } } },
  });
  if (!existing || existing.status === "cancelled") {
    return fail("That event is already gone.");
  }

  const startChanged = fields.startsAt
    ? fields.startsAt.getTime() !== existing.startsAt.getTime()
    : true;
  const error = eventFieldError(fields, { allowPastStart: !startChanged });
  if (error) return fail(error);
  if (Math.round(fields.capacity) < existing._count.signups) {
    return fail(`Capacity cannot be below the ${existing._count.signups} already booked.`);
  }

  const result = await prisma.upcomingEvent.updateMany({
    where: { id },
    data: {
      type: eventType(fields.type),
      title: fields.title,
      description: fields.description,
      location: fields.location,
      startsAt: fields.startsAt!,
      endsAt: fields.endsAt!,
      capacity: Math.round(fields.capacity),
      price: fields.price,
    },
  });
  if (result.count === 0) return fail("That event is already gone.");
  refreshEvents();
  return ok();
}

export async function removeUpcomingEventAction(formData: FormData): Promise<ActionResult> {
  await requireCoach();
  const id = String(formData.get("eventId") || "");
  const event = await prisma.upcomingEvent.findUnique({
    where: { id },
    include: { _count: { select: { signups: { where: { status: "booked" } } } } },
  });
  if (!event || event.status === "cancelled") return fail("That event is already gone.");

  if (event._count.signups === 0) {
    await prisma.upcomingEvent.delete({ where: { id } });
  } else {
    await prisma.upcomingEvent.update({
      where: { id },
      data: { status: "cancelled" },
    });
  }
  refreshEvents();
  return ok();
}

export async function checkEventSpotAction(formData: FormData): Promise<ActionResult> {
  const eventId = String(formData.get("eventId") || "");
  const playerId = String(formData.get("playerId") || "");
  if (!eventId) return fail("Pick an event.");
  return readEventState(eventId, playerId || undefined);
}

export async function bookEventAction(formData: FormData): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("Sign in to book.");
  if (user.role !== "parent") return fail("Book from a parent account.");

  const eventId = String(formData.get("eventId") || "");
  const playerId = String(formData.get("playerId") || user.players[0]?.id || "");
  const player = user.players.find((row) => row.id === playerId);
  if (!player) return fail("Pick a player on your account.");

  try {
    await prisma.$transaction(
      async (tx) => {
        await claimEventSpot(tx, { eventId, parentId: user.id, playerId: player.id });
      },
      { isolationLevel: "Serializable" },
    );
  } catch (error) {
    const code = error instanceof ClaimFailed ? error.code : "";
    if (code === "started") return fail("That event already started.");
    if (code === "already") return fail("That player is already on this event.");
    if (code === "full") return fail("That event just filled up.");
    if (code === "gone") return fail("That event is no longer listed.");
    return fail("That event just filled up. Refresh and pick another if needed.");
  }

  refreshEvents();
  return ok();
}

export async function cancelEventSignupAction(formData: FormData): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("Sign in first.");
  const signupId = String(formData.get("signupId") || "");
  const signup = await prisma.eventSignup.findUnique({
    where: { id: signupId },
    include: { event: true },
  });
  if (!signup || signup.status !== "booked") return fail("That booking is already gone.");
  if (user.role === "coach" && signup.event.createdById !== user.id) {
    return fail("You can only cancel signups on your events.");
  }
  if (user.role !== "coach" && signup.parentId !== user.id) {
    return fail("You can only cancel your own booking.");
  }
  if (signup.event.endsAt <= now()) return fail("That event already ended.");

  await prisma.eventSignup.update({ where: { id: signupId }, data: { status: "cancelled" } });
  refreshEvents();
  return ok();
}

function readCalendarFields(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const startsAt = parseDate(formData.get("startsAt"));
  const endsAt = parseDate(formData.get("endsAt"));
  return { title, notes, location, startsAt, endsAt };
}

export async function addCalendarEventAction(formData: FormData): Promise<ActionResult> {
  const coach = await requireCoach();
  const { title, notes, location, startsAt, endsAt } = readCalendarFields(formData);
  if (!title) return fail("Give the calendar item a title.");
  if (!startsAt || !endsAt) return fail("Enter a start and end time.");
  if (endsAt <= startsAt) return fail("End time must be after the start.");

  await prisma.calendarEvent.create({
    data: { title, notes, location, startsAt, endsAt, createdById: coach.id },
  });
  refreshCalendar();
  return ok();
}

export async function updateCalendarEventAction(formData: FormData): Promise<ActionResult> {
  await requireCoach();
  const id = String(formData.get("eventId") || "");
  const { title, notes, location, startsAt, endsAt } = readCalendarFields(formData);
  if (!id) return fail("That event is missing.");
  if (!title) return fail("Give the calendar item a title.");
  if (!startsAt || !endsAt) return fail("Enter a start and end time.");
  if (endsAt <= startsAt) return fail("End time must be after the start.");

  const result = await prisma.calendarEvent.updateMany({
    where: { id },
    data: { title, notes, location, startsAt, endsAt },
  });
  if (result.count === 0) return fail("That item is already gone.");
  refreshCalendar();
  return ok();
}

export async function removeCalendarEventAction(formData: FormData): Promise<ActionResult> {
  await requireCoach();
  const id = String(formData.get("eventId") || "");
  const result = await prisma.calendarEvent.deleteMany({ where: { id } });
  if (result.count === 0) return fail("That item is already gone.");
  refreshCalendar();
  return ok();
}

export async function updateLessonSpecAction(formData: FormData): Promise<ActionResult> {
  const coach = await requireCoach();
  const title = String(formData.get("title") || "").trim() || "Coach";
  const length = "60 min";
  const price = String(formData.get("price") || "").trim() || "$75";
  const location = String(formData.get("location") || "").trim() || "Laguna Beach";
  const initials = String(formData.get("initials") || "").trim().slice(0, 3).toUpperCase();
  const slug = String(formData.get("slug") || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (!slug) return fail("Add a short URL slug for this coach.");
  if (!initials) return fail("Add initials for the lesson card.");

  const taken = await prisma.lessonSpec.findFirst({
    where: { slug, NOT: { coachId: coach.id } },
  });
  if (taken) return fail("That staff bio is already linked to another coach.");

  await prisma.lessonSpec.upsert({
    where: { coachId: coach.id },
    create: {
      coachId: coach.id,
      slug,
      initials,
      title,
      length,
      price,
      location,
    },
    update: { slug, initials, title, length, price, location },
  });
  await syncCoachLessonSlots(coach.id);
  refreshProfiles();
  refreshLessons();
  return ok();
}

export async function updateProfileAction(formData: FormData): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("Sign in first.");
  const name = String(formData.get("name") || "").trim();
  const phone = normalizePhone(String(formData.get("phone") || ""));
  if (!name) return fail("Name is required.");
  if (!phoneLooksValid(phone)) return fail(PHONE_REQUIRED_MESSAGE);

  await prisma.profile.update({
    where: { id: user.id },
    data: { name, phone },
  });
  refreshProfiles();
  return ok();
}

export async function changePasswordAction(formData: FormData): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("Sign in first.");

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return fail("Enter your current password and the new one twice.");
  }
  if (newPassword !== confirmPassword) return fail("The new passwords do not match.");
  if (!passwordMeetsRules(newPassword)) return fail(PASSWORD_RULES_MESSAGE);
  if (newPassword === currentPassword) return fail("Pick a new password that is different.");

  const supabase = await createSupabaseServer();
  if (!supabase) return fail(AUTH_UNAVAILABLE);

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (signInError) return fail("That current password is not right.");
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return fail(error.message);

  refreshProfiles();
  return ok();
}

export async function addPlayerAction(formData: FormData): Promise<
  | { ok: true; player: { id: string; name: string; ageGroup: string } }
  | { ok: false; error: string }
> {
  const parent = await requireParent();
  const name = String(formData.get("playerName") || "").trim();
  const ageGroup = String(formData.get("ageGroup") || "Youth").trim() || "Youth";
  if (!name) return fail("Player name is required.");
  const player = await prisma.player.create({
    data: { parentId: parent.id, name, ageGroup },
    select: { id: true, name: true, ageGroup: true },
  });
  refreshProfiles();
  return { ok: true, player };
}

export async function updatePlayerAction(formData: FormData): Promise<ActionResult> {
  const parent = await requireParent();
  const playerId = String(formData.get("playerId") || "");
  const name = String(formData.get("playerName") || "").trim();
  const ageGroup = String(formData.get("ageGroup") || "").trim();
  if (!playerId || !name) return fail("Player name is required.");
  const result = await prisma.player.updateMany({
    where: { id: playerId, parentId: parent.id },
    data: { name, ageGroup },
  });
  if (result.count === 0) return fail("That player is not on your account.");
  refreshProfiles();
  return ok();
}

export async function removePlayerAction(formData: FormData): Promise<ActionResult> {
  const parent = await requireParent();
  const playerId = String(formData.get("playerId") || "");
  if (!playerId) return fail("That player is already gone.");

  const player = await prisma.player.findFirst({
    where: { id: playerId, parentId: parent.id },
    select: { id: true },
  });
  if (!player) return fail("That player is not on your account.");

  const [lessons, events] = await Promise.all([
    prisma.booking.count({
      where: {
        playerId,
        status: "booked",
        slot: { startsAt: { gte: now() } },
      },
    }),
    prisma.eventSignup.count({
      where: {
        playerId,
        status: "booked",
        event: { status: "open", endsAt: { gte: now() } },
      },
    }),
  ]);
  if (lessons || events) {
    return fail("Cancel their upcoming bookings first, then you can remove this player.");
  }

  await prisma.player.delete({ where: { id: playerId } });
  refreshProfiles();
  revalidatePath("/portal/parent");
  return ok();
}

const CAREER_ROLES = new Set([
  "hitting",
  "pitching",
  "catching",
  "infield",
  "outfield",
  "operations",
  "other",
]);

export async function submitCareerAction(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const availability = String(formData.get("availability") || "").trim();
  const experience = String(formData.get("experience") || "").trim();
  const instagram = String(formData.get("instagram") || "").trim();
  const resumeUrl = String(formData.get("resumeUrl") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !role || !message) {
    return fail("Name, email, role, and a short note are required.");
  }
  if (!email.includes("@")) return fail("Enter a valid email.");
  if (!CAREER_ROLES.has(role)) return fail("Pick the role you are interested in.");
  if (message.length > 4000) return fail("Keep the note under 4,000 characters.");
  if (resumeUrl && !/^https?:\/\//i.test(resumeUrl)) {
    return fail("Resume should be a full link, like https://...");
  }
  if (await careerRecentlySent()) {
    return fail("You already sent an application in the last 30 minutes. Try again later.");
  }
  const recent = await prisma.careerSubmission.findFirst({
    where: { email, createdAt: { gte: new Date(Date.now() - CAREER_WAIT_MS) } },
    select: { id: true },
  });
  if (recent) {
    return fail("You already sent an application in the last 30 minutes. Try again later.");
  }

  await prisma.careerSubmission.create({
    data: {
      name,
      email,
      phone,
      city,
      role,
      availability,
      experience,
      instagram,
      resumeUrl,
      message,
    },
  });
  await markCareerSent();
  refreshCareers();
  return ok();
}

export async function deleteCareerSubmissionAction(formData: FormData): Promise<ActionResult> {
  await requireCoach();
  const id = String(formData.get("submissionId") || "");
  if (!id) return fail("That application is already gone.");
  const result = await prisma.careerSubmission.deleteMany({ where: { id } });
  if (result.count === 0) return fail("That application is already gone.");
  refreshCareers();
  return ok();
}

function isUniqueConflict(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function submitTestimonialAction(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return fail("Sign in with a family account to share a story.");
  if (session.role !== "parent") {
    return fail("Family accounts can share stories from the homepage.");
  }

  const quote = String(formData.get("quote") || "").trim();
  const displayName = String(formData.get("displayName") || "").trim();
  const ageGroup = parseAgeGroup(String(formData.get("ageGroup") || "").trim());

  if (displayName.length < 2) return fail("Enter the name to show with the story.");
  if (displayName.length > TESTIMONIAL_NAME_MAX) {
    return fail(`Keep the name under ${TESTIMONIAL_NAME_MAX} characters.`);
  }
  if (!ageGroup) return fail("Pick the player's age group.");
  if (quote.length < TESTIMONIAL_QUOTE_MIN) {
    return fail(`Write at least ${TESTIMONIAL_QUOTE_MIN} characters so coaches have something to review.`);
  }
  if (quote.length > TESTIMONIAL_QUOTE_MAX) {
    return fail(`Keep the story under ${TESTIMONIAL_QUOTE_MAX} characters.`);
  }
  if (await testimonialRecentlySent()) {
    return fail("You already sent a story in the last 30 minutes. Try again later.");
  }
  const recent = await prisma.testimonial.findFirst({
    where: { parentId: session.id, createdAt: { gte: new Date(Date.now() - TESTIMONIAL_WAIT_MS) } },
    select: { id: true },
  });
  if (recent) {
    return fail("You already sent a story in the last 30 minutes. Try again later.");
  }

  await prisma.testimonial.create({
    data: {
      quote,
      displayName,
      roleLabel: testimonialRoleLabel(ageGroup),
      parentId: session.id,
    },
  });
  await markTestimonialSent();
  refreshTestimonials();
  return ok();
}

export async function featureTestimonialAction(formData: FormData): Promise<ActionResult> {
  await requireCoach();
  const id = String(formData.get("testimonialId") || "");
  const replaceId = String(formData.get("replaceId") || "").trim();
  if (!id) return fail("That story is already gone.");

  try {
    const result = await prisma.$transaction(async (tx) => {
      const row = await tx.testimonial.findUnique({ where: { id } });
      if (!row) return fail("That story is already gone.");
      if (row.featuredSlot) return ok();

      const featured = await tx.testimonial.findMany({
        where: { featuredSlot: { not: null } },
        orderBy: { featuredSlot: "asc" },
      });
      const openSlot = nextOpenSlot(featured.map((item) => item.featuredSlot));

      if (openSlot) {
        await tx.testimonial.update({
          where: { id },
          data: { featuredSlot: openSlot },
        });
        return ok();
      }

      if (!replaceId) {
        return fail("All 3 homepage spots are filled. Choose one story to replace. It stays in this list.");
      }
      if (replaceId === id) return fail("Pick a different story to take off the homepage.");

      const outgoing = featured.find((item) => item.id === replaceId);
      if (!outgoing?.featuredSlot) {
        return fail("That homepage story changed. Refresh and try again.");
      }

      await tx.testimonial.update({
        where: { id: outgoing.id },
        data: { featuredSlot: null },
      });
      await tx.testimonial.update({
        where: { id },
        data: { featuredSlot: outgoing.featuredSlot },
      });
      return ok();
    });
    if (result.ok) refreshTestimonials();
    return result;
  } catch (error) {
    if (isUniqueConflict(error)) {
      return fail("Those homepage spots changed. Refresh and try again.");
    }
    throw error;
  }
}

export async function unfeatureTestimonialAction(formData: FormData): Promise<ActionResult> {
  await requireCoach();
  const id = String(formData.get("testimonialId") || "");
  if (!id) return fail("That story is already gone.");
  const result = await prisma.testimonial.updateMany({
    where: { id, featuredSlot: { not: null } },
    data: { featuredSlot: null },
  });
  if (result.count === 0) return fail("That story is not on the homepage.");
  refreshTestimonials();
  return ok();
}

export async function deleteTestimonialAction(formData: FormData): Promise<ActionResult> {
  await requireCoach();
  const id = String(formData.get("testimonialId") || "");
  if (!id) return fail("That story is already gone.");
  const result = await prisma.testimonial.deleteMany({ where: { id } });
  if (result.count === 0) return fail("That story is already gone.");
  refreshTestimonials();
  return ok();
}
