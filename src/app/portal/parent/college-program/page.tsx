import { requireParent } from "@/lib/portal/auth";
import { getParentCollegePrograms } from "@/lib/portal/queries";
import PortalShell from "@/components/portal/PortalShell";
import PortalPanel from "@/components/portal/PortalPanel";
import Button from "@/components/ui/Button";
import CollegeProgramCard from "@/components/college/CollegeProgramCard";

export default async function ParentCollegeProgramPage() {
  const user = await requireParent();
  const programs = await getParentCollegePrograms(user.id);

  return (
    <PortalShell user={user} pathname="/portal/parent/college-program">
      <PortalPanel
        title="College Program"
        description="Player profiles you sent from the College Program page. Edit one anytime, or start another."
      >
        <div className="mb-5">
          <Button href="/college-program?packet=1" variant="onLight" size="sm">
            New Profile
          </Button>
        </div>
        <ul className="flex flex-col gap-3">
          {programs.length === 0 ? (
            <li className="text-sm text-ink/50">No player profiles yet.</li>
          ) : (
            programs.map((program) => (
              <CollegeProgramCard key={program.id} program={program} />
            ))
          )}
        </ul>
      </PortalPanel>
    </PortalShell>
  );
}
