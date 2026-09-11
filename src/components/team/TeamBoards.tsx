"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Team = {
  focus: string;
  note: string;
  photo?: string;
};

const TEAMS: Record<string, Team> = {
  "11U": {
    focus: "Fundamentals + game IQ",
    note: "First travel year for a lot of our players.",
  },
  "12U": {
    focus: "Reps that stick",
    note: "More innings, more positions, more accountability.",
  },
  "13U": {
    focus: "Compete with purpose",
    note: "Tournament pace with a still-teaching staff.",
  },
  "14U": {
    focus: "High school ready",
    note: "Sharper roles, higher standards, same culture.",
  },
};

const AGES = Object.keys(TEAMS);

export default function TeamBoards() {
  const [age, setAge] = useState("12U");
  const team = TEAMS[age];

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {AGES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setAge(item)}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors",
              age === item
                ? "bg-green-600 text-bone"
                : "border border-ink/15 bg-white text-ink/70 hover:border-green-600 hover:text-green-700",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={age}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-10 overflow-hidden rounded-3xl border border-ink/10 bg-ink shadow-[0_24px_50px_-28px_rgba(7,16,12,0.45)]"
        >
          <div className="relative aspect-[16/10] w-full sm:aspect-[2/1]">
            {team.photo ? (
              <Image
                src={team.photo}
                alt={`${age} So Smooth travel team`}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-green-800">
                <div className="bg-grid absolute inset-0 opacity-25" />
                <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-yellow-500/15 blur-3xl" />
                <div className="absolute -bottom-10 right-10 h-48 w-48 rounded-full bg-green-400/20 blur-3xl" />
                <Users className="relative mb-16 h-16 w-16 text-bone/30 sm:mb-12 sm:h-20 sm:w-20" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent px-6 py-6 sm:px-8 sm:py-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-yellow-400">
                So Smooth · {age}
              </p>
              <h3 className="mt-2 font-display text-3xl uppercase tracking-wide text-bone sm:text-4xl">
                {team.focus}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-bone/70">
                {team.note}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
