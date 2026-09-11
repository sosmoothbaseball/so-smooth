import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import PublicYearCalendar from "@/components/calendar/PublicYearCalendar";
import { getYearCalendarEvents } from "@/lib/portal/queries";
import { monthRange, parseMonthParam, type CalendarMark } from "@/lib/calendar-grid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Calendar | So Smooth",
  description: "The So Smooth calendar. Coaches update it from the portal.",
};

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const initialMonth = parseMonthParam(month);
  const { from, to } = monthRange();
  const events: CalendarMark[] = await getYearCalendarEvents(from, to);

  return (
    <>
      <PageHero
        eyebrow="Calendar"
        title={
          <>
            The <span className="text-green-400">Calendar</span>
          </>
        }
        description="One month at a time, up to a year ahead. Camps, clinics, and tryouts from Upcoming Events show here too. Click a marked day to see the details."
      />
      <section className="bg-bone py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <PublicYearCalendar initialMonth={initialMonth} events={events} />
        </div>
      </section>
    </>
  );
}
