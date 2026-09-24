import type { Metadata } from "next";
import { Mail, NotebookPen, ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/portal/auth";
import { isStaffRole } from "@/lib/portal/roles";
import PageHero from "@/components/ui/PageHero";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import CTASection from "@/components/home/CTASection";
import CollegeProgramForm from "@/components/college/CollegeProgramForm";

export const metadata: Metadata = {
  title: "College Program | So Smooth",
  description:
    "Build a player packet So Smooth coaches can send to college coaches.",
};

const STEPS = [
  {
    n: "01",
    title: "Sign in as a family",
    body: "Packets stay on your account so you can edit them later.",
    icon: ShieldCheck,
  },
  {
    n: "02",
    title: "Build the player packet",
    body: "Name, height, and weight are required. Add only the stats, accolades, bio, and link you want sent.",
    icon: NotebookPen,
  },
  {
    n: "03",
    title: "Coaches email it out",
    body: "Coaches send it to college coaches.",
    icon: Mail,
  },
];

export default async function CollegeProgramPage({
  searchParams,
}: {
  searchParams: Promise<{ packet?: string }>;
}) {
  const [{ packet }, session] = await Promise.all([searchParams, getSession()]);
  const viewer = !session
    ? { kind: "guest" as const }
    : isStaffRole(session.role)
      ? { kind: "coach" as const }
      : {
          kind: "parent" as const,
          name: session.name,
          players: session.players.map((player) => ({ id: player.id, name: player.name })),
        };

  return (
    <>
      <PageHero
        eyebrow="Recruiting Support"
        title={
          <>
            College <span className="text-green-400">Program</span>
          </>
        }
        description="Families fill in a player packet. Coaches can send it to college coaches."
      />

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <StaggerItem key={step.n}>
                <div className="h-full rounded-2xl border border-ink/10 bg-white p-8">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-green-700 text-bone">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 font-display text-4xl text-green-700">{step.n}</p>
                  <h3 className="mt-3 font-display text-2xl uppercase tracking-wide text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{step.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <CollegeProgramForm viewer={viewer} openSubmit={packet === "1"} />
        </div>
      </section>

      <CTASection
        eyebrow="Already Training Here"
        title={
          <>
            Keep The Work <span className="text-yellow-400">Going</span>
          </>
        }
        description="College packets sit with the staff. Lessons, camps, and clinics stay on the board for this week."
        primary={{ href: "/lessons", label: "Private Lessons" }}
        secondary={{ href: "/events", label: "Upcoming Events" }}
      />
    </>
  );
}
