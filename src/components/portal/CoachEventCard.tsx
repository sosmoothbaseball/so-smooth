"use client";

import { useState } from "react";
import ActionForm from "@/components/portal/ActionForm";
import Button from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/FormField";
import {
  cancelEventSignupAction,
  removeUpcomingEventAction,
  updateUpcomingEventAction,
} from "@/lib/portal/actions";
import { eventTypeLabel, formatRange, toDateTimeLocal } from "@/lib/portal/dates";

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
  signups: {
    id: string;
    playerName: string;
    parentName: string;
    parentEmail: string;
    parentPhone: string;
  }[];
};

export default function CoachEventCard({ event }: { event: CoachEventCardData }) {
  const [editing, setEditing] = useState(false);
  const startsAt = new Date(event.startsAt);
  const endsAt = new Date(event.endsAt);

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
    <li className="rounded-2xl border border-ink/10 px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700">
        {eventTypeLabel(event.type)}
      </p>
      <p className="mt-1 font-display text-2xl uppercase tracking-wide text-ink">{event.title}</p>
      <p className="mt-2 text-sm text-ink/60">{formatRange(startsAt, endsAt)}</p>
      {event.location ? <p className="mt-1 text-sm text-ink/50">{event.location}</p> : null}
      <p className="mt-1 text-sm text-ink/50">
        {event.price} · {event.signups.length}/{event.capacity} booked
      </p>
      {event.signups.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-ink/70">
          {event.signups.map((signup) => (
            <li
              key={signup.id}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <span>
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
              <ActionForm
                action={cancelEventSignupAction}
                confirm={{
                  title: "Cancel this booking?",
                  message: "Are you sure you want to cancel this event booking? The spot will open back up.",
                  confirmLabel: "Cancel Booking",
                }}
              >
                <input type="hidden" name="signupId" value={signup.id} />
                <Button type="submit" variant="onLight" size="sm">
                  Cancel
                </Button>
              </ActionForm>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => setEditing(true)}>
          Edit Event
        </Button>
        <ActionForm
          action={removeUpcomingEventAction}
          confirm={{
            title: "Remove this event?",
            message: "Are you sure you want to remove this event? Signups for it will be dropped.",
            confirmLabel: "Remove Event",
          }}
        >
          <input type="hidden" name="eventId" value={event.id} />
          <Button type="submit" variant="onLight" size="sm">
            Remove Event
          </Button>
        </ActionForm>
      </div>
    </li>
  );
}
