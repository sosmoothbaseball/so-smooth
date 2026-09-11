export type LessonCoachCard = {
  id?: string;
  name: string;
  slug: string;
  initials: string;
  role: string;
  price: string;
  location: string;
  email?: string;
};

export type PublicSlot = {
  id: string;
  coachId?: string;
  startsAt: string;
  endsAt: string;
  coachName: string;
  coachEmail: string;
};

export function slotsForCoach(slots: PublicSlot[], coach: LessonCoachCard) {
  return slots.filter((slot) => {
    if (coach.id && slot.coachId) return slot.coachId === coach.id;
    return (coach.email && slot.coachEmail === coach.email) || slot.coachName === coach.name;
  });
}

export function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function slugFromName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function dayKey(date: Date | string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(typeof date === "string" ? new Date(date) : date);
}

export function weekDays(offsetWeeks = 0) {
  const [year, month, day] = dayKey(new Date()).split("-").map(Number);
  return Array.from({ length: 7 }, (_, index) => {
    return new Date(Date.UTC(year, month - 1, day + offsetWeeks * 7 + index, 20, 0, 0));
  });
}

export function formatSlotTime(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
  }).format(typeof date === "string" ? new Date(date) : date);
}

export function formatSlotDay(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date);
}
