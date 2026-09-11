import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import BookButton, { PortalHint } from "@/components/portal/BookButton";
import { getSession } from "@/lib/portal/auth";
import { getPublicEvents } from "@/lib/portal/queries";
import { bookEventAction } from "@/lib/portal/actions";
import { eventTypeLabel, formatRange } from "@/lib/portal/dates";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Upcoming Events | So Smooth",
  description: "Book camps, clinics, and tryouts.",
};

export default async function EventsPage() {
  const [events, session] = await Promise.all([getPublicEvents(), getSession()]);
  const now = new Date();
  const user = session
    ? {
        id: session.id,
        name: session.name,
        role: session.role,
        players: session.players.map((player) => ({
          id: player.id,
          name: player.name,
          ageGroup: player.ageGroup,
        })),
      }
    : null;

  return (
    <>
      <PageHero
        eyebrow="Camps · Clinics · Tryouts"
        title={
          <>
            Upcoming <span className="text-green-400">Events</span>
          </>
        }
        description="Coaches publish these from the portal. Past events drop off as soon as they end."
      />
      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <PortalHint />
          <ul className="mt-8 flex flex-col gap-4">
            {events.length === 0 && (
              <li className="rounded-3xl border border-dashed border-ink/15 bg-white px-6 py-10 text-sm text-ink/50">
                No upcoming events right now. When a coach adds a camp, clinic, or tryout, it
                shows here.
              </li>
            )}
            {events.map((event) => {
              const taken = event._count.signups;
              const full = taken >= event.capacity;
              const started = event.startsAt <= now;
              return (
                <li key={event.id} className="rounded-3xl border border-ink/10 bg-white px-6 py-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700">
                    {eventTypeLabel(event.type)}
                  </p>
                  <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="font-display text-3xl uppercase tracking-wide text-ink">
                        {event.title}
                      </h2>
                      <p className="mt-2 text-sm text-ink/60">
                        {formatRange(event.startsAt, event.endsAt)}
                      </p>
                      <p className="mt-1 text-sm text-ink/50">{event.location}</p>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/70">
                        {event.description}
                      </p>
                      <p className="mt-3 text-xs uppercase tracking-wide text-ink/40">
                        {event.price} · {taken}/{event.capacity} spots
                      </p>
                    </div>
                    {started ? (
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                        In progress
                      </p>
                    ) : full ? (
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                        Full
                      </p>
                    ) : (
                      <BookButton
                        user={user}
                        action={bookEventAction}
                        hiddenFields={{ eventId: event.id }}
                        confirmTitle={event.title}
                        confirmDetail={`${formatRange(event.startsAt, event.endsAt)} · ${event.location} · ${event.price}`}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
