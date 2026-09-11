import { dayKey } from "@/lib/lessons";

export type CalendarMark = {
  id: string;
  title: string;
  notes: string;
  location: string;
  startsAt: string;
  endsAt: string;
  source?: "calendar" | "upcoming";
  upcomingId?: string;
  type?: string;
  capacity?: number;
  price?: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function weekdayLabels() {
  return WEEKDAYS;
}

export function monthLabel(monthIndex: number) {
  return MONTHS[monthIndex] || "";
}

export function currentYear() {
  return Number(dayKey(new Date()).slice(0, 4));
}

export function parseYear(value: string | undefined, fallback = currentYear()) {
  const year = Number(value);
  if (!Number.isInteger(year) || year < 2020 || year > 2100) return fallback;
  return year;
}

export type MonthCursor = { year: number; month: number };

export function currentMonth(): MonthCursor {
  const [year, month] = dayKey(new Date()).split("-").map(Number);
  return { year, month: month - 1 };
}

export function addMonths(cursor: MonthCursor, delta: number): MonthCursor {
  const date = new Date(cursor.year, cursor.month + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

export function monthKey(cursor: MonthCursor) {
  return `${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}`;
}

export function calendarWindow() {
  const start = currentMonth();
  return { start, end: addMonths(start, 12) };
}

export function clampVisibleMonth(cursor: MonthCursor): MonthCursor {
  const { start, end } = calendarWindow();
  const value = cursor.year * 12 + cursor.month;
  const min = start.year * 12 + start.month;
  const max = end.year * 12 + end.month;
  if (value < min) return start;
  if (value > max) return end;
  return cursor;
}

export function parseMonthParam(value?: string): MonthCursor {
  const match = /^(\d{4})-(\d{2})$/.exec(value || "");
  if (!match) return currentMonth();
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  if (!Number.isInteger(year) || month < 0 || month > 11) return currentMonth();
  return clampVisibleMonth({ year, month });
}

export function monthRange() {
  const { start, end } = calendarWindow();
  return {
    from: new Date(start.year, start.month, 1),
    to: new Date(end.year, end.month + 1, 1),
  };
}

export function monthCells(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const pad = first.getDay();
  const cells: Array<{ key: string | null; day: number | null }> = [];
  for (let i = 0; i < pad; i += 1) cells.push({ key: null, day: null });
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, monthIndex, day, 12, 0, 0);
    cells.push({ key: dayKey(date), day });
  }
  return cells;
}

export function eventsOnDay(events: CalendarMark[], key: string) {
  return events.filter((event) => {
    const start = dayKey(event.startsAt);
    const end = dayKey(event.endsAt);
    return start <= key && key <= end;
  });
}

export function dayAtNoon(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day, 8, 0, 0);
}

export function defaultRangeForDay(key: string) {
  const start = dayAtNoon(key);
  const end = new Date(start);
  end.setHours(18, 0, 0, 0);
  return { start, end };
}
