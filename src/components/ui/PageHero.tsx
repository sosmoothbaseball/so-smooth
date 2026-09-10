import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-ink pt-36 pb-20 sm:pt-44 sm:pb-28",
        className,
      )}
    >
      <div className="bg-grid mask-fade-x absolute inset-0 opacity-60" />
      <div
        className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-green-500/25 blur-[110px]"
        aria-hidden
      />
      <div
        className="absolute top-32 right-0 h-72 w-72 rounded-full bg-yellow-500/15 blur-[110px]"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 text-center">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-bone/80">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-6 font-display text-5xl uppercase leading-[0.95] tracking-wide text-bone sm:text-7xl md:text-8xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-bone/65 sm:text-lg">
            {description}
          </p>
        )}
        {actions && (
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
            {actions}
          </div>
        )}
      </div>
    </section>
  );
}
