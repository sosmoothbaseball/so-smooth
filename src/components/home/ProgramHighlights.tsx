import Link from "next/link";
import { ArrowRight, Trophy, Dumbbell } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const ROWS = [
  {
    icon: Trophy,
    eyebrow: "So Smooth Style",
    title: "The Travel Team Program",
    description:
      "Competitive select teams for 10U, 11U, 12U, and 14U, built on strong instruction, consistent teammates, and a genuine team-first culture. Twice-yearly tryouts, year-round tournament play.",
    cta: { label: "Meet the Team", href: "/team" },
    figure: "10–12U, 14U",
    reverse: false,
  },
  {
    icon: Dumbbell,
    eyebrow: "Lessons · Clinics · Camps",
    title: "Training From Youth to Professional",
    description:
      "Private lessons, small-group clinics, and seasonal camps from youth fundamentals through professional development, with high reps, real feedback, and coaches who care about the details.",
    cta: { label: "View Training", href: "/training" },
    figure: "Youth-Pro",
    reverse: true,
  },
];

export default function ProgramHighlights() {
  return (
    <section className="bg-bone-dim py-24 sm:py-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-20 px-6">
        {ROWS.map((row) => (
          <AnimatedSection
            key={row.title}
            className={cn(
              "grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16",
            )}
          >
            <div className={cn(row.reverse && "lg:order-2")}>
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                {row.eyebrow}
              </span>
              <h3 className="mt-4 font-display text-3xl uppercase tracking-wide text-ink sm:text-4xl md:text-5xl">
                {row.title}
              </h3>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-ink/65">
                {row.description}
              </p>
              <Button href={row.cta.href} className="mt-8">
                {row.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className={cn("relative", row.reverse && "lg:order-1")}>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-green-800 shadow-[0_30px_60px_-25px_rgba(10,42,28,0.5)]">
                <div className="bg-grid absolute inset-0 opacity-30" />
                <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-green-500/25 blur-3xl" />
                <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-yellow-500/15 blur-3xl" />
                <div className="relative flex h-full flex-col items-center justify-center gap-4">
                  <row.icon className="h-12 w-12 text-yellow-400" />
                  <span className="font-display text-5xl sm:text-6xl uppercase tracking-wide text-bone">
                    {row.figure}
                  </span>
                  <span className="text-xs uppercase tracking-[0.25em] text-bone/60">
                    So Smooth
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400" />
              </div>
              <Link
                href={row.cta.href}
                className="absolute -bottom-5 left-6 flex items-center gap-2 rounded-full bg-bone px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Learn More
                <ArrowRight className="h-3.5 w-3.5 text-green-600" />
              </Link>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
