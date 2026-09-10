import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, CalendarClock, Dumbbell, GraduationCap, Users } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import CTASection from "@/components/home/CTASection";
import { SCHEDULE_URL } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Training | So Smooth",
  description:
    "Book private lessons, group clinics, and camps with So Smooth. Scheduling opens in our booking app.",
};

const STEPS = [
  { n: "01", title: "Pick a program", body: "Lesson, clinic, camp, or a tryout look." },
  { n: "02", title: "Open the scheduler", body: "Real times and spots live in our booking app." },
  { n: "03", title: "Confirm there", body: "Pay, save your spot, and get the reminder from that same app." },
];

const PROGRAMS = [
  {
    icon: Dumbbell,
    title: "Private Lessons",
    meta: "60 min · 1-on-1",
    description:
      "Hitting, pitching, catching, or infield. Booked one player at a time through the scheduler.",
  },
  {
    icon: Users,
    title: "Group Clinics",
    meta: "Small group · Age-banded",
    description:
      "High-rep sessions from youth fundamentals through advanced work, grouped by level.",
  },
  {
    icon: CalendarClock,
    title: "Camps",
    meta: "Seasonal · Full days",
    description:
      "Holiday and summer camps with real coaching, not babysitting. Dates live in the scheduler.",
  },
];

const LEVELS = ["Youth", "Travel", "High School", "College", "Professional"];

export default function TrainingPage() {
  return (
    <>
      <PageHero
        eyebrow="Lessons · Clinics · Camps"
        title={
          <>
            Book Your <span className="text-green-400">Training</span>
          </>
        }
        description="Youth through professional. Pick what you need, then continue into our scheduler to lock the time."
        actions={
          <>
            <Button href={SCHEDULE_URL} size="lg" external>
              Open Scheduler
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button href="/team" variant="outline" size="lg">
              View Teams
            </Button>
          </>
        }
      />

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="How Booking Works"
            title="Start Here. Finish In The Scheduler."
            description="This site explains the programs. The live calendar, spots, and checkout sit in our booking app."
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <StaggerItem key={step.n}>
                <div className="h-full rounded-2xl border border-ink/10 bg-white p-8">
                  <span className="font-display text-4xl text-green-700">{step.n}</span>
                  <h3 className="mt-4 font-display text-2xl uppercase tracking-wide text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{step.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-ink py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading
            dark
            eyebrow="Live Booking"
            title="Book In The Scheduler"
            description="Times, spots, and payment are in our booking app. This button is the front door."
          />
          <div className="relative mt-12 overflow-hidden rounded-3xl border border-white/10 bg-green-900 px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="bg-grid absolute inset-0 opacity-20" />
            <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-yellow-500/20 blur-3xl" />
            <div className="relative">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-700 text-bone">
                <CalendarClock className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-display text-4xl uppercase tracking-wide text-bone sm:text-5xl">
                Open The Booking App
              </h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-bone/65 sm:text-base">
                Lessons, clinics, camps, and tryouts. You will finish the reservation off this site.
              </p>
              <Button href={SCHEDULE_URL} size="lg" className="mt-8" external>
                Continue to Scheduler
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="What You Can Book"
            title="Training For Every Level"
            description="Same staff language from first swings through higher-level work."
          />

          <StaggerGroup className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PROGRAMS.map(({ icon: Icon, title, meta, description }) => (
              <StaggerItem key={title}>
                <a
                  href={SCHEDULE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-green-500/40 hover:shadow-[0_18px_40px_-15px_rgba(18,92,59,0.35)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-700 text-bone transition-transform duration-300 group-hover:scale-110 group-hover:bg-green-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">
                      {meta}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl uppercase tracking-wide text-ink">
                    {title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">
                    {description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-700">
                    Book in scheduler
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <div className="mt-16 overflow-hidden rounded-3xl border border-ink/10 bg-white px-6 py-8 sm:px-10">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-green-700" />
                <p className="font-display text-2xl uppercase tracking-wide text-ink">
                  Youth to Professional
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((level) => (
                  <span
                    key={level}
                    className="rounded-full border border-ink/10 bg-bone px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink/70"
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Ready When You Are"
        title={
          <>
            Open The <span className="text-yellow-400">Scheduler</span>
          </>
        }
        description="Same button from the hero and every program card. That is the front door."
        primary={{ href: SCHEDULE_URL, label: "Open Scheduler", external: true }}
        secondary={{ href: "/staff", label: "Meet the Staff" }}
      />
    </>
  );
}
