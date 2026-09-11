import { requireCoach } from "@/lib/portal/auth";
import { updateLessonSpecAction, updateProfileAction } from "@/lib/portal/actions";
import { slugFromName, initialsFromName } from "@/lib/lessons";
import PortalShell from "@/components/portal/PortalShell";
import PortalPanel from "@/components/portal/PortalPanel";
import { SelectField, TextField } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import ActionForm from "@/components/portal/ActionForm";
import { STAFF_COACHES, staffSlugForName } from "@/lib/staff";

export default async function CoachProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>;
}) {
  const user = await requireCoach();
  const spec = user.lessonSpec;
  const { password } = await searchParams;
  const linkedSlug =
    (spec?.slug && STAFF_COACHES.some((coach) => coach.slug === spec.slug)
      ? spec.slug
      : null) ||
    staffSlugForName(user.name) ||
    STAFF_COACHES[0]?.slug ||
    slugFromName(user.name);

  return (
    <PortalShell user={user} pathname="/portal/coach/profile">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PortalPanel title="Edit Profile" description="This name is what families see on lesson cards and bookings.">
          {password === "1" && (
            <p className="mb-4 text-sm text-green-800">Password updated.</p>
          )}
          <ActionForm action={updateProfileAction} className="grid max-w-xl grid-cols-1 gap-4">
            <TextField id="name" name="name" label="Name" defaultValue={user.name} required />
            <TextField id="email" name="email" type="email" label="Email" defaultValue={user.email} required />
            <Button type="submit">Save Profile</Button>
          </ActionForm>
          <div className="mt-4">
            <Button href="/portal/coach/password" variant="onLight">
              Change Password
            </Button>
          </div>
        </PortalPanel>

        <PortalPanel
          title="Lesson Specs"
          description="These fields drive the Private Lessons tab. Staff Bio is the Staff card View Full Bio jumps to."
        >
          <ActionForm action={updateLessonSpecAction} className="grid max-w-xl grid-cols-1 gap-4">
            <TextField
              id="title"
              name="title"
              label="Role / Title"
              defaultValue={spec?.title || "Coach"}
              required
            />
            <TextField
              id="price"
              name="price"
              label="Price"
              defaultValue={spec?.price || "$75"}
              required
            />
            <TextField
              id="location"
              name="location"
              label="Location"
              defaultValue={spec?.location || "Laguna Beach"}
              required
            />
            <TextField
              id="initials"
              name="initials"
              label="Initials"
              defaultValue={spec?.initials || initialsFromName(user.name)}
              required
            />
            <SelectField
              id="slug"
              name="slug"
              label="Staff Bio"
              defaultValue={linkedSlug}
              required
            >
              {STAFF_COACHES.map((coach) => (
                <option key={coach.slug} value={coach.slug}>
                  {coach.name}
                </option>
              ))}
            </SelectField>
            <Button type="submit">Save Lesson Specs</Button>
          </ActionForm>
        </PortalPanel>
      </div>
    </PortalShell>
  );
}
