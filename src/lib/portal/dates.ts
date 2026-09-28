const zone = "America/Los_Angeles";
const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function pacificParts(date: Date) {
  const map = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
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
    const shown = pacificParts(date);
    const got = Date.UTC(shown.year, shown.month - 1, shown.day, shown.hour, shown.minute);
    date = new Date(date.getTime() + (wanted - got));
  }
  return date;
}

export function parseDateTimeLocal(value: unknown) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(value || "").trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) return null;
  return zonedLocalDate(year, month, day, hour * 60 + minute);
}

export function pacificAt(daysFromToday: number, minutes: number) {
  const parts = pacificParts(new Date());
  const civil = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + daysFromToday));
  return zonedLocalDate(
    civil.getUTCFullYear(),
    civil.getUTCMonth() + 1,
    civil.getUTCDate(),
    minutes,
  );
}

export function formatWhen(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDay(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function sameCalendarDay(start: Date, end: Date) {
  const opts: Intl.DateTimeFormatOptions = {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return (
    new Intl.DateTimeFormat("en-CA", opts).format(start) ===
    new Intl.DateTimeFormat("en-CA", opts).format(end)
  );
}

export function formatRange(start: Date, end: Date) {
  if (!sameCalendarDay(start, end)) {
    return `${formatWhen(start)} – ${formatWhen(end)}`;
  }
  return `${formatWhen(start)} – ${new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour: "numeric",
    minute: "2-digit",
  }).format(end)}`;
}

export function toDateTimeLocal(date: Date) {
  const parts = pacificParts(date);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}T${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}

export function eventTypeLabel(type: string) {
  if (type === "camp") return "Camp";
  if (type === "clinic") return "Clinic";
  if (type === "tryout") return "Tryout";
  return type;
}

export function eventCancelMailto(input: {
  title: string;
  startsAt: Date;
  endsAt: Date;
  location?: string;
  emails: string[];
}) {
  const emails = [...new Set(input.emails.map((email) => email.trim()).filter(Boolean))];
  if (emails.length === 0) return "";
  const when = formatRange(input.startsAt, input.endsAt);
  const where = input.location ? ` at ${input.location}` : "";
  const subject = `${input.title} is cancelled`;
  const body = [
    "Hi,",
    "",
    `${input.title} on ${when}${where} has been cancelled.`,
    "Sorry for the short notice. Reply to this email if you have questions.",
    "",
    "So Smooth Baseball",
  ].join("\n");
  const params = new URLSearchParams({ subject, body });
  return `mailto:?bcc=${emails.join(",")}&${params.toString()}`;
}
