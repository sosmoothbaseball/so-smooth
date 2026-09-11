import { requireParent } from "@/lib/portal/auth";
import { getParentEventSignups, getParentLessonBookings } from "@/lib/portal/queries";
import { cancelEventSignupAction, cancelLessonBookingAction } from "@/lib/portal/actions";
import { eventTypeLabel, formatRange } from "@/lib/portal/dates";
import PortalShell from "@/components/portal/PortalShell";
import PortalPanel from "@/components/portal/PortalPanel";
import Button from "@/components/ui/Button";
import ActionForm from "@/components/portal/ActionForm";

export default async function ParentBookingsPage() {
  const user = await requireParent();
  const lessons = await getParentLessonBookings(user.id);
  const events = await getParentEventSignups(user.id);

  return (
    <PortalShell user={user} pathname="/portal/parent">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PortalPanel title="Lesson Bookings">
          <ul className="flex flex-col gap-3">
            {lessons.length === 0 && (
              <li className="text-sm text-ink/50">No upcoming lesson bookings.</li>
            )}
            {lessons.map((booking) => (
              <li key={booking.id} className="rounded-2xl border border-ink/10 px-4 py-4">
                <p className="font-display text-2xl uppercase tracking-wide text-ink">
                  {booking.player.name}
                </p>
                <p className="mt-1 text-sm text-ink/60">with {booking.slot.coach.name}</p>
                <p className="mt-2 text-sm text-ink/70">
                  {formatRange(booking.slot.startsAt, booking.slot.endsAt)}
                </p>
                <ActionForm
                  action={cancelLessonBookingAction}
                  className="mt-4"
                  confirm={{
                    title: "Cancel this lesson?",
                    message: "Are you sure you want to cancel this lesson?",
                    confirmLabel: "Cancel Lesson",
                  }}
                >
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <Button type="submit" variant="onLight" size="sm">
                    Cancel Booking
                  </Button>
                </ActionForm>
              </li>
            ))}
          </ul>
        </PortalPanel>

        <PortalPanel title="Camps · Clinics · Tryouts">
          <ul className="flex flex-col gap-3">
            {events.length === 0 && (
              <li className="text-sm text-ink/50">No upcoming event bookings.</li>
            )}
            {events.map((signup) => (
              <li key={signup.id} className="rounded-2xl border border-ink/10 px-4 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700">
                  {eventTypeLabel(signup.event.type)}
                </p>
                <p className="mt-1 font-display text-2xl uppercase tracking-wide text-ink">
                  {signup.event.title}
                </p>
                <p className="mt-1 text-sm text-ink/60">{signup.player.name}</p>
                <p className="mt-2 text-sm text-ink/70">
                  {formatRange(signup.event.startsAt, signup.event.endsAt)}
                </p>
                {signup.event.price ? (
                  <p className="mt-1 text-sm text-ink/50">{signup.event.price}</p>
                ) : null}
                <ActionForm
                  action={cancelEventSignupAction}
                  className="mt-4"
                  confirm={{
                    title: "Cancel this booking?",
                    message: "Are you sure you want to cancel this event booking?",
                    confirmLabel: "Cancel Booking",
                  }}
                >
                  <input type="hidden" name="signupId" value={signup.id} />
                  <Button type="submit" variant="onLight" size="sm">
                    Cancel Booking
                  </Button>
                </ActionForm>
              </li>
            ))}
          </ul>
        </PortalPanel>
      </div>
    </PortalShell>
  );
}
