import { requireCoach } from "@/lib/portal/auth";
import { getYearCalendarEvents } from "@/lib/portal/queries";
import { monthRange, parseMonthParam, type CalendarMark } from "@/lib/calendar-grid";
import PortalShell from "@/components/portal/PortalShell";
import CoachYearCalendar from "@/components/calendar/CoachYearCalendar";

export default async function CoachCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const user = await requireCoach();
  const { month } = await searchParams;
  const initialMonth = parseMonthParam(month);
  const { from, to } = monthRange();
  const events: CalendarMark[] = await getYearCalendarEvents(from, to);

  return (
    <PortalShell user={user} pathname="/portal/coach/calendar">
      <CoachYearCalendar initialMonth={initialMonth} events={events} />
    </PortalShell>
  );
}
