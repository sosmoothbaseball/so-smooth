"use client";

import { useMemo, useState } from "react";
import ActionForm from "@/components/portal/ActionForm";
import Button from "@/components/ui/Button";
import { saveWeeklyHoursAction } from "@/lib/portal/actions";
import { WEEKDAYS, minutesToTime } from "@/lib/portal/hours";
import TimeSelect from "@/components/portal/TimeSelect";
import { cn } from "@/lib/utils";

type DayState = {
  on: boolean;
  start: string;
  end: string;
};

const DEFAULT_START = "13:00";
const DEFAULT_END = "17:00";

function emptyWeek(hours: { weekday: number; startMinutes: number; endMinutes: number }[]): Record<number, DayState> {
  const next: Record<number, DayState> = {};
  for (const day of WEEKDAYS) {
    const saved = hours.find((row) => row.weekday === day.id);
    next[day.id] = saved
      ? { on: true, start: minutesToTime(saved.startMinutes), end: minutesToTime(saved.endMinutes) }
      : { on: false, start: DEFAULT_START, end: DEFAULT_END };
  }
  return next;
}

export default function WeeklyHoursForm({
  hours,
}: {
  hours: { weekday: number; startMinutes: number; endMinutes: number }[];
}) {
  const [days, setDays] = useState(() => emptyWeek(hours));
  const [fillStart, setFillStart] = useState(DEFAULT_START);
  const [fillEnd, setFillEnd] = useState(DEFAULT_END);

  const selectedCount = useMemo(
    () => Object.values(days).filter((day) => day.on).length,
    [days],
  );

  function setDay(id: number, patch: Partial<DayState>) {
    setDays((current) => ({ ...current, [id]: { ...current[id], ...patch } }));
  }

  function applyHours(which: "all" | "weekdays" | "selected") {
    setDays((current) => {
      const next = { ...current };
      for (const day of WEEKDAYS) {
        const isWeekday = day.id >= 1 && day.id <= 5;
        if (which === "all") {
          next[day.id] = { on: true, start: fillStart, end: fillEnd };
        } else if (which === "weekdays") {
          next[day.id] = { on: isWeekday, start: fillStart, end: fillEnd };
        } else if (current[day.id].on) {
          next[day.id] = { on: true, start: fillStart, end: fillEnd };
        }
      }
      return next;
    });
  }

  return (
    <ActionForm
      action={saveWeeklyHoursAction}
      className="flex flex-col gap-5"
      confirm={{
        title: "Save these hours?",
        message: "Are you sure you want to update your weekly lesson hours?",
        confirmLabel: "Save Hours",
      }}
    >
      <div className="rounded-2xl border border-ink/10 bg-bone/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
          Fill several days
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">From</span>
            <TimeSelect id="fill-start" value={fillStart} onChange={setFillStart} />
          </label>
          <label className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">To</span>
            <TimeSelect id="fill-end" value={fillEnd} onChange={setFillEnd} />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" variant="onLight" size="sm" onClick={() => applyHours("all")}>
            Every day
          </Button>
          <Button type="button" variant="onLight" size="sm" onClick={() => applyHours("weekdays")}>
            Weekdays
          </Button>
          <Button type="button" variant="onLight" size="sm" onClick={() => applyHours("selected")}>
            Selected days
          </Button>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {WEEKDAYS.map((day) => {
          const state = days[day.id];
          return (
            <li
              key={day.id}
              className={cn(
                "grid grid-cols-1 gap-3 rounded-2xl border px-4 py-3 sm:grid-cols-[6.5rem_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center",
                state.on ? "border-green-600/30 bg-green-500/5" : "border-ink/10 bg-white",
              )}
            >
              <label className="flex items-center gap-3 text-sm font-semibold text-ink">
                <input
                  type="checkbox"
                  name={`day-${day.id}-on`}
                  value="on"
                  checked={state.on}
                  onChange={(event) => setDay(day.id, { on: event.target.checked })}
                  className="h-4 w-4 accent-green-600"
                />
                {day.label}
              </label>
              <TimeSelect
                name={`day-${day.id}-start`}
                value={state.start}
                disabled={!state.on}
                onChange={(start) => setDay(day.id, { start })}
              />
              <span className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink/35">
                to
              </span>
              <TimeSelect
                name={`day-${day.id}-end`}
                value={state.end}
                disabled={!state.on}
                onChange={(end) => setDay(day.id, { end })}
              />
            </li>
          );
        })}
      </ul>

      <p className="text-sm text-ink/55">
        {selectedCount === 0
          ? "Save with no days selected to stop repeating hours. Families will not see new times."
          : "These hours repeat every week. Lessons are 60 minutes each, so 1–5pm becomes four bookable times."}
      </p>
      <Button type="submit">Save Weekly Hours</Button>
    </ActionForm>
  );
}
