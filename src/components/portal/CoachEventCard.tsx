"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import ActionForm from "@/components/portal/ActionForm";
import Button from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/FormField";
import {
  cancelEventSignupAction,
  removeUpcomingEventAction,
  updateUpcomingEventAction,
} from "@/lib/portal/actions";
import { eventCancelMailto, eventTypeLabel, formatRange, toDateTimeLocal } from "@/lib/portal/dates";

export type CoachEventCardData = {
  id: string;
  type: string;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  price: string;
  status: string;
  signups: {
    id: string;
    playerName: string;
    parentName: string;
    parentEmail: string;
    parentPhone: string;
  }[];
};

export default function CoachEventCard({
  event,
  past = false,
}: {
  event: CoachEventCardData;
  past?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const startsAt = new Date(event.startsAt);
  const endsAt = new Date(event.endsAt);
  const cancelled = event.status === "cancelled";
  const badge = cancelled ? "Cancelled" : past ? "Ended" : eventTypeLabel(event.type);
  const familyMail = eventCancelMailto({
    title: event.title,
    startsAt,
    endsAt,
    location: event.location,
    emails: event.signups.map((signup) => signup.parentEmail),
  });

  if (editing) {
    return (
      <li className="rounded-2xl border border-green-600/25 bg-green-500/5 px-4 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700">
          Edit Event
        </p>
        <ActionForm
          action={updateUpcomingEventAction}
          className="mt-4 flex flex-col gap-4"
          onSuccess={() => setEditing(false)}
          confirm={{
            title: "Save these changes?",
            message: "Are you sure you want to update this event? Families will see the new details.",
            confirmLabel: "Save Event",
          }}
        >
          <input type="hidden" name="eventId" value={event.id} />
          <SelectField id={`edit-type-${event.id}`} name="type" label="Type" defaultValue={event.type}>
            <option value="camp">Camp</option>
            <option value="clinic">Clinic</option>
            <option value="tryout">Tryout</option>
          </SelectField>
          <TextField
            id={`edit-title-${event.id}`}
            name="title"
            label="Title"
            defaultValue={event.title}
            required
          />
          <TextAreaField
            id={`edit-description-${event.id}`}
            name="description"
            label="Details"
            defaultValue={event.description}
          />
          <TextField
            id={`edit-location-${event.id}`}
            name="location"
            label="Location"
            defaultValue={event.location}
          />
          <TextField
            id={`edit-starts-${event.id}`}
            name="startsAt"
            type="datetime-local"
            label="Starts"
            defaultValue={toDateTimeLocal(startsAt)}
            required
          />
          <TextField
            id={`edit-ends-${event.id}`}
            name="endsAt"
            type="datetime-local"
            label="Ends"
            defaultValue={toDateTimeLocal(endsAt)}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id={`edit-price-${event.id}`}
              name="price"
              label="Price"
              defaultValue={event.price}
              required
            />
            <TextField
              id={`edit-capacity-${event.id}`}
              name="capacity"
              type="number"
              label="Capacity"
              defaultValue={String(event.capacity)}
              min={Math.max(1, event.signups.length)}
              max={200}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm">
              Save Event
            </Button>
            <Button type="button" variant="onLight" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </ActionForm>
      </li>
    );
  }

  return (
    <li
      className={
        cancelled
          ? "rounded-2xl border border-red-200 bg-red-50/70 px-4 py-4"
          : "rounded-2xl border border-ink/10 px-4 py-4"
      }
    >
      <p
        className={
          cancelled
            ? "text-[10px] font-semibold uppercase tracking-[0.18em] text-red-700"
            : "text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700"
        }
      >
        {badge}
      </p>
      <p className="mt-1 font-display text-2xl uppercase tracking-wide text-ink">{event.title}</p>
      <p className="mt-2 text-sm text-ink/60">{formatRange(startsAt, endsAt)}</p>
      {event.location ? <p className="mt-1 text-sm text-ink/50">{event.location}</p> : null}
      <p className="mt-1 text-sm text-ink/50">
        {event.price} · {event.signups.length}/{event.capacity} booked
      </p>
      {cancelled && !past ? (
        <p className="mt-3 text-sm text-ink/65">
          Off the public list. Families still see this as cancelled in their portal. Email them so
          they hear it before they log in.
        </p>
      ) : null}
      {event.signups.length > 0 || !past ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {event.signups.length > 0 ? (
            <Button type="button" size="sm" onClick={() => setListOpen(true)}>
              View Booking List
            </Button>
          ) : null}
          {past ? null : cancelled ? (
            familyMail ? (
              <Button href={familyMail} size="sm" external>
                Email Booked Families
              </Button>
            ) : (
              <p className="text-xs text-ink/45">No family emails on these signups.</p>
            )
          ) : (
            <>
              <Button type="button" size="sm" onClick={() => setEditing(true)}>
                Edit Event
              </Button>
              <ActionForm
                action={removeUpcomingEventAction}
                confirm={{
                  title: "Remove this event?",
                  message:
                    event.signups.length > 0
                      ? `Are you sure? The listing comes down and ${event.signups.length} booked ${event.signups.length === 1 ? "family stays" : "families stay"} here so you can email them. They also see it as cancelled in their portal.`
                      : "Are you sure you want to remove this event?",
                  confirmLabel: "Remove Event",
                }}
              >
                <input type="hidden" name="eventId" value={event.id} />
                <Button type="submit" variant="onLight" size="sm">
                  Remove Event
                </Button>
              </ActionForm>
            </>
          )}
        </div>
      ) : null}
      {listOpen && event.signups.length > 0 ? (
        <BookingListDialog
          event={event}
          past={past}
          cancelled={cancelled}
          onClose={() => setListOpen(false)}
        />
      ) : null}
    </li>
  );
}

