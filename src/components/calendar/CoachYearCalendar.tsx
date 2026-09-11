"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import MonthGrid from "@/components/calendar/MonthGrid";
import MonthSwitcher from "@/components/calendar/MonthSwitcher";
import { useMonthCursor } from "@/components/calendar/useMonthCursor";
import ConfirmDialog from "@/components/portal/ConfirmDialog";
import Button from "@/components/ui/Button";
import { TextAreaField, TextField } from "@/components/ui/FormField";
import {
  addCalendarEventAction,
  removeCalendarEventAction,
  removeUpcomingEventAction,
  updateCalendarEventAction,
  updateUpcomingEventAction,
} from "@/lib/portal/actions";
import { defaultRangeForDay, type CalendarMark, type MonthCursor } from "@/lib/calendar-grid";
import { formatRange, toDateTimeLocal } from "@/lib/portal/dates";

function formatDayHeading(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function CoachYearCalendar({
  initialMonth,
  events,
}: {
  initialMonth: MonthCursor;
  events: CalendarMark[];
}) {
  const { cursor, canPrev, canNext, prev, next } = useMonthCursor(
    initialMonth,
    "/portal/coach/calendar",
  );
  const router = useRouter();
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [dayEvents, setDayEvents] = useState<CalendarMark[]>([]);
  const [editing, setEditing] = useState<CalendarMark | null | "new">(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [confirm, setConfirm] = useState<
    | { kind: "save"; formData: FormData }
    | { kind: "delete"; event: CalendarMark }
    | null
  >(null);

  function openDay(key: string, marks: CalendarMark[]) {
    setDayKey(key);
    setDayEvents(marks);
    setEditing(marks.length === 0 ? "new" : null);
    setError("");
  }

  function close() {
    setDayKey(null);
    setEditing(null);
    setError("");
  }

  async function save(formData: FormData) {
    setPending(true);
    setError("");
    const upcoming = editing && editing !== "new" && editing.source === "upcoming";
    let result;
    if (upcoming && editing !== "new") {
      formData.set("eventId", editing.upcomingId || "");
      formData.set("description", String(formData.get("notes") || ""));
      if (!formData.get("type")) formData.set("type", editing.type || "clinic");
      if (!formData.get("capacity")) formData.set("capacity", String(editing.capacity || 12));
      if (!formData.get("price")) formData.set("price", editing.price || "$75");
      result = await updateUpcomingEventAction(formData);
    } else if (editing && editing !== "new") {
      result = await updateCalendarEventAction(formData);
    } else {
      result = await addCalendarEventAction(formData);
    }
    setPending(false);
    if (result.ok === false) {
      setError(result.error);
      return;
    }
    close();
    router.refresh();
  }

  async function remove(event: CalendarMark) {
    setPending(true);
    setError("");
    const form = new FormData();
    form.set("eventId", event.source === "upcoming" ? event.upcomingId || "" : event.id);
    const result =
      event.source === "upcoming"
        ? await removeUpcomingEventAction(form)
        : await removeCalendarEventAction(form);
    setPending(false);
    if (result.ok === false) {
      setError(result.error);
      return;
    }
    close();
    router.refresh();
  }

  const defaults = dayKey ? defaultRangeForDay(dayKey) : null;
  const editEvent = editing && editing !== "new" ? editing : null;

  return (
    <>
      <p className="mb-4 text-sm text-ink/55">
        Flip through the next year. Click a day to add it. Click a marked day to edit or delete
        what is already there.
      </p>
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
        editable
        onDayClick={openDay}
      />

      {dayKey && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-[0_24px_50px_-28px_rgba(7,16,12,0.55)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">
                  {editing ? (editEvent ? "Edit Event" : "Add Event") : "Day Details"}
                </p>
                <h3 className="mt-2 font-display text-3xl uppercase tracking-wide text-ink">
                  {formatDayHeading(dayKey)}
                </h3>
              </div>
              <button type="button" aria-label="Close" onClick={close}>
                <X className="h-5 w-5 text-ink/40" />
              </button>
            </div>

            {!editing && (
              <div className="mt-6 flex flex-col gap-3">
                {dayEvents.map((event) => (
                  <div key={event.id} className="rounded-2xl border border-ink/10 px-4 py-4">
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
                      <p className="mt-2 text-sm text-ink/70">{event.notes}</p>
                    ) : null}
                    <div className="mt-4 flex gap-2">
                      <Button type="button" size="sm" onClick={() => setEditing(event)}>
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="onLight"
                        disabled={pending}
                        onClick={() => setConfirm({ kind: "delete", event })}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="onLight" onClick={() => setEditing("new")}>
                  Add Another Event
                </Button>
              </div>
            )}

            {editing && defaults && (
              <form
                className="mt-6 flex flex-col gap-4"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  if (editEvent) {
                    setConfirm({ kind: "save", formData });
                    return;
                  }
                  await save(formData);
                }}
              >
                {editEvent && editEvent.source !== "upcoming" ? (
                  <input type="hidden" name="eventId" value={editEvent.id} />
                ) : null}
                {editEvent?.source === "upcoming" ? (
                  <>
                    <input type="hidden" name="eventId" value={editEvent.upcomingId || ""} />
                    <input type="hidden" name="type" value={editEvent.type || "clinic"} />
                    <input type="hidden" name="capacity" value={String(editEvent.capacity || 12)} />
                    <input type="hidden" name="price" value={editEvent.price || "$75"} />
                  </>
                ) : null}
                <TextField
                  id="cal-title"
                  name="title"
                  label="Title"
                  defaultValue={editEvent?.title || ""}
                  required
                />
                <TextField
                  id="cal-location"
                  name="location"
                  label="Location"
                  defaultValue={editEvent?.location || ""}
                />
                <TextField
                  id="cal-start"
                  name="startsAt"
                  type="datetime-local"
                  label="Starts"
                  defaultValue={toDateTimeLocal(
                    editEvent ? new Date(editEvent.startsAt) : defaults.start,
                  )}
                  required
                />
                <TextField
                  id="cal-end"
                  name="endsAt"
                  type="datetime-local"
                  label="Ends"
                  defaultValue={toDateTimeLocal(
                    editEvent ? new Date(editEvent.endsAt) : defaults.end,
                  )}
                  required
                />
                <TextAreaField
                  id="cal-notes"
                  name="notes"
                  label="Details"
                  defaultValue={editEvent?.notes || ""}
                />
                {error ? <p className="text-sm text-red-700">{error}</p> : null}
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={pending}>
                    {pending ? "Saving…" : "Save To Calendar"}
                  </Button>
                  <Button
                    type="button"
                    variant="onLight"
                    onClick={() => {
                      setEditing(dayEvents.length ? null : null);
                      if (dayEvents.length === 0) close();
                      else setEditing(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.kind === "delete" ? "Delete this event?" : "Save these changes?"}
        message={
          confirm?.kind === "delete"
            ? "Are you sure you want to delete this event?"
            : "Are you sure you want to save these changes?"
        }
        confirmLabel={confirm?.kind === "delete" ? "Delete" : "Save"}
        pending={pending}
        onCancel={() => {
          if (!pending) setConfirm(null);
        }}
        onConfirm={async () => {
          if (!confirm) return;
          if (confirm.kind === "delete") {
            await remove(confirm.event);
          } else {
            await save(confirm.formData);
          }
          setConfirm(null);
        }}
      />
    </>
  );
}
