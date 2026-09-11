import { requireCoach } from "@/lib/portal/auth";
import { getUpcomingEvents } from "@/lib/portal/queries";
import { addUpcomingEventAction } from "@/lib/portal/actions";
import { toDateTimeLocal } from "@/lib/portal/dates";
import PortalShell from "@/components/portal/PortalShell";
import PortalPanel from "@/components/portal/PortalPanel";
import CoachEventCard from "@/components/portal/CoachEventCard";
import { SelectField, TextAreaField, TextField } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import ActionForm from "@/components/portal/ActionForm";

export default async function CoachEventsPage() {
  const user = await requireCoach();
  const events = await getUpcomingEvents();
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
          description="These show on Upcoming Events until they end. Edit to change the listing. Removing one also drops the signups."
        >
          <ul className="flex flex-col gap-4">
            {events.length === 0 && (
              <li className="text-sm text-ink/50">No upcoming events. Past ones drop off after they end.</li>
            )}
            {events.map((event) => (
              <CoachEventCard
                key={event.id}
                event={{
                  id: event.id,
                  type: event.type,
                  title: event.title,
                  description: event.description,
                  location: event.location,
                  startsAt: event.startsAt.toISOString(),
                  endsAt: event.endsAt.toISOString(),
                  capacity: event.capacity,
                  price: event.price,
                  signups: event.signups.map((signup) => ({
                    id: signup.id,
                    playerName: signup.player.name,
                    parentName: signup.parent.name,
                  })),
                }}
              />
            ))}
          </ul>
        </PortalPanel>
      </div>
    </PortalShell>
  );
}
