import CountUp from "@/components/ui/CountUp";
import AnimatedSection from "@/components/ui/AnimatedSection";

const STATS = [
  { value: 500, suffix: "+", label: "Players Trained" },
  { display: "11U-14U", label: "Teams Ages" },
  { display: "Youth-Professional", label: "Training Levels" },
];

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 sm:py-24">
      <div className="bg-grid mask-fade-x absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 sm:grid-cols-3">
        {STATS.map((stat, i) => (
          <AnimatedSection
            key={stat.label}
            delay={i * 0.08}
            className="flex flex-col items-center gap-2 text-center"
          >
            {stat.display ? (
              <span className="font-display text-4xl sm:text-5xl md:text-6xl text-bone">
                {stat.display}
              </span>
            ) : (
              <CountUp
                value={stat.value ?? 0}
                suffix={stat.suffix}
                className="font-display text-4xl sm:text-5xl md:text-6xl text-bone"
              />
            )}
            <span className="h-1 w-8 rounded-full bg-yellow-500" />
            <span className="text-xs sm:text-sm uppercase tracking-[0.15em] text-bone/55">
              {stat.label}
            </span>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
