import { dayKey, weekDays } from "@/lib/lessons";

export function now() {
  return new Date();
}

export function lessonBoardLastKey() {
  return dayKey(weekDays(0)[6]);
}

export function lessonBoardEnd() {
  const [year, month, day] = lessonBoardLastKey().split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1, 10, 0, 0));
}

/** Public lesson board: today through the last day of this week window. */
export function lessonBoardWindow() {
  return { start: now(), end: lessonBoardEnd() };
}

export function isWithinLessonBoard(date: Date) {
  const key = dayKey(date);
  return date > now() && key >= dayKey(now()) && key <= lessonBoardLastKey();
}
