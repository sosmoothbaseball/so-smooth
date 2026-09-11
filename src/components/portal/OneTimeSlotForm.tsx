"use client";

import { useMemo, useState } from "react";
import ActionForm from "@/components/portal/ActionForm";
import TimeSelect from "@/components/portal/TimeSelect";
import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/FormField";
import { addLessonSlotAction } from "@/lib/portal/actions";

function splitLocal(value: string) {
  const [date, time] = String(value || "").split("T");
  return {
    date: date || "",
    time: (time || "16:00").slice(0, 5),
  };
}

export default function OneTimeSlotForm({
  defaultStart,
  defaultEnd,
  minDate,
}: {
  defaultStart: string;
  defaultEnd: string;
  minDate: string;
}) {
  const initial = useMemo(() => splitLocal(defaultStart), [defaultStart]);
  const initialEnd = useMemo(() => splitLocal(defaultEnd), [defaultEnd]);
  const [date, setDate] = useState(initial.date);
  const [start, setStart] = useState(initial.time);
  const [end, setEnd] = useState(initialEnd.time);

  return (
    <ActionForm
      action={addLessonSlotAction}
      className="grid gap-4 sm:grid-cols-[1.1fr_1fr_1fr_auto] sm:items-end"
      resetOnSuccess
    >
      <input type="hidden" name="startsAt" value={date && start ? `${date}T${start}` : ""} />
      <input type="hidden" name="endsAt" value={date && end ? `${date}T${end}` : ""} />
      <TextField
        id="once-date"
        name="onceDate"
        type="date"
        label="Day"
        value={date}
        min={minDate.slice(0, 10)}
        onChange={(event) => setDate(event.target.value)}
        required
      />
      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">Starts</span>
        <TimeSelect id="once-start" value={start} onChange={setStart} />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">Ends</span>
        <TimeSelect id="once-end" value={end} onChange={setEnd} />
      </label>
      <Button type="submit">Add once</Button>
    </ActionForm>
  );
}
