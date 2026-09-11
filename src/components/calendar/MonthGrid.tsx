"use client";

import { cn } from "@/lib/utils";
import {
  eventsOnDay,
  monthCells,
  weekdayLabels,
  type CalendarMark,
} from "@/lib/calendar-grid";
import { dayKey } from "@/lib/lessons";

export default function MonthGrid({
  year,
  month,
  events,
  onDayClick,
  editable = false,
}: {
  year: number;
  month: number;
  events: CalendarMark[];
  onDayClick: (key: string, marks: CalendarMark[]) => void;
  editable?: boolean;
}) {
  const today = dayKey(new Date());
  const cells = monthCells(year, month);

  return (
    <section className="rounded-[2rem] border border-ink/10 bg-white p-4 sm:p-6">
      <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-semibold uppercase tracking-wide text-ink/40 sm:text-xs">
        {weekdayLabels().map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {cells.map((cell, index) => {
          if (!cell.key) {
            return <div key={`pad-${year}-${month}-${index}`} className="min-h-16 sm:min-h-20" />;
          }
          const marks = eventsOnDay(events, cell.key);
          const isToday = cell.key === today;
          const isPast = cell.key < today;
          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => onDayClick(cell.key!, marks)}
              className={cn(
                "flex min-h-16 flex-col items-start rounded-2xl px-2 py-2 text-left transition-colors sm:min-h-20",
                isToday && "ring-2 ring-yellow-500",
                marks.length > 0
                  ? "bg-green-700 text-bone hover:bg-green-600"
                  : "bg-bone text-ink hover:bg-green-500/10",
                isPast && marks.length === 0 && "text-ink/40",
                editable && marks.length === 0 && "hover:ring-1 hover:ring-green-600",
              )}
            >
              <span className="text-sm font-semibold">{cell.day}</span>
              {marks.length > 0 && (
                <span className="mt-1 max-w-full truncate text-[10px] leading-tight opacity-90 sm:text-xs">
                  {marks[0].title}
                  {marks.length > 1 ? ` +${marks.length - 1}` : ""}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
