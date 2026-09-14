import { GraduationCap, Heart, Shield, Target, Users, Zap } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";

const FEATURES = [
  {
    icon: Target,
    title: "Elite Coaching",
    description:
      "Experienced instructors focused on fundamentals, confidence, and character, not just drills.",
  },
  {
    icon: Users,
    title: "Player Development",
    description:
      "Programs for every age and skill level, built around steady, long-term improvement.",
  },
  {
    icon: Shield,
    title: "Teams Ages 10U-14U",
    description:
      "Select travel teams for 10U, 11U, 12U, and 14U, with real tournament play and a team-first culture.",
  },
  {
    icon: GraduationCap,
    title: "Youth to Professional",
    description:
      "Training levels from youth fundamentals through professional development, matched to each player.",
  },
  {
    icon: Zap,
    title: "Speed, Agility & Strength",
    description:
      "Athletic work that builds a faster first step, cleaner movement, and stronger players on the field.",
  },
  {
    icon: Heart,
    title: "Community Rooted",
    description:
      "Scholarships, partnerships, and a culture built on loyalty and giving back.",
  },
];

export default function Features() {
  return (
    <section className="relative bg-bone py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrowImage={{
            src: "/brand/wordmark.jpg",
            alt: "So Smooth",
            width: 1024,
            height: 622,
          }}
          title="Built for Real Player Growth"
          description="Every part of our program is designed around one goal: developing better players and better people."
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <StaggerItem key={title}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-ink/10 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-green-500/40 hover:shadow-[0_18px_40px_-15px_rgba(18,92,59,0.35)]">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-500/0 transition-colors duration-300 group-hover:bg-green-500/10" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-green-700 text-bone transition-transform duration-300 group-hover:scale-110 group-hover:bg-green-600">
                  <Icon className="h-6 w-6" />
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-yellow-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <h3 className="relative mt-6 font-display text-2xl uppercase tracking-wide text-ink">
                  {title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-ink/65">
                  {description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
