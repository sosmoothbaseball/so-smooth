import type { Metadata } from "next";
import { GraduationCap, Mail, NotebookPen, Users } from "lucide-react";
import { getSession } from "@/lib/portal/auth";
import { isStaffRole } from "@/lib/portal/roles";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import CTASection from "@/components/home/CTASection";
import CollegeProgramForm from "@/components/college/CollegeProgramForm";

export const metadata: Metadata = {
  title: "College Program | So Smooth",
  description:
    "The So Smooth College Program helps players take the next step, with staff who play, coach, and connect at colleges nationwide.",
};

const PILLARS = [
  {
    icon: GraduationCap,
    title: "College Experience",
    body: "Our staff has played and coached at colleges across the country.",
  },
  {
    icon: Users,
    title: "Real Connections",
    body: "Strong relationships with college coaches nationwide, used to open the right doors.",
  },
  {
    icon: Mail,
    title: "Campus Ready",
    body: "We help players find the right opportunity and prepare them to make an impact on campus.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Build the player profile",
    body: "Parents share stats, accolades, physical attributes, high school and club information, and the other details college coaches look for.",
    icon: NotebookPen,
  },
  {
    n: "02",
    title: "Staff reaches out",
    body: "So Smooth coaches use each profile to introduce our athletes and start conversations with college programs.",
    icon: Mail,
  },
  {
    n: "03",
    title: "Find the right fit",
    body: "The goal is a real opportunity to keep playing the game they love at the next level.",
    icon: GraduationCap,
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
      : { kind: "parent" as const, name: session.name };

  return (
    <>
      <PageHero
        eyebrow="The Next Level"
        title={
          <>
            College <span className="text-green-400">Program</span>
          </>
        }
        description="Help players take the next step in their baseball journey and turn college dreams into a reality."
      />

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-green-600 sm:text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                So Smooth College
              </span>
              <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] tracking-wide text-ink sm:text-5xl md:text-6xl">
                Built To Get Players On Campus
              </h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-ink/70 sm:text-lg">
                <p>
                  The So Smooth College Program is designed to help players take the next step in
                  their baseball journey and turn their college dreams into a reality. Our staff
                  has experience playing and coaching at colleges across the country, along with
                  strong relationships and connections with college coaches nationwide. We take
                  pride in helping players find the right opportunity and preparing them to make
                  an impact once they step foot on campus.
                </p>
                <p>
                  Parents will provide us with information for their player&apos;s profile
                  containing stats, accolades, physical attributes, high school and club
                  information, and other important details college coaches look for. From there,
                  our So Smooth staff will use each player&apos;s profile to reach out to college
                  coaches, introduce our athletes, and help create opportunities for them to
                  continue playing the game they love at the next level.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-green-800 shadow-[0_30px_60px_-25px_rgba(10,42,28,0.5)]">
              <div className="bg-grid absolute inset-0 opacity-30" />
              <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-green-500/25 blur-3xl" />
              <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-yellow-500/15 blur-3xl" />
              <div className="relative flex flex-col gap-6 p-8 sm:p-9">
                <GraduationCap className="h-10 w-10 text-yellow-400" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-yellow-400">
                    So Smooth
                  </p>
                  <p className="mt-2 font-display text-3xl uppercase leading-[0.95] tracking-wide text-bone sm:text-4xl">
                    College Dreams.
                    <br />
                    Real Opportunities.
                  </p>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400" />
              </div>
            </div>
          </div>

          <StaggerGroup className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PILLARS.map((item) => (
              <StaggerItem key={item.title}>
                <div className="h-full rounded-2xl border border-ink/10 bg-white p-8">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-green-700 text-bone">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl uppercase tracking-wide text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{item.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-bone-dim py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="How It Works"
            title="From Profile To Introduction"
            description="Families build the profile. So Smooth staff takes it to college coaches."
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
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
        description="The college profile sits with the staff. Lessons, camps, and clinics stay on the board for this week."
        primary={{ href: "/lessons", label: "Private Lessons" }}
        secondary={{ href: "/events", label: "Upcoming Events" }}
      />
    </>
  );
}
