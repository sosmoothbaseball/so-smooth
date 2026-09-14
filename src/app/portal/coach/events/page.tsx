import Link from "next/link";
import { requireCoach } from "@/lib/portal/auth";
import { getPastEventPage, getUpcomingEvents } from "@/lib/portal/queries";
import { addUpcomingEventAction } from "@/lib/portal/actions";
import { toDateTimeLocal } from "@/lib/portal/dates";
import PortalShell from "@/components/portal/PortalShell";
import PortalPanel from "@/components/portal/PortalPanel";
import CoachEventCard, { type CoachEventCardData } from "@/components/portal/CoachEventCard";
import { SelectField, TextAreaField, TextField } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import ActionForm from "@/components/portal/ActionForm";

function toCard(event: {
  id: string;
  type: string;
  title: string;
  description: string;
  location: string;
  startsAt: Date;
  endsAt: Date;
  capacity: number;
  price: string;
  status: string;
  signups: {
    id: string;
    player: { name: string };
    parent: { name: string; email: string; phone: string };
  }[];
}): CoachEventCardData {
  return {
    id: event.id,
    type: event.type,
    title: event.title,
    description: event.description,
    location: event.location,
    startsAt: event.startsAt.toISOString(),
    endsAt: event.endsAt.toISOString(),
    capacity: event.capacity,
    price: event.price,
    status: event.status,
    signups: event.signups.map((signup) => ({
      id: signup.id,
      playerName: signup.player.name,
      parentName: signup.parent.name,
      parentEmail: signup.parent.email,
      parentPhone: signup.parent.phone,
    })),
  };
}

export default async function CoachEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await requireCoach();
  const { page } = await searchParams;
  const [events, history] = await Promise.all([
    getUpcomingEvents(),
    getPastEventPage(Number(page || "1")),
  ]);
  const start = new Date();
  start.setDate(start.getDate() + 12);
  start.setHours(9, 0, 0, 0);
  const end = new Date(start);
  end.setHours(12, 0, 0, 0);

  return (
    <PortalShell user={user} pathname="/portal/coach/events">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PortalPanel
          title="Add An Event"
          description="Camp, clinic, or tryout. Parents book these on Upcoming Events."
        >
          <ActionForm action={addUpcomingEventAction} className="flex flex-col gap-4" resetOnSuccess>
            <SelectField id="type" name="type" label="Type" defaultValue="clinic">
              <option value="camp">Camp</option>
              <option value="clinic">Clinic</option>
              <option value="tryout">Tryout</option>
            </SelectField>
            <TextField id="title" name="title" label="Title" required />
            <TextAreaField id="description" name="description" label="Details" />
            <TextField id="location" name="location" label="Location" defaultValue="Laguna Beach" />
            <TextField
              id="startsAt"
              name="startsAt"
              type="datetime-local"
              label="Starts"
              defaultValue={toDateTimeLocal(start)}
              min={toDateTimeLocal(new Date())}
              required
            />
            <TextField
              id="endsAt"
              name="endsAt"
              type="datetime-local"
              label="Ends"
              defaultValue={toDateTimeLocal(end)}
              min={toDateTimeLocal(new Date())}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="price"
                name="price"
                label="Price"
                defaultValue="$75"
                placeholder="$75"
                required
              />
              <TextField
                id="capacity"
                name="capacity"
                type="number"
                label="Capacity"
                defaultValue="12"
                min={1}
                max={200}
              />
            </div>
            <Button type="submit">Publish Event</Button>
          </ActionForm>
        </PortalPanel>

        <PortalPanel
          title="Upcoming"
          description="Live listings and cancelled ones that have not ended yet. After the end time they move to History."
        >
          <ul className="flex flex-col gap-4">
            {events.length === 0 && (
              <li className="text-sm text-ink/50">No upcoming events. Past ones are in History below.</li>
            )}
            {events.map((event) => (
              <CoachEventCard key={event.id} event={toCard(event)} />
            ))}
          </ul>
        </PortalPanel>
      </div>

      <div className="mt-6">
        <PortalPanel
          title="History"
          description="Ended and cancelled events stay here with the families who were booked."
        >
          <p className="mb-4 text-xs uppercase tracking-wide text-ink/40">
            {history.total} {history.total === 1 ? "past event" : "past events"}
          </p>
          <ul className="flex flex-col gap-3">
            {history.items.length === 0 && (
              <li className="text-sm text-ink/50">Nothing in history yet. Finished events land here.</li>
            )}
            {history.items.map((event) => (
              <CoachEventCard key={event.id} event={toCard(event)} past />
            ))}
          </ul>
          {history.pageCount > 1 ? (
            <div className="mt-6 flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
              {history.page > 1 ? (
                <Link
                  href={`/portal/coach/events?page=${history.page - 1}`}
                  className="text-green-700 hover:text-green-800"
                >
                  Previous
                </Link>
              ) : (
                <span className="text-ink/25">Previous</span>
              )}
              <span className="text-ink/45">
                Page {history.page} of {history.pageCount}
              </span>
              {history.page < history.pageCount ? (
                <Link
                  href={`/portal/coach/events?page=${history.page + 1}`}
                  className="text-green-700 hover:text-green-800"
                >
                  Next
                </Link>
              ) : (
                <span className="text-ink/25">Next</span>
              )}
            </div>
          ) : null}
        </PortalPanel>
      </div>
    </PortalShell>
  );
}
