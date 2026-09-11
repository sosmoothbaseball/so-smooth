import { requireParent } from "@/lib/portal/auth";
import PortalShell from "@/components/portal/PortalShell";
import PortalPanel from "@/components/portal/PortalPanel";
import ChangePasswordForm from "@/components/portal/ChangePasswordForm";

export default async function ParentPasswordPage() {
  const user = await requireParent();

  return (
    <PortalShell user={user} pathname="/portal/parent/profile">
      <div className="max-w-xl">
        <PortalPanel
          title="Change Password"
          description="Enter the password you use now, then the new one twice."
        >
          <ChangePasswordForm backHref="/portal/parent/profile" />
        </PortalPanel>
      </div>
    </PortalShell>
  );
}
