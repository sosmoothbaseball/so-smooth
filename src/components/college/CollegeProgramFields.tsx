"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  COLLEGE_STAT_OPTIONS,
  type CollegeStat,
} from "@/lib/portal/college-program";
import { SelectField, TextAreaField, TextField } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";

export type CollegeProgramDefaults = {
  playerName?: string;
  height?: string;
  weight?: string;
  bio?: string;
  link?: string;
  stats?: CollegeStat[];
  accolades?: string[];
};

export default function CollegeProgramFields({
  idPrefix,
  players = [],
  defaults,
}: {
  idPrefix: string;
  players?: { id: string; name: string }[];
  defaults?: CollegeProgramDefaults;
}) {
  const [playerName, setPlayerName] = useState(defaults?.playerName || "");
  const [stats, setStats] = useState<CollegeStat[]>(defaults?.stats?.length ? defaults.stats : []);
  const [accolades, setAccolades] = useState<string[]>(
    defaults?.accolades?.length ? defaults.accolades : [],
  );

  return (
    <div className="flex flex-col gap-5">
      {players.length > 0 ? (
        <SelectField
          id={`${idPrefix}-player-pick`}
          name="playerPick"
          label="Player On This Account"
          value={players.some((player) => player.name === playerName) ? playerName : ""}
          onChange={(event) => {
            if (event.target.value) setPlayerName(event.target.value);
          }}
        >
          <option value="">Type a name or pick a player</option>
          {players.map((player) => (
            <option key={player.id} value={player.name}>
              {player.name}
            </option>
          ))}
        </SelectField>
      ) : null}

      <TextField
        id={`${idPrefix}-player`}
        name="playerName"
        label="Player Name"
        value={playerName}
        onChange={(event) => setPlayerName(event.target.value)}
        required
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField
          id={`${idPrefix}-height`}
          name="height"
          label="Height"
          placeholder={`5'10"`}
          defaultValue={defaults?.height}
          required
        />
        <TextField
          id={`${idPrefix}-weight`}
          name="weight"
          label="Weight"
          placeholder="165 lbs"
          defaultValue={defaults?.weight}
          required
        />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">Stats</p>
        <p className="mt-1 text-sm text-ink/50">Add only the numbers you want coaches to send.</p>
        <ul className="mt-3 flex flex-col gap-3">
          {stats.map((row, index) => (
            <li key={`${idPrefix}-stat-${index}`} className="flex items-end gap-2">
              <SelectField
                id={`${idPrefix}-stat-key-${index}`}
                name="statKey"
                label={index === 0 ? "Stat" : ""}
                value={row.key}
                onChange={(event) => {
                  const next = [...stats];
                  next[index] = { ...next[index], key: event.target.value };
                  setStats(next);
                }}
              >
                <option value="">Select a stat</option>
                {COLLEGE_STAT_OPTIONS.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </SelectField>
              <TextField
                id={`${idPrefix}-stat-value-${index}`}
                name="statValue"
                label={index === 0 ? "Value" : ""}
                value={row.value}
                onChange={(event) => {
                  const next = [...stats];
                  next[index] = { ...next[index], value: event.target.value };
                  setStats(next);
                }}
                placeholder=".347"
              />
              <button
                type="button"
                aria-label="Remove stat"
                onClick={() => setStats(stats.filter((_, i) => i !== index))}
                className="mb-1 rounded-full border border-ink/10 p-2 text-ink/40 transition-colors hover:border-red-300 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="onLight"
          size="sm"
          className="mt-3"
          onClick={() => setStats([...stats, { key: "", value: "" }])}
        >
          <Plus className="h-3.5 w-3.5" />
          Add A Stat
        </Button>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">Accolades</p>
        <ul className="mt-3 flex flex-col gap-3">
          {accolades.map((item, index) => (
            <li key={`${idPrefix}-acc-${index}`} className="flex items-end gap-2">
              <TextField
                id={`${idPrefix}-accolade-${index}`}
                name="accolade"
                label={index === 0 ? "Accolade" : ""}
                value={item}
                onChange={(event) => {
                  const next = [...accolades];
                  next[index] = event.target.value;
                  setAccolades(next);
                }}
                placeholder="First Team All-Conference"
              />
              <button
                type="button"
                aria-label="Remove accolade"
                onClick={() => setAccolades(accolades.filter((_, i) => i !== index))}
                className="mb-1 rounded-full border border-ink/10 p-2 text-ink/40 transition-colors hover:border-red-300 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="onLight"
          size="sm"
          className="mt-3"
          onClick={() => setAccolades([...accolades, ""])}
        >
          <Plus className="h-3.5 w-3.5" />
          Add An Accolade
        </Button>
      </div>

      <TextField
        id={`${idPrefix}-link`}
        name="link"
        type="url"
        label="Highlight Link"
        placeholder="https://"
        defaultValue={defaults?.link}
      />
      <TextAreaField
        id={`${idPrefix}-bio`}
        name="bio"
        label="Player Bio"
        placeholder="Position, what they do well, and what they want next."
        defaultValue={defaults?.bio}
      />
    </div>
  );
}
