const zone = "America/Los_Angeles";

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
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return shifted.toISOString().slice(0, 16);
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
