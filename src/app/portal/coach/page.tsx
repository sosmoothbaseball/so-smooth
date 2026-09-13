import { requireCoach } from "@/lib/portal/auth";
import { getCoachBookings, getCoachSlots } from "@/lib/portal/queries";
import {
  blockLessonDayAction,
  cancelLessonBookingAction,
  removeLessonSlotAction,
} from "@/lib/portal/actions";
import { getWeeklyHours } from "@/lib/portal/availability";
import { formatRange } from "@/lib/portal/dates";
import { dayKey, formatSlotDay, weekDays } from "@/lib/lessons";
import PortalShell from "@/components/portal/PortalShell";
import PortalPanel from "@/components/portal/PortalPanel";
import WeeklyHoursForm from "@/components/portal/WeeklyHoursForm";
import Button from "@/components/ui/Button";
import ActionForm from "@/components/portal/ActionForm";
import ParentContact from "@/components/portal/ParentContact";
import OfferLessonsCard from "@/components/portal/OfferLessonsCard";

export default async function CoachSchedulePage() {
  const user = await requireCoach();
  const [slots, bookings, hours] = await Promise.all([
    getCoachSlots(user.id),
    getCoachBookings(user.id),
    getWeeklyHours(user.id),
  ]);
  const offering = hours.length > 0;
  const todayKey = dayKey(new Date());
  const upcomingDays = weekDays(0)
    .filter((date) => dayKey(date) >= todayKey)
    .map((date) => {
      const key = dayKey(date);
      const daySlots = slots.filter((slot) => dayKey(slot.startsAt) === key);
      return {
        date,
        key,
        openSlots: daySlots.filter((slot) => slot.status === "open"),
        bookedSlots: daySlots.filter((slot) => slot.status === "booked"),
      };
    });

  return (
    <PortalShell user={user} pathname="/portal/coach">
      <OfferLessonsCard offering={offering}>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <PortalPanel
          title="Set Availability"
          description="Set hours once. They repeat every week. Families only see future open times for this week."
        >
          <WeeklyHoursForm hours={hours} />
        </PortalPanel>

        <PortalPanel title="Upcoming Times">
          <ul className="flex flex-col gap-3">
            {upcomingDays.map((day) => {
              const empty = day.openSlots.length === 0 && day.bookedSlots.length === 0;
              return (
                <li key={day.key} className="rounded-2xl border border-ink/10 px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-ink">{formatSlotDay(day.date)}</p>
                    {day.openSlots.length > 0 && (
                      <ActionForm
                        action={blockLessonDayAction}
                        confirm={{
                          title: "Clear this day?",
                          message: "Are you sure you want to remove every open time on this day?",
                          confirmLabel: "Clear Day",
                        }}
                      >
                        <input type="hidden" name="day" value={day.key} />
                        <Button type="submit" variant="onLight" size="sm">
                          Clear day
                        </Button>
                      </ActionForm>
                    )}
                  </div>
                  {empty && (
                    <p className="mt-3 text-sm text-ink/45">No time slots this day.</p>
                  )}
                  {day.openSlots.length > 0 && (
                    <ul className="mt-3 flex flex-col gap-2">
                      {day.openSlots.map((slot) => (
                        <li
                          key={slot.id}
                          className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <p className="text-sm text-ink/80">
                            {formatRange(slot.startsAt, slot.endsAt)}
                          </p>
                          <ActionForm
                            action={removeLessonSlotAction}
                            confirm={{
                              title: "Remove this time?",
                              message: "Are you sure you want to remove this slot?",
                              confirmLabel: "Remove",
                            }}
                          >
                            <input type="hidden" name="slotId" value={slot.id} />
                            <Button type="submit" variant="onLight" size="sm">
                              Remove
                            </Button>
                          </ActionForm>
                        </li>
                      ))}
                    </ul>
                  )}
                  {day.bookedSlots.length > 0 && (
                    <ul className="mt-3 flex flex-col gap-2">
                      {day.bookedSlots.map((slot) => (
                        <li
                          key={slot.id}
                          className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="text-sm text-ink/80">
                              {formatRange(slot.startsAt, slot.endsAt)}
                            </p>
                            {slot.booking ? (
                              <ParentContact
                                name={slot.booking.parent.name}
                                email={slot.booking.parent.email}
                                phone={slot.booking.parent.phone}
                              />
                            ) : null}
                          </div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                            Booked — cancel the lesson first
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </PortalPanel>
      </div>
      </OfferLessonsCard>

      {(offering || bookings.length > 0) && (
      <div className="mt-6">
        <PortalPanel title="Booked Lessons">
          <ul className="flex flex-col gap-3">
            {bookings.length === 0 && (
              <li className="text-sm text-ink/50">No booked lessons yet.</li>
            )}
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="flex flex-col gap-3 rounded-2xl border border-ink/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-display text-2xl uppercase tracking-wide text-ink">
                    {booking.player.name}
                  </p>
                  <p className="mt-1 text-sm text-ink/60">{booking.player.ageGroup}</p>
                  <ParentContact
                    name={booking.parent.name}
                    email={booking.parent.email}
                    phone={booking.parent.phone}
                  />
                  <p className="mt-2 text-sm text-ink/70">
                    {formatRange(booking.slot.startsAt, booking.slot.endsAt)}
                  </p>
                </div>
                <ActionForm
                  action={cancelLessonBookingAction}
                  confirm={{
                    title: "Cancel this lesson?",
                    message: "Are you sure you want to cancel this lesson?",
                    confirmLabel: "Cancel Lesson",
                  }}
                >
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <Button type="submit" variant="onLight" size="sm">
                    Cancel
                  </Button>
                </ActionForm>
              </li>
            ))}
          </ul>
        </PortalPanel>
      </div>
      )}
    </PortalShell>
  );
}
