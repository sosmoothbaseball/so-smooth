import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import CTASection from "@/components/home/CTASection";
import TeamBoards from "@/components/team/TeamBoards";
import { SCHEDULE_URL } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Team | So Smooth",
  description:
    "So Smooth travel teams for ages 11U through 14U. Competitive, team-first baseball.",
};

const NOTES = [
  { title: "Tryouts", body: "Twice a year. Book a look through the scheduler." },
  { title: "Season", body: "Year-round training with tournament weekends." },
  { title: "Culture", body: "Same coaching language from 11U through 14U." },
];

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Travel Baseball"
        title={
          <>
            Teams <span className="text-green-400">11U-14U</span>
          </>
        }
        description="Select travel teams with real tournament play and a team-first culture. Switch age groups to see the open roster spots."
      />

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Age Groups"
            title="Four Teams. One Standard."
            description="Tap an age group. Roster cards stay blank until we add the real players."
          />
          <div className="mt-14">
            <TeamBoards />
          </div>
        </div>
      </section>

      <section className="bg-bone-dim py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-3">
          {NOTES.map((note) => (
            <div key={note.title} className="rounded-2xl border border-ink/10 bg-white p-8">
              <span className="h-1 w-8 rounded-full bg-yellow-500" />
              <h3 className="mt-5 font-display text-2xl uppercase tracking-wide text-ink">
                {note.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">{note.body}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Tryouts"
        title={
          <>
            Want A <span className="text-yellow-400">Roster Spot?</span>
          </>
        }
        description="Schedule a look through the same booking link we use for training."
        primary={{ href: SCHEDULE_URL, label: "Book a Tryout", external: true }}
        secondary={{ href: "/waiver", label: "Player Waiver" }}
      />
    </>
  );
}
