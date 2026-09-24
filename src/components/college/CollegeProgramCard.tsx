"use client";

import { useState } from "react";
import {
  deleteCollegeProgramAction,
  updateCollegeProgramAction,
} from "@/lib/portal/actions";
import {
  collegeStatLabel,
  parseCollegeAccolades,
  parseCollegeStats,
} from "@/lib/portal/college-program";
import { formatWhen } from "@/lib/portal/dates";
import ActionForm from "@/components/portal/ActionForm";
import Button from "@/components/ui/Button";
import CollegeProgramFields from "@/components/college/CollegeProgramFields";

type Program = {
  id: string;
  playerName: string;
  height: string;
  weight: string;
  bio: string;
  link: string;
  stats: unknown;
  accolades: unknown;
  createdAt: Date;
};

export default function CollegeProgramCard({
  program,
  players,
}: {
  program: Program;
  players: { id: string; name: string }[];
}) {
  const [editing, setEditing] = useState(false);
  const stats = parseCollegeStats(program.stats);
  const accolades = parseCollegeAccolades(program.accolades);

  if (editing) {
    return (
      <li className="rounded-2xl border border-ink/10 px-4 py-4">
        <ActionForm
          action={updateCollegeProgramAction}
          className="flex flex-col gap-5"
          onSuccess={() => setEditing(false)}
        >
          <input type="hidden" name="programId" value={program.id} />
          <CollegeProgramFields
            idPrefix={`edit-${program.id}`}
            players={players}
            defaults={{
              playerName: program.playerName,
              height: program.height,
              weight: program.weight,
              bio: program.bio,
              link: program.link,
              stats,
              accolades,
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm">
              Save Packet
            </Button>
            <Button type="button" variant="onLight" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </ActionForm>
      </li>
    );
  }

  return (
    <li className="rounded-2xl border border-ink/10 px-4 py-4">
      <p className="font-display text-2xl uppercase tracking-wide text-ink">{program.playerName}</p>
      <p className="mt-1 text-sm text-ink/55">{formatWhen(program.createdAt)}</p>
      <p className="mt-3 text-sm text-ink/70">
        {program.height} · {program.weight}
      </p>
      {stats.length > 0 ? (
        <p className="mt-2 text-sm text-ink/70">
          {stats.map((stat) => `${collegeStatLabel(stat.key)} ${stat.value}`).join(" · ")}
        </p>
      ) : null}
      {accolades.length > 0 ? (
        <ul className="mt-2 list-disc pl-5 text-sm text-ink/70">
          {accolades.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {program.bio ? <p className="mt-3 text-sm leading-relaxed text-ink/70">{program.bio}</p> : null}
      {program.link ? (
        <a
          href={program.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-green-700 hover:text-green-800"
        >
          Highlight Link
        </a>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="onLight" size="sm" onClick={() => setEditing(true)}>
          Edit
        </Button>
        <ActionForm
          action={deleteCollegeProgramAction}
          confirm={{
            title: "Delete this packet?",
            message: `Remove ${program.playerName}'s college packet? Coaches will not see it anymore.`,
            confirmLabel: "Delete",
          }}
        >
          <input type="hidden" name="programId" value={program.id} />
          <Button type="submit" variant="onLight" size="sm">
            Delete
          </Button>
        </ActionForm>
      </div>
    </li>
  );
}
