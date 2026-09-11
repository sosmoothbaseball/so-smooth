import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import CoachLessonCard from "@/components/lessons/CoachLessonCard";
import {
  initialsFromName,
  slugFromName,
  slotsForCoach,
  type LessonCoachCard,
  type PublicSlot,
} from "@/lib/lessons";
import { getSession } from "@/lib/portal/auth";
import { getLessonCoaches, getOpenSlotsByCoach } from "@/lib/portal/queries";
import { staffSlugForName } from "@/lib/staff";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Private Lessons | So Smooth",
  description: "Book a 1-on-1 private lesson with a So Smooth coach.",
};

function toPublicSession(session: Awaited<ReturnType<typeof getSession>>) {
  if (!session) return null;
  return {
    id: session.id,
    name: session.name,
    role: session.role,
    players: session.players.map((player) => ({
      id: player.id,
      name: player.name,
      ageGroup: player.ageGroup,
    })),
  };
}

function toLessonCard(coach: Awaited<ReturnType<typeof getLessonCoaches>>[number]): LessonCoachCard {
  return {
    id: coach.id,
    name: coach.name,
    slug: coach.lessonSpec?.slug || staffSlugForName(coach.name) || slugFromName(coach.name),
    initials: coach.lessonSpec?.initials || initialsFromName(coach.name) || "SS",
    role: coach.lessonSpec?.title || "Coach",
    price: coach.lessonSpec?.price || "$75",
    location: coach.lessonSpec?.location || "Laguna Beach",
    email: coach.email,
  };
}

export default async function LessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ book?: string }>;
}) {
  const [{ book }, slots, session, coaches] = await Promise.all([
    searchParams,
    getOpenSlotsByCoach(),
    getSession(),
    getLessonCoaches(),
  ]);

  const publicSlots: PublicSlot[] = slots.map((slot) => ({
    id: slot.id,
    coachId: slot.coachId,
    startsAt: slot.startsAt.toISOString(),
    endsAt: slot.endsAt.toISOString(),
    coachName: slot.coach.name,
    coachEmail: slot.coach.email,
  }));

  const cards = coaches.map(toLessonCard);
  const sessionPayload = toPublicSession(session);

  return (
    <>
      <PageHero
        eyebrow="Private Lessons"
        title={
          <>
            Book A <span className="text-green-400">Lesson</span>
          </>
        }
        description="Open times for this week. Price and location come from each coach’s lesson specs."
      />
      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6">
          {publicSlots.length === 0 && (
            <p className="rounded-3xl border border-dashed border-ink/15 bg-white px-6 py-8 text-sm text-ink/55">
              No open lesson times this week. Coaches set repeating weekly hours from the portal.
            </p>
          )}
          {cards.map((coach) => {
            const coachSlots = slotsForCoach(publicSlots, coach);
            return (
              <CoachLessonCard
                key={coach.slug}
                coach={coach}
                slots={coachSlots}
                session={sessionPayload}
                initialSlotId={
                  book && coachSlots.some((slot) => slot.id === book) ? book : undefined
                }
              />
            );
          })}
        </div>
      </section>
    </>
  );
}
