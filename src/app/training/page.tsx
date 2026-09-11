import type { Metadata } from "next";
import { ArrowRight, CalendarClock, GraduationCap } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Training | So Smooth",
  description: "Book private lessons, group clinics, and camps with So Smooth coaches.",
};

const STEPS = [
  { n: "01", title: "Pick a program", body: "Private lesson, clinic, camp, or a tryout look." },
  { n: "02", title: "Take an open time", body: "Coaches set repeating weekly hours. Families book any open time this week." },
  { n: "03", title: "Manage it in the portal", body: "Parents can change bookings from View Bookings." },
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
        description="Youth through professional. Private lessons for this week, plus every camp, clinic, and tryout coaches have added."
        actions={
          <>
            <Button href="/lessons" size="lg">
              Private Lessons
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/events" variant="outline" size="lg">
              Upcoming Events
            </Button>
          </>
        }
      />

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
            title="This Week"
            description="Private lesson times stay on the board until they are taken or the clock passes them."
          />
          <div className="relative mt-12 overflow-hidden rounded-3xl border border-white/10 bg-green-900 px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="bg-grid absolute inset-0 opacity-20" />
            <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-yellow-500/20 blur-3xl" />
            <div className="relative">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-700 text-bone">
                <CalendarClock className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-display text-4xl uppercase tracking-wide text-bone sm:text-5xl">
                Open Lesson Times
              </h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-bone/65 sm:text-base">
                Every coach’s open times for this week, from their repeating weekly hours. Sign in as a parent to lock one in.
              </p>
              <Button href="/lessons" size="lg" className="mt-8">
                Private Lessons
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Who We Train"
            title="Training For Every Level"
          />

          <div className="mt-12 overflow-hidden rounded-3xl border border-ink/10 bg-white px-6 py-8 sm:px-10">
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
            Take An <span className="text-yellow-400">Open Time</span>
          </>
        }
        description="Private lessons on Private Lessons. Camps, clinics, and tryouts on Upcoming Events. The calendar stays in sync with the coaches."
        primary={{ href: "/lessons", label: "Private Lessons" }}
        secondary={{ href: "/events", label: "Upcoming Events" }}
      />
    </>
  );
}
