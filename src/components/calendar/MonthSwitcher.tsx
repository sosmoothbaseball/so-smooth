"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthLabel, type MonthCursor } from "@/lib/calendar-grid";
import { cn } from "@/lib/utils";

export default function MonthSwitcher({
  cursor,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  cursor: MonthCursor;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className={cn(
          "inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
          canPrev ? "text-ink/55 hover:text-green-700" : "cursor-not-allowed text-ink/20",
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </button>
      <p className="font-display text-3xl uppercase tracking-wide text-ink sm:text-4xl">
        {monthLabel(cursor.month)} {cursor.year}
      </p>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className={cn(
          "inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
          canNext ? "text-ink/55 hover:text-green-700" : "cursor-not-allowed text-ink/20",
        )}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
