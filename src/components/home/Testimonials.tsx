import { Quote, Star } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";

const TESTIMONIALS = [
  {
    quote:
      "My son's confidence and fundamentals have improved so much since joining. The coaches balance fun with serious skill-building.",
    name: "Jessica R.",
    role: "Parent, 10U Player",
  },
  {
    quote:
      "You can tell the staff really cares about what they're teaching. Real coaches, real attention, real development.",
    name: "Marcus T.",
    role: "Parent, 9U Player",
  },
  {
    quote:
      "The team-first culture is what sold us. It's competitive, but it never loses sight of teaching kids to love the game.",
    name: "Jason & Mia L.",
    role: "Parents, 12U Player",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-bone py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="What Families Say"
          title="Trusted by Players & Parents"
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.name}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg">
                <div>
                  <Quote className="h-8 w-8 text-green-500/70" />
                  <p className="mt-5 text-sm leading-relaxed text-ink/75">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6">
                  <div className="flex gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-ink/50">{t.role}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
