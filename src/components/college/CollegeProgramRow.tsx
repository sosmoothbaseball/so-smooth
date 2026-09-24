import { Mail, X } from "lucide-react";
import { deleteCollegeProgramAction } from "@/lib/portal/actions";
import {
  collegeProgramMailto,
  collegeStatLabel,
  parseCollegeAccolades,
  parseCollegeStats,
} from "@/lib/portal/college-program";
import { formatWhen } from "@/lib/portal/dates";
import ActionForm from "@/components/portal/ActionForm";

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
  parent: { name: string; email: string; phone: string };
};

export default function CollegeProgramRow({ program }: { program: Program }) {
  const stats = parseCollegeStats(program.stats);
  const accolades = parseCollegeAccolades(program.accolades);
  const mailto = collegeProgramMailto({
    playerName: program.playerName,
    parentName: program.parent.name,
    parentEmail: program.parent.email,
    parentPhone: program.parent.phone,
    height: program.height,
    weight: program.weight,
    stats,
    accolades,
    bio: program.bio,
    link: program.link,
  });

  return (
    <li className="rounded-2xl border border-ink/10 px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700">
            {program.parent.name}
          </p>
          <p className="mt-1 font-display text-2xl uppercase tracking-wide text-ink">
            {program.playerName}
          </p>
          <p className="mt-1 text-sm text-ink/55">{formatWhen(program.createdAt)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={mailto}
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink transition-colors hover:border-green-600 hover:bg-green-500/5 hover:text-green-700"
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </a>
          <ActionForm
            action={deleteCollegeProgramAction}
            confirm={{
              title: "Remove this packet?",
              message: `Delete ${program.playerName}'s college packet? This cannot be undone.`,
              confirmLabel: "Remove",
            }}
          >
            <input type="hidden" name="programId" value={program.id} />
            <button
              type="submit"
              aria-label={`Remove ${program.playerName}`}
              className="rounded-full border border-ink/10 p-2 text-ink/40 transition-colors hover:border-red-300 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </ActionForm>
        </div>
      </div>

      <p className="mt-3 text-sm text-ink/70">
        {program.height} · {program.weight}
      </p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/70">
        <a href={`mailto:${program.parent.email}`} className="hover:text-green-700">
          {program.parent.email}
        </a>
        {program.parent.phone ? (
          <a href={`tel:${program.parent.phone}`} className="hover:text-green-700">
            {program.parent.phone}
          </a>
        ) : null}
      </div>

      {stats.length > 0 ? (
        <p className="mt-3 text-sm text-ink/70">
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
    </li>
  );
}