function BookingListDialog({
  event,
  past,
  cancelled,
  onClose,
}: {
  event: CoachEventCardData;
  past: boolean;
  cancelled: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const dialogs = document.querySelectorAll('[role="dialog"][aria-modal="true"]');
      if (dialogs[dialogs.length - 1] !== panelRef.current) return;
      onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/60 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[min(40rem,88vh)] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_50px_-28px_rgba(7,16,12,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">
              Bookings
            </p>
            <h3
              id={titleId}
              className="mt-2 font-display text-3xl uppercase tracking-wide text-ink"
            >
              {event.title}
            </h3>
            <p className="mt-2 text-sm text-ink/55">
              {event.signups.length}/{event.capacity} booked
            </p>
          </div>
          <button
            type="button"
            aria-label="Close booking list"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/60 transition-colors hover:border-green-600 hover:text-green-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 py-5">
          {event.signups.map((signup) => (
            <li
              key={signup.id}
              className="flex flex-col gap-2 border-b border-ink/10 pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-sm text-ink/70">
                {signup.playerName} · {signup.parentName}
                <span className="mt-1 block text-xs text-ink/55">
                  <a href={`mailto:${signup.parentEmail}`} className="hover:text-green-700">
                    {signup.parentEmail}
                  </a>
                  {signup.parentPhone ? (
                    <>
                      {" · "}
                      <a href={`tel:${signup.parentPhone}`} className="hover:text-green-700">
                        {signup.parentPhone}
                      </a>
                    </>
                  ) : null}
                </span>
              </span>
              {cancelled || past ? null : (
                <ActionForm
                  action={cancelEventSignupAction}
                  confirm={{
                    title: "Cancel this booking?",
                    message:
                      "Are you sure you want to cancel this event booking? The spot will open back up.",
                    confirmLabel: "Cancel Booking",
                  }}
                >
                  <input type="hidden" name="signupId" value={signup.id} />
                  <Button type="submit" variant="onLight" size="sm">
                    Cancel
                  </Button>
                </ActionForm>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
