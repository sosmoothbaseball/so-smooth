"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addMonths,
  calendarWindow,
  clampVisibleMonth,
  monthKey,
  type MonthCursor,
} from "@/lib/calendar-grid";

export function useMonthCursor(initial: MonthCursor, basePath: string) {
  const router = useRouter();
  const [cursor, setCursor] = useState(initial);
  const { start, end } = calendarWindow();
  const canPrev = cursor.year * 12 + cursor.month > start.year * 12 + start.month;
  const canNext = cursor.year * 12 + cursor.month < end.year * 12 + end.month;

  function go(delta: number) {
    const next = clampVisibleMonth(addMonths(cursor, delta));
    setCursor(next);
    router.replace(`${basePath}?month=${monthKey(next)}`, { scroll: false });
  }

  return { cursor, canPrev, canNext, prev: () => go(-1), next: () => go(1) };
}
