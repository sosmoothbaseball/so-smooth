"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, GraduationCap, Shield, Users2 } from "lucide-react";
import Button from "@/components/ui/Button";

const HEADLINE_LINES = [
  [{ text: "WHERE ", accent: false }, { text: "FUTURE STARS", accent: true }],
  [{ text: "LEARN TO ", accent: false }, { text: "COMPETE", accent: "yellow" as const }],
];

const STATS = [
  { icon: Users2, label: "Players Trained", value: "500+" },
  { icon: Shield, label: "Teams Ages", value: "11U-14U" },
  { icon: GraduationCap, label: "Training Levels", value: "Youth-Professional" },
];

export default function Hero() {
  return (
    <section className="relative isolate flex h-svh min-h-[36rem] flex-col overflow-hidden bg-ink pt-24 pb-6 sm:pt-28">
      <Image
        src="/brand/home-hero-lockers.jpg"
        alt="So Smooth jerseys in the locker room"
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover object-center"
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-ink/45 via-ink/25 to-ink/75" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-5xl uppercase leading-[0.95] tracking-wide text-bone drop-shadow-[0_2px_16px_rgba(0,0,0,0.65)] sm:text-7xl md:text-8xl">
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
          className="mt-7 max-w-2xl text-base leading-relaxed text-bone drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] sm:text-lg"
        >
          So Smooth is a year-round training academy and travel program for
          youth players, built on fundamentals, discipline, and a real love
          for the game.
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
          className="mt-10 grid w-full max-w-2xl grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:mt-14 sm:pt-8"
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
        className="relative z-10 mx-auto mb-1 flex w-fit shrink-0 items-center justify-center"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-6 w-6 text-bone/40" />
      </motion.div>
    </section>
  );
}
