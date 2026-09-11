"use client";

import { useState } from "react";
import { X } from "lucide-react";
import MonthGrid from "@/components/calendar/MonthGrid";
import MonthSwitcher from "@/components/calendar/MonthSwitcher";
import { useMonthCursor } from "@/components/calendar/useMonthCursor";
import { formatRange } from "@/lib/portal/dates";
import type { CalendarMark, MonthCursor } from "@/lib/calendar-grid";

function formatDayHeading(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function PublicYearCalendar({
  initialMonth,
  events,
}: {
  initialMonth: MonthCursor;
  events: CalendarMark[];
}) {
  const { cursor, canPrev, canNext, prev, next } = useMonthCursor(initialMonth, "/calendar");
  const [open, setOpen] = useState<{ key: string; marks: CalendarMark[] } | null>(null);

  return (
    <>
      <MonthSwitcher
        cursor={cursor}
        canPrev={canPrev}
        canNext={canNext}
        onPrev={prev}
        onNext={next}
      />
      <MonthGrid
        year={cursor.year}
        month={cursor.month}
        events={events}
        onDayClick={(key, marks) => {
          if (marks.length === 0) return;
          setOpen({ key, marks });
        }}
      />

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-[0_24px_50px_-28px_rgba(7,16,12,0.55)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">
                  Calendar
                </p>
                <h3 className="mt-2 font-display text-3xl uppercase tracking-wide text-ink">
                  {formatDayHeading(open.key)}
                </h3>
              </div>
              <button type="button" aria-label="Close" onClick={() => setOpen(null)}>
                <X className="h-5 w-5 text-ink/40" />
              </button>
            </div>
            <ul className="mt-6 flex flex-col gap-3">
              {open.marks.map((event) => (
                <li key={event.id} className="rounded-2xl border border-ink/10 px-4 py-4">
                  {event.source === "upcoming" && (
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700">
                      Listed on Upcoming Events
                    </p>
                  )}
                  <p className="font-display text-2xl uppercase tracking-wide text-ink">
                    {event.title}
                  </p>
                  <p className="mt-1 text-sm text-ink/60">
                    {formatRange(new Date(event.startsAt), new Date(event.endsAt))}
                  </p>
                  {event.location ? (
                    <p className="mt-1 text-sm text-ink/50">{event.location}</p>
                  ) : null}
                  {event.notes ? (
                    <p className="mt-2 text-sm leading-relaxed text-ink/70">{event.notes}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
