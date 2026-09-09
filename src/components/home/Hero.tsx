"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Trophy, Users2, CalendarDays } from "lucide-react";
import Button from "@/components/ui/Button";

const HEADLINE_LINES = [
  [{ text: "WHERE ", accent: false }, { text: "FUTURE STARS", accent: true }],
  [{ text: "LEARN TO ", accent: false }, { text: "COMPETE", accent: "yellow" as const }],
];

const STATS = [
  { icon: CalendarDays, label: "Years Running", value: "15+" },
  { icon: Users2, label: "Players Trained", value: "1,200+" },
  { icon: Trophy, label: "Championships", value: "8" },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink pt-36 pb-28 sm:pt-44 sm:pb-36">
      {/* background texture */}
      <div className="bg-grid mask-fade-x absolute inset-0 opacity-60" />
      <motion.div
        className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-green-500/25 blur-[110px] animate-float"
        aria-hidden
      />
      <motion.div
        className="absolute top-40 right-0 h-72 w-72 rounded-full bg-yellow-500/15 blur-[110px] animate-pulse-slow"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 text-center">
        <h1 className="font-display text-5xl uppercase leading-[0.95] tracking-wide text-bone sm:text-7xl md:text-8xl">
          {HEADLINE_LINES.map((line, li) => (
            <span key={li} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 + li * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {line.map((chunk, ci) => (
                  <span
                    key={ci}
                    className={
                      chunk.accent === true
                        ? "text-green-400"
                        : chunk.accent === "yellow"
                          ? "text-yellow-400"
                          : undefined
                    }
                  >
                    {chunk.text}
                  </span>
                ))}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-7 max-w-2xl text-base leading-relaxed text-bone/65 sm:text-lg"
        >
          Carlitos&apos; Baseball is a year-round training academy and travel
          program for youth players, built on fundamentals, discipline, and a
          real love for the game.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-9 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Button href="/training" size="lg">
            Explore Training
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button href="/team" variant="outline" size="lg">
            Meet the Team
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-16 grid w-full max-w-2xl grid-cols-3 gap-4 border-t border-white/10 pt-8"
        >
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon className="h-5 w-5 text-green-400" />
              <span className="font-display text-2xl sm:text-3xl text-bone">
                {value}
              </span>
              <span className="text-[11px] sm:text-xs uppercase tracking-wide text-bone/50 text-center">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 mx-auto mt-14 flex w-fit items-center justify-center"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-6 w-6 text-bone/40" />
      </motion.div>
    </section>
  );
}
