import { requireParent } from "@/lib/portal/auth";
import { addPlayerAction, updateProfileAction } from "@/lib/portal/actions";
import { AGE_GROUPS } from "@/lib/portal/age-groups";
import PortalShell from "@/components/portal/PortalShell";
import PortalPanel from "@/components/portal/PortalPanel";
import EditPlayerCard from "@/components/portal/EditPlayerCard";
import { SelectField, TextField } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import ActionForm from "@/components/portal/ActionForm";

export default async function ParentProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>;
}) {
  const user = await requireParent();
  const { password } = await searchParams;

  return (
    <PortalShell user={user} pathname="/portal/parent/profile">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PortalPanel title="Edit Profile" description="Email stays locked because you use it to sign in. You can update your phone anytime.">
          {password === "1" && (
            <p className="mb-4 text-sm text-green-800">Password updated.</p>
          )}
          <ActionForm action={updateProfileAction} className="flex flex-col gap-4">
            <TextField id="name" name="name" label="Name" defaultValue={user.name} required />
            <div>
              <TextField
                id="email"
                name="email"
                type="email"
                label="Email"
                defaultValue={user.email}
                readOnly
              />
              <p className="mt-2 text-xs text-ink/40">Locked. This is your login.</p>
            </div>
            <TextField
              id="phone"
              name="phone"
              type="tel"
              label="Phone"
              defaultValue={user.phone}
              autoComplete="tel"
              required
            />
            <Button type="submit">Save Profile</Button>
          </ActionForm>
          <div className="mt-4">
            <Button href="/portal/parent/password" variant="onLight">
              Change Password
            </Button>
          </div>
        </PortalPanel>

        <PortalPanel title="Players" description="Lessons and events book under a player on this account.">
          <ul className="flex flex-col gap-4">
            {user.players.map((player) => (
              <EditPlayerCard key={player.id} player={player} />
            ))}
          </ul>
          <ActionForm
            action={addPlayerAction}
            resetOnSuccess
            className="mt-6 flex flex-col gap-3 border-t border-ink/10 pt-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Add A Player</p>
            <TextField id="new-player" name="playerName" label="Player Name" required />
            <SelectField id="new-age" name="ageGroup" label="Age Group" defaultValue="12U">
              {AGE_GROUPS.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </SelectField>
            <Button type="submit" variant="onLight">
              Add Player
            </Button>
          </ActionForm>
        </PortalPanel>
      </div>
    </PortalShell>
  );
}
