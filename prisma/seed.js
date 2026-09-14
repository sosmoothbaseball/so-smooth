const { existsSync, readFileSync } = require("fs");
const { resolve } = require("path");
const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");

function loadEnv(file) {
  const path = resolve(__dirname, "..", file);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index < 1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] == null) process.env[key] = value;
  }
}

loadEnv(".env");
loadEnv(".env.local");

const prisma = new PrismaClient();
const ZONE = "America/Los_Angeles";
const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DEMO_USERS = [
  { email: "coach@sosmooth.test", password: "coach1", name: "Carlos Vega", role: "coach" },
  { email: "alex@sosmooth.test", password: "alex12", name: "Alex Howard", role: "coach" },
  { email: "roberto@sosmooth.test", password: "roberto", name: "Roberto Bueno", role: "coach" },
  { email: "parent@sosmooth.test", password: "parent", name: "Jordan Reyes", role: "parent" },
];

function atDay(daysFromNow, hour, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date;
}

function laParts(date) {
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
    weekday: WEEKDAY_SHORT.indexOf(map.weekday),
  };
}

function zonedLocalDate(year, month, day, minutes) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const wanted = Date.UTC(year, month - 1, day, hour, minute);
  let date = new Date(Date.UTC(year, month - 1, day, hour + 8, minute));
  for (let i = 0; i < 3; i += 1) {
    const shown = laParts(date);
    const got = Date.UTC(shown.year, shown.month - 1, shown.day, shown.hour, shown.minute);
    date = new Date(date.getTime() + (wanted - got));
  }
  return date;
}

function addCivilDays(year, month, day, add) {
  const date = new Date(Date.UTC(year, month - 1, day + add));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    weekday: date.getUTCDay(),
  };
}

function generateWeeklySlots(rules, durationMinutes) {
  const start = laParts(new Date());
  const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const byWeekday = new Map(rules.map((rule) => [rule.weekday, rule]));
  const slots = [];
  for (let index = 0; index < 16; index += 1) {
    const civil = addCivilDays(start.year, start.month, start.day, index);
    const rule = byWeekday.get(civil.weekday);
    if (!rule) continue;
    for (let minutes = rule.startMinutes; minutes + durationMinutes <= rule.endMinutes; minutes += durationMinutes) {
      const startsAt = zonedLocalDate(civil.year, civil.month, civil.day, minutes);
      const endsAt = zonedLocalDate(civil.year, civil.month, civil.day, minutes + durationMinutes);
      if (startsAt <= new Date() || startsAt >= end) continue;
      slots.push({ startsAt, endsAt });
    }
  }
  return slots;
}

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function syncAuthUser(admin, account) {
  const { data: created, error } = await admin.auth.admin.createUser({
    email: account.email,
    password: account.password,
    email_confirm: true,
    user_metadata: { name: account.name, role: account.role },
  });
  if (!error && created.user) return created.user.id;

  const { data: list, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listError) throw listError;
  const existing = list.users.find((user) => (user.email || "").toLowerCase() === account.email);
  if (!existing) {
    throw error || new Error(`Could not create ${account.email}`);
  }
  const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
    password: account.password,
    email_confirm: true,
    user_metadata: { name: account.name, role: account.role },
  });
  if (updateError) throw updateError;
  return existing.id;
}

