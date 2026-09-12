"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/portal/prisma";
import {
  clearSession,
  getSession,
  linkAuthUser,
  portalHome,
  requireCoach,
  requireParent,
  setSession,
} from "@/lib/portal/auth";
import { now } from "@/lib/portal/time";
import { parseLessonMinutes, parseTimeToMinutes } from "@/lib/portal/hours";
import { replaceWeeklyHours, syncCoachLessonSlots } from "@/lib/portal/availability";
import { createSupabaseServer } from "@/lib/supabase/server";
import {
  ClaimFailed,
  claimEventSpot,
  claimLessonSlot,
  readEventState,
  readLessonSlotState,
} from "@/lib/portal/booking";
import { passwordMeetsRules, PASSWORD_RULES_MESSAGE } from "@/lib/portal/password";

export type ActionResult = { ok: true } | { ok: false; error: string };

function fail(error: string): ActionResult {
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


export async function loginAction(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const supabase = await createSupabaseServer();
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return fail("Incorrect password");
    const profile = await linkAuthUser(data.user);
    if (!profile) return fail("Incorrect password");
    redirect(portalHome(profile.role));
  }
  let user;
  try {
    user = await prisma.profile.findUnique({ where: { email } });
  } catch {
    return fail("Incorrect password");
  }
  if (!user || !user.password || user.password !== password) {
    return fail("Incorrect password");
  }
  await setSession(user.id);
  redirect(portalHome(user.role));
}

export async function signupAction(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");

  if (!name || !email || !password) {
    return fail("Name, email, and password are required.");
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
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    });
    if (error) return fail(error.message);
    if (!data.user) {
      return fail("Check your email to confirm the account, then sign in.");
    }
    await prisma.profile.create({
      data: {
        name,
        email,
        password: "",
        authId: data.user.id,
        role: "parent",
      },
    });
    if (!data.session) {
      const signedIn = await supabase.auth.signInWithPassword({ email, password });
      if (signedIn.error) {
        return fail("Account created. Confirm the email, then sign in.");
      }
    }
    redirect(portalHome("parent"));
  }

  const user = await prisma.profile.create({
    data: {
      name,
      email,
      password,
      role: "parent",
    },
  });
  await setSession(user.id);
  redirect(portalHome(user.role));
}

export async function logoutAction() {
  await clearSession();
  redirect("/portal");
}

export async function saveWeeklyHoursAction(formData: FormData): Promise<ActionResult> {
  const coach = await requireCoach();
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
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return { ok: false, error: "Incorrect password" };
    }
    const profile = await linkAuthUser(data.user);
    if (!profile) return { ok: false, error: "Incorrect password" };
    if (profile.role === "coach") redirect("/portal/coach");
    redirect(slotId ? `/lessons?book=${slotId}` : "/lessons");
  }
  const user = await prisma.profile.findUnique({
    where: { email },
    include: { players: true },
  });
  if (!user || !user.password || user.password !== password) {
    return { ok: false, error: "Incorrect password" };
  }
  await setSession(user.id);
  if (user.role === "coach") {
    redirect("/portal/coach");
  }
  redirect(slotId ? `/lessons?book=${slotId}` : "/lessons");
}

export async function createParentForBookingAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const playerName = String(formData.get("playerName") || "").trim();
  const ageGroup = String(formData.get("ageGroup") || "Youth").trim() || "Youth";
  const slotId = String(formData.get("slotId") || "");

  if (!name || !email || !password) {
    return { ok: false, error: "Name, email, and password are required." };
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
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { ok: false, error: error.message };
    if (!data.user) {
      return { ok: false, error: "Check your email to confirm the account, then sign in." };
    }
    await prisma.profile.create({
      data: {
        name,
        email,
        password: "",
        authId: data.user.id,
        role: "parent",
        players: { create: { name: playerName, ageGroup } },
      },
    });
    if (!data.session) {
      const signedIn = await supabase.auth.signInWithPassword({ email, password });
      if (signedIn.error) {
        return { ok: false, error: "Account created. Confirm the email, then sign in." };
      }
    }
    redirect(slotId ? `/lessons?book=${slotId}` : "/lessons");
  }

  const user = await prisma.profile.create({
    data: {
      name,
      email,
      password,
      role: "parent",
      players: { create: { name: playerName, ageGroup } },
    },
  });
  await setSession(user.id);
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
    include: { slot: true },
  });
  if (!booking || booking.status !== "booked") return fail("That booking is already gone.");
  if (user.role === "coach" && booking.slot.coachId !== user.id) {
    return fail("You can only cancel lessons on your schedule.");
  }
  if (user.role !== "coach" && booking.parentId !== user.id) {
    return fail("You can only cancel your own booking.");
  }

  const stillUpcoming = booking.slot.startsAt > now();
  await prisma.$transaction([
    prisma.booking.update({ where: { id: bookingId }, data: { status: "cancelled" } }),
    prisma.lessonSlot.update({
      where: { id: booking.slotId },
      data: { status: stillUpcoming ? "open" : "closed" },
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
  if (!existing) return fail("That event is already gone.");

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
  const result = await prisma.upcomingEvent.deleteMany({ where: { id } });
  if (result.count === 0) return fail("That event is already gone.");
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
    await prisma.$transaction(async (tx) => {
      await claimEventSpot(tx, { eventId, parentId: user.id, playerId: player.id });
    });
  } catch (error) {
    const code = error instanceof ClaimFailed ? error.code : "";
    if (code === "started") return fail("That event already started.");
    if (code === "already") return fail("That player is already on this event.");
    if (code === "full") return fail("That event just filled up.");
    if (code === "gone") return fail("That event is no longer listed.");
    return fail("Could not book that event.");
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
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  if (!name || !email) return fail("Name and email are required.");

  const taken = await prisma.profile.findFirst({
    where: { email, NOT: { id: user.id } },
  });
  if (taken) return fail("That email is already in use.");

  await prisma.profile.update({
    where: { id: user.id },
    data: { name, email },
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
  if (supabase) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (signInError) return fail("That current password is not right.");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return fail(error.message);
  } else if (!user.password || user.password !== currentPassword) {
    return fail("That current password is not right.");
  }

  await prisma.profile.update({
    where: { id: user.id },
    data: { password: supabase ? "" : newPassword },
  });
  refreshProfiles();
  return ok();
}

export async function addPlayerAction(formData: FormData): Promise<ActionResult> {
  const parent = await requireParent();
  const name = String(formData.get("playerName") || "").trim();
  const ageGroup = String(formData.get("ageGroup") || "Youth").trim() || "Youth";
  if (!name) return fail("Player name is required.");
  await prisma.player.create({
    data: { parentId: parent.id, name, ageGroup },
  });
  refreshProfiles();
  return ok();
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
