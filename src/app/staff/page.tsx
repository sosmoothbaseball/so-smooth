import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Staff | So Smooth",
  description: "Meet the So Smooth coaching staff, led by Carlos Vega.",
};

const FEATURED = {
  name: "Carlos Vega",
  age: 23,
  role: "Owner & Head Coach",
  extra: "So Smooth Baseball",
  initials: "CV",
  bio: "Carlos is the owner and head coach of So Smooth. At 23 he is still in the work, in the cage and on the field with the players every week.",
};

const OPEN_SLOTS = 3;

export default function StaffPage() {
  return (
    <>
      <PageHero
        eyebrow="Coaches"
        title={
          <>
            Meet The <span className="text-green-400">Staff</span>
          </>
        }
        description="Carlos is locked in. The other cards stay blank until we add the rest of the room."
      />

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-3xl border border-ink/10 bg-ink shadow-[0_24px_50px_-28px_rgba(7,16,12,0.45)]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative flex min-h-[360px] items-center justify-center bg-green-800 p-10">
                <div className="bg-grid absolute inset-0 opacity-30" />
                <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-yellow-500/15 blur-3xl" />
                <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-ink text-bone ring-2 ring-yellow-500">
                  <span className="font-display text-6xl">{FEATURED.initials}</span>
                </div>
              </div>
              <div className="flex flex-col justify-center px-8 py-12 sm:px-12">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-green-300">
                  Owner & Head Coach
                </span>
                <h2 className="mt-3 font-display text-5xl uppercase tracking-wide text-bone sm:text-6xl">
                  {FEATURED.name}
                </h2>
                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-yellow-400">
                  {FEATURED.age} years old · {FEATURED.role}
                </p>
                <p className="mt-2 text-sm text-bone/55">{FEATURED.extra}</p>
                <p className="mt-6 max-w-md text-base leading-relaxed text-bone/70">
                  {FEATURED.bio}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <SectionHeading
              eyebrow="The Room"
              title="Coaches Beside Him"
              description="Open spots. Names, photos, and bios drop in when the staff is set."
            />
            <StaggerGroup className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {Array.from({ length: OPEN_SLOTS }, (_, i) => (
                <StaggerItem key={i}>
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white">
                    <div className="relative flex aspect-[5/4] items-center justify-center bg-green-800">
                      <div className="bg-grid absolute inset-0 opacity-30" />
                      <UserRound className="relative h-12 w-12 text-bone/25" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="h-5 w-2/3 rounded bg-ink/10" />
                      <div className="mt-3 h-2.5 w-1/3 rounded bg-ink/5" />
                      <div className="mt-5 h-2.5 w-full rounded bg-ink/5" />
                      <div className="mt-2 h-2.5 w-4/5 rounded bg-ink/5" />
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
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
