import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import CTASection from "@/components/home/CTASection";
import { STAFF_COACHES, type StaffCoach } from "@/lib/staff";
import HashScroll from "@/components/staff/HashScroll";
import Button from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Staff | So Smooth",
  description:
    "Meet the So Smooth coaching staff: Carlos Vega, Roberto Bueno, Crix Taveras, Julio C., and Alex Howard.",
};

function CoachCard({ coach }: { coach: StaffCoach }) {
  const filled = Boolean(
    coach.goal || coach.experience?.length || coach.honors?.length || coach.link,
  );

  return (
    <article
      id={coach.slug}
      className="flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_24px_50px_-28px_rgba(7,16,12,0.35)] scroll-mt-28"
    >
      <div className="relative bg-green-800 px-8 py-10">
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div className="absolute -left-10 top-8 h-32 w-32 rounded-full bg-yellow-500/15 blur-3xl" />
        <div className="relative flex flex-col items-center text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-ink text-bone ring-2 ring-yellow-500">
            <span className="font-display text-4xl">{coach.initials}</span>
          </div>
          <h2 className="mt-6 font-display text-4xl uppercase tracking-wide text-bone sm:text-5xl">
            {coach.name}
          </h2>
          {coach.role ? (
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-yellow-400">
              {coach.role}
            </p>
          ) : (
            <div className="mt-3 h-2.5 w-36 rounded bg-bone/20" />
          )}
          {coach.instagram && (
            <a
              href={coach.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${coach.name} on Instagram`}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-yellow-500/45 bg-ink/25 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-yellow-400 transition-colors hover:border-yellow-400 hover:bg-yellow-500/15 hover:text-yellow-300"
            >
              <InstagramIcon className="h-3.5 w-3.5" />
              Instagram
            </a>
          )}
        </div>
      </div>

      {filled ? (
        <div className="flex flex-1 flex-col p-7 sm:p-8">
          {coach.goal && (
            <div className="space-y-4">
              {coach.goal.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="text-sm leading-relaxed text-ink/70">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {coach.experience && coach.experience.length > 0 && (
            <>
              <h3 className="mt-8 font-display text-xl uppercase tracking-wide text-ink">
                Baseball Career & Experience
              </h3>
              <ul className="mt-4 space-y-2.5">
                {coach.experience.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {Boolean(coach.honors?.length || coach.link) ? (
            <div className="mt-auto pt-8">
              {coach.honors && coach.honors.length > 0 && (
                <>
                  <h3 className="font-display text-xl uppercase tracking-wide text-ink">
                    Awards & Honors
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {coach.honors.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {coach.link && (
                <Button
                  href={coach.link.href}
                  external
                  variant="secondary"
                  size="lg"
                  className={coach.honors && coach.honors.length > 0 ? "mt-6" : undefined}
                >
                  {coach.link.label}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-1 flex-col p-7 sm:p-8">
          <div className="h-2.5 w-full rounded bg-ink/5" />
          <div className="mt-2 h-2.5 w-5/6 rounded bg-ink/5" />
          <div className="mt-2 h-2.5 w-2/3 rounded bg-ink/5" />
          <div className="mt-8 h-4 w-1/2 rounded bg-ink/10" />
          <div className="mt-4 h-2.5 w-full rounded bg-ink/5" />
          <div className="mt-2 h-2.5 w-4/5 rounded bg-ink/5" />
          <div className="mt-2 h-2.5 w-3/4 rounded bg-ink/5" />
          <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-ink/35">
            Bio drops in later
          </p>
        </div>
      )}
    </article>
  );
}

export default function StaffPage() {
  return (
    <>
      <HashScroll />
      <PageHero
        eyebrow="Coaches"
        title={
          <>
            Meet The <span className="text-green-400">Staff</span>
          </>
        }
      />

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <StaggerGroup className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
            {STAFF_COACHES.map((coach) => (
              <StaggerItem key={coach.name} className="h-full">
                <CoachCard coach={coach} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <CTASection
        eyebrow="Join The Staff"
        title={
          <>
            Want To <span className="text-yellow-400">Coach Here?</span>
          </>
        }
        description="If you can run a cage, teach a standard, and stay in the work, send the form."
        primary={{ href: "/careers", label: "Apply Now" }}
        secondary={{ href: "/training", label: "View Training" }}
      />
    </>
  );
}
