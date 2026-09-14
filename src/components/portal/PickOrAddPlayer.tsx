"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { addPlayerAction } from "@/lib/portal/actions";
import { AGE_GROUPS } from "@/lib/portal/age-groups";
import Button from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/FormField";
import { cn } from "@/lib/utils";

export type BookingPlayer = { id: string; name: string; ageGroup: string };

export default function PickOrAddPlayer({
  idPrefix,
  players,
  selected,
  onSelect,
  onPlayersChange,
  onCreated,
}: {
  idPrefix: string;
  players: BookingPlayer[];
  selected: BookingPlayer | null;
  onSelect: (player: BookingPlayer) => void;
  onPlayersChange: (players: BookingPlayer[]) => void;
  onCreated?: (player: BookingPlayer) => void;
}) {
  const [adding, setAdding] = useState(players.length === 0);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function savePlayer(formData: FormData) {
    setPending(true);
    setError("");
    const result = await addPlayerAction(formData);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onPlayersChange([...players, result.player]);
    onSelect(result.player);
    setAdding(false);
    onCreated?.(result.player);
  }

  return (
    <div className="flex flex-col gap-4">
      {players.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
            Select a player
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {players.map((player) => {
              const active = selected?.id === player.id;
              return (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => {
                    onSelect(player);
                    setAdding(false);
                    setError("");
                  }}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors",
                    active
                      ? "border-green-700 bg-green-700 text-bone"
                      : "border-ink/10 bg-bone text-ink hover:border-green-600",
                  )}
                >
                  <span>
                    <span className="block font-display text-2xl uppercase tracking-wide">
                      {player.name}
                    </span>
                    <span className={cn("text-xs uppercase tracking-wide", active ? "text-bone/70" : "text-ink/50")}>
                      {player.ageGroup}
                    </span>
                  </span>
                  {active ? <Check className="h-5 w-5 shrink-0 text-yellow-400" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-ink/60">Add a player to book this lesson.</p>
      )}

      {adding ? (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await savePlayer(new FormData(event.currentTarget));
          }}
          className="rounded-2xl border border-green-700/20 bg-green-500/5 p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
            {players.length === 0 ? "Add a player" : "Add another player"}
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <TextField
              id={`${idPrefix}-player-name`}
              name="playerName"
              label="Player Name"
              required
              autoComplete="off"
            />
            <SelectField
              id={`${idPrefix}-player-age`}
              name="ageGroup"
              label="Age Group"
              defaultValue="12U"
            >
              {AGE_GROUPS.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </SelectField>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Save Player"}
              </Button>
              {players.length > 0 ? (
                <Button
                  type="button"
                  variant="onLight"
                  onClick={() => {
                    setAdding(false);
                    setError("");
                  }}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-ink/20 px-4 py-3 text-sm font-semibold text-green-700 transition-colors hover:border-green-600 hover:bg-green-500/5"
        >
          <Plus className="h-4 w-4" />
          Add a player
        </button>
      )}
    </div>
  );
}
