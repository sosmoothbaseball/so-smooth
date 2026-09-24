"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  COLLEGE_ACCOLADES_MAX,
  COLLEGE_POSITION_OPTIONS,
  COLLEGE_POSITIONS_MAX,
  COLLEGE_STAT_OPTIONS,
  collegePositionLabel,
  splitCollegeHeight,
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
  positions?: string[];
};

export default function CollegeProgramFields({
  idPrefix,
  defaults,
}: {
  idPrefix: string;
  defaults?: CollegeProgramDefaults;
}) {
  const [stats, setStats] = useState<CollegeStat[]>(defaults?.stats?.length ? defaults.stats : []);
  const [accolades, setAccolades] = useState<string[]>(
    defaults?.accolades?.length ? defaults.accolades : [],
  );
  const [accoladeDraft, setAccoladeDraft] = useState("");
  const [positions, setPositions] = useState<string[]>(
    defaults?.positions?.length ? defaults.positions : [],
  );
  const [positionDraft, setPositionDraft] = useState("");
  const height = splitCollegeHeight(defaults?.height);

  function addAccolade() {
    const next = accoladeDraft.trim();
    if (!next || accolades.length >= COLLEGE_ACCOLADES_MAX) return;
    setAccolades([...accolades, next]);
    setAccoladeDraft("");
  }

  function addPosition() {
    if (
      !positionDraft ||
      positions.includes(positionDraft) ||
      positions.length >= COLLEGE_POSITIONS_MAX
    ) {
      return;
    }
    setPositions([...positions, positionDraft]);
    setPositionDraft("");
  }

  return (
    <div className="flex flex-col gap-5">
      <TextField
        id={`${idPrefix}-player`}
        name="playerName"
        label="Player Name"
        defaultValue={defaults?.playerName}
        required
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
            Height
          </p>
          <div className="grid grid-cols-2 gap-3">
            <TextField
              id={`${idPrefix}-height-feet`}
              name="heightFeet"
              label="Feet"
              inputMode="numeric"
              placeholder="5"
              defaultValue={height.feet}
              required
            />
            <TextField
              id={`${idPrefix}-height-inches`}
              name="heightInches"
              label="Inches"
              inputMode="numeric"
              placeholder="10"
              defaultValue={height.inches}
              required
            />
          </div>
        </div>
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
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">Positions</p>
        <div className="mt-3 flex items-center gap-2">
          <SelectField
            id={`${idPrefix}-position-draft`}
            label=""
            value={positionDraft}
            onChange={(event) => setPositionDraft(event.target.value)}
          >
            <option value="">Select a position</option>
            {COLLEGE_POSITION_OPTIONS.filter((option) => !positions.includes(option.key)).map(
              (option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ),
            )}
          </SelectField>
          <button
            type="button"
            aria-label="Add position"
            onClick={addPosition}
            className="rounded-full border border-ink/10 p-2 text-ink/40 transition-colors hover:border-green-600 hover:text-green-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {positions.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2">
            {positions.map((item, index) => (
              <li
                key={`${idPrefix}-pos-${index}`}
                className="flex overflow-hidden rounded-xl border border-ink/10 bg-bone/60"
              >
                <input type="hidden" name="position" value={item} />
                <span className="flex flex-1 items-center px-4 py-2.5 text-sm text-ink/80">
                  {collegePositionLabel(item)}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${collegePositionLabel(item)}`}
                  onClick={() => setPositions(positions.filter((_, i) => i !== index))}
                  className="flex w-11 shrink-0 items-center justify-center border-l border-ink/10 text-ink/35 transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
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
        <div className="mt-3 flex items-center gap-2">
          <TextField
            id={`${idPrefix}-accolade-draft`}
            label=""
            value={accoladeDraft}
            onChange={(event) => setAccoladeDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              addAccolade();
            }}
            placeholder="First Team All-Conference"
          />
          <button
            type="button"
            aria-label="Add accolade"
            onClick={addAccolade}
            className="rounded-full border border-ink/10 p-2 text-ink/40 transition-colors hover:border-green-600 hover:text-green-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {accolades.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2">
            {accolades.map((item, index) => (
              <li
                key={`${idPrefix}-acc-${index}`}
                className="flex overflow-hidden rounded-xl border border-ink/10 bg-bone/60"
              >
                <input type="hidden" name="accolade" value={item} />
                <span className="flex flex-1 items-center px-4 py-2.5 text-sm text-ink/80">
                  {item}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${item}`}
                  onClick={() => setAccolades(accolades.filter((_, i) => i !== index))}
                  className="flex w-11 shrink-0 items-center justify-center border-l border-ink/10 text-ink/35 transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
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