async function main() {
  if (process.env.ALLOW_DB_SEED !== "true") {
    throw new Error(
      "Refusing to seed. This wipes portal data. Set ALLOW_DB_SEED=true only for a disposable local/demo database.",
    );
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("Set DATABASE_URL to the Supabase Postgres URI before seeding.");
  }

  const admin = adminClient();
  const authIds = {};
  if (admin) {
    for (const account of DEMO_USERS) {
      authIds[account.email] = await syncAuthUser(admin, account);
    }
    console.log("Synced demo Auth users in Supabase.");
  } else {
    console.log("No SUPABASE_SERVICE_ROLE_KEY. Seeding Postgres only.");
  }

  await prisma.eventSignup.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.lessonSlot.deleteMany();
  await prisma.weeklyHours.deleteMany();
  await prisma.upcomingEvent.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.lessonSpec.deleteMany();
  await prisma.player.deleteMany();
  await prisma.profile.deleteMany();

  const carlos = await prisma.profile.create({
    data: {
      email: "coach@sosmooth.test",
      name: "Carlos Vega",
      role: "coach",
      offersLessons: true,
      authId: authIds["coach@sosmooth.test"] || null,
      lessonSpec: {
        create: {
          slug: "carlos-vega",
          initials: "CV",
          title: "Co-Founder & Head Coach",
          length: "60 min",
          price: "$80",
          location: "Laguna Beach",
        },
      },
    },
  });

  const alex = await prisma.profile.create({
    data: {
      email: "alex@sosmooth.test",
      name: "Alex Howard",
      role: "coach",
      authId: authIds["alex@sosmooth.test"] || null,
      lessonSpec: {
        create: {
          slug: "alex-howard",
          initials: "AH",
          title: "College Coach & Pitching Coordinator",
          length: "60 min",
          price: "$80",
          location: "Laguna Beach",
        },
      },
    },
  });

  await prisma.profile.create({
    data: {
      email: "roberto@sosmooth.test",
      name: "Roberto Bueno",
      role: "coach",
      authId: authIds["roberto@sosmooth.test"] || null,
      lessonSpec: {
        create: {
          slug: "roberto-bueno",
          initials: "RB",
          title: "Co-Founder & Head Coach",
          length: "60 min",
          price: "$80",
          location: "Laguna Beach",
        },
      },
    },
  });

  const parent = await prisma.profile.create({
    data: {
      email: "parent@sosmooth.test",
      name: "Jordan Reyes",
      role: "parent",
      authId: authIds["parent@sosmooth.test"] || null,
    },
  });

  const mateo = await prisma.player.create({
    data: { parentId: parent.id, name: "Mateo Reyes", ageGroup: "12U" },
  });

  const luca = await prisma.player.create({
    data: { parentId: parent.id, name: "Luca Reyes", ageGroup: "11U" },
  });

  const carlosHours = [1, 2, 3, 4, 5, 6].map((weekday) => ({
    weekday,
    startMinutes: 15 * 60,
    endMinutes: 18 * 60,
  }));
  const alexHours = [
    { weekday: 2, startMinutes: 15 * 60 + 30, endMinutes: 17 * 60 + 30 },
    { weekday: 4, startMinutes: 15 * 60 + 30, endMinutes: 17 * 60 + 30 },
    { weekday: 6, startMinutes: 10 * 60, endMinutes: 12 * 60 },
  ];

  await prisma.weeklyHours.createMany({
    data: [
      ...carlosHours.map((row) => ({ ...row, coachId: carlos.id })),
      ...alexHours.map((row) => ({ ...row, coachId: alex.id })),
    ],
  });

  const carlosSlots = generateWeeklySlots(carlosHours, 60);
  const alexSlots = generateWeeklySlots(alexHours, 60);
  const bookedIndex = Math.max(
    0,
    carlosSlots.findIndex((slot) => slot.startsAt.getTime() > Date.now() + 36 * 60 * 60 * 1000),
  );

  await prisma.lessonSlot.createMany({
    data: [
      ...carlosSlots.map((slot, index) => ({
        coachId: carlos.id,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        status: index === bookedIndex ? "booked" : "open",
        source: "weekly",
      })),
      ...alexSlots.map((slot) => ({
        coachId: alex.id,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        status: "open",
        source: "weekly",
      })),
    ],
  });

  const bookedSlot = await prisma.lessonSlot.findFirst({
    where: { coachId: carlos.id, status: "booked" },
  });
  if (bookedSlot) {
    await prisma.booking.create({
      data: {
        slotId: bookedSlot.id,
        parentId: parent.id,
        playerId: mateo.id,
        status: "booked",
      },
    });
  }

  const clinic = await prisma.upcomingEvent.create({
    data: {
      type: "clinic",
      title: "Fall Hitting Clinic",
      description: "High-rep cage work for 11U-13U. Bring a helmet and two bats if you have them.",
      location: "So Smooth Cage, Laguna Beach",
      startsAt: atDay(10, 9, 0),
      endsAt: atDay(10, 12, 0),
      capacity: 12,
      price: "$75",
      createdById: carlos.id,
    },
  });

  await prisma.upcomingEvent.create({
    data: {
      type: "tryout",
      title: "12U Travel Tryout",
      description: "One session. Players should arrive 15 minutes early with cleats and a glove.",
      location: "Main Field",
      startsAt: atDay(14, 10, 0),
      endsAt: atDay(14, 12, 0),
      capacity: 24,
      price: "Free",
      createdById: carlos.id,
    },
  });

  await prisma.upcomingEvent.create({
    data: {
      type: "camp",
      title: "Holiday Skills Camp",
      description: "Two-day camp covering throwing, defense, and base running.",
      location: "So Smooth Cage, Laguna Beach",
      startsAt: atDay(21, 9, 0),
      endsAt: atDay(22, 15, 0),
      capacity: 20,
      price: "$150",
      createdById: carlos.id,
    },
  });

  await prisma.eventSignup.create({
    data: {
      eventId: clinic.id,
      parentId: parent.id,
      playerId: luca.id,
      status: "booked",
    },
  });

  await prisma.calendarEvent.createMany({
    data: [
      {
        title: "14U Tournament Weekend",
        startsAt: atDay(6, 8, 0),
        endsAt: atDay(7, 18, 0),
        notes: "No private lessons these two days.",
        location: "Travel",
        createdById: carlos.id,
      },
      {
        title: "Cage Closed",
        startsAt: atDay(18, 0, 0),
        endsAt: atDay(18, 23, 0),
        notes: "Facility maintenance.",
        location: "So Smooth Cage",
        createdById: carlos.id,
      },
    ],
  });

  console.log("Seeded Supabase demo data.");
  console.log("Coach  coach@sosmooth.test  /  coach1");
  console.log("Coach  alex@sosmooth.test   /  alex12");
  console.log("Coach  roberto@sosmooth.test /  roberto");
  console.log("Parent parent@sosmooth.test  /  parent");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
