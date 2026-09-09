import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-green-800 py-20 sm:py-28">
      <div className="bg-grid absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-yellow-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-green-400/25 blur-[100px]" />

      <AnimatedSection className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-bone/90">
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
          Roster Spots Filling Fast
        </span>
        <h2 className="mt-6 font-display text-4xl uppercase leading-[0.95] tracking-wide text-bone sm:text-6xl">
          Ready to Join the <span className="text-yellow-400">Team?</span>
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-bone/75 sm:text-lg">
          Book a tryout, sign up for a camp, or reach out to our staff. Your
          player&apos;s next step starts here.
        </p>
        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
          <Button href="/careers" variant="secondary" size="lg">
            Get In Touch
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/training" variant="outline" size="lg">
            View Programs
          </Button>
        </div>
      </AnimatedSection>
    </section>
  );
}
