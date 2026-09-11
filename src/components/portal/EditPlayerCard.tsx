"use client";

import { useState } from "react";
import ActionForm from "@/components/portal/ActionForm";
import Button from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/FormField";
import { updatePlayerAction } from "@/lib/portal/actions";
import { ageGroupOptions } from "@/lib/portal/age-groups";

export default function EditPlayerCard({
  player,
}: {
  player: { id: string; name: string; ageGroup: string };
}) {
  const [editing, setEditing] = useState(false);
  const ages = ageGroupOptions(player.ageGroup);

  if (!editing) {
    return (
      <li className="rounded-2xl border border-ink/10 p-4">
        <p className="font-display text-2xl uppercase tracking-wide text-ink">{player.name}</p>
        <p className="mt-1 text-sm text-ink/60">{player.ageGroup}</p>
        <Button
          type="button"
          variant="onLight"
          size="sm"
          className="mt-4"
          onClick={() => setEditing(true)}
        >
          Edit Player
        </Button>
      </li>
    );
  }

  return (
    <li className="rounded-2xl border border-green-600/25 bg-green-500/5 p-4">
      <ActionForm
        action={updatePlayerAction}
        className="flex flex-col gap-3"
        onSuccess={() => setEditing(false)}
      >
        <input type="hidden" name="playerId" value={player.id} />
        <TextField
          id={`player-name-${player.id}`}
          name="playerName"
          label="Player"
          defaultValue={player.name}
          required
        />
        <SelectField
          id={`player-age-${player.id}`}
          name="ageGroup"
          label="Age Group"
          defaultValue={player.ageGroup}
        >
          {ages.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </SelectField>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="sm">
            Save Player
          </Button>
          <Button type="button" variant="onLight" size="sm" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
      </ActionForm>
    </li>
  );
}
