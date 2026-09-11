import { requireCoach } from "@/lib/portal/auth";
import PortalShell from "@/components/portal/PortalShell";
import PortalPanel from "@/components/portal/PortalPanel";
import ChangePasswordForm from "@/components/portal/ChangePasswordForm";

export default async function CoachPasswordPage() {
  const user = await requireCoach();

  return (
    <PortalShell user={user} pathname="/portal/coach/profile">
      <div className="max-w-xl">
        <PortalPanel
          title="Change Password"
          description="Enter the password you use now, then the new one twice."
        >
          <ChangePasswordForm backHref="/portal/coach/profile" />
        </PortalPanel>
      </div>
    </PortalShell>
  );
}
