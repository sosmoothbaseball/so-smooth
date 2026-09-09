import CountUp from "@/components/ui/CountUp";
import AnimatedSection from "@/components/ui/AnimatedSection";

const STATS = [
  { value: 15, suffix: "+", label: "Years Running" },
  { value: 1200, suffix: "+", label: "Players Trained" },
  { value: 8, suffix: "", label: "Championships" },
  { value: 24, suffix: "", label: "Coaches & Staff" },
];

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 sm:py-24">
      <div className="bg-grid mask-fade-x absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 sm:grid-cols-4">
        {STATS.map((stat, i) => (
          <AnimatedSection
            key={stat.label}
            delay={i * 0.08}
            className="flex flex-col items-center gap-2 text-center"
          >
            <CountUp
              value={stat.value}
              suffix={stat.suffix}
              className="font-display text-4xl sm:text-5xl md:text-6xl text-bone"
            />
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
