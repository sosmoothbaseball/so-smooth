"use client";

import { useState } from "react";
import { UserRound } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import { cn } from "@/lib/utils";

const TEAMS: Record<string, { focus: string; note: string; slots: number }> = {
  "11U": {
    focus: "Fundamentals + game IQ",
    note: "First travel year for a lot of our players.",
    slots: 8,
  },
  "12U": {
    focus: "Reps that stick",
    note: "More innings, more positions, more accountability.",
    slots: 8,
  },
  "13U": {
    focus: "Compete with purpose",
    note: "Tournament pace with a still-teaching staff.",
    slots: 8,
  },
  "14U": {
    focus: "High school ready",
    note: "Sharper roles, higher standards, same culture.",
    slots: 8,
  },
};

const AGES = Object.keys(TEAMS);

export default function TeamBoards() {
  const [age, setAge] = useState("12U");
  const team = TEAMS[age];
  const slots = Array.from({ length: team.slots }, (_, i) => i + 1);

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

      <div className="mt-10 overflow-hidden rounded-3xl border border-ink/10 bg-ink">
        <div className="grid grid-cols-1 md:grid-cols-[0.7fr_1.3fr]">
          <div className="relative flex min-h-[200px] flex-col justify-center bg-green-800 px-8 py-10">
            <div className="bg-grid absolute inset-0 opacity-25" />
            <p className="relative text-[11px] font-semibold uppercase tracking-[0.22em] text-yellow-400">
              So Smooth · Travel
            </p>
            <p className="relative mt-3 font-display text-7xl leading-none text-bone">{age}</p>
          </div>
          <div className="flex flex-col justify-center px-8 py-10">
            <h3 className="font-display text-3xl uppercase tracking-wide text-bone sm:text-4xl">
              {team.focus}
            </h3>
            <span className="mt-4 h-1 w-8 rounded-full bg-yellow-500" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-bone/65">{team.note}</p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-bone/40">
              Roster spots · Names drop in later
            </p>
          </div>
        </div>
      </div>

      <StaggerGroup className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {slots.map((slot) => (
          <StaggerItem key={`${age}-${slot}`}>
            <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
              <div className="relative flex aspect-[4/5] items-center justify-center bg-green-800">
                <div className="bg-grid absolute inset-0 opacity-25" />
                <UserRound className="relative h-12 w-12 text-bone/25" />
              </div>
              <div className="px-4 py-4">
                <div className="h-4 w-3/4 rounded bg-ink/10" />
                <div className="mt-2 h-2.5 w-1/2 rounded bg-ink/5" />
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
