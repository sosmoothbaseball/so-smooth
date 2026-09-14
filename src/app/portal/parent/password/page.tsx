import { requireParent } from "@/lib/portal/auth";
import PortalShell from "@/components/portal/PortalShell";
import PortalPanel from "@/components/portal/PortalPanel";
import ForgotPasswordForm from "@/components/portal/ForgotPasswordForm";

export default async function ParentPasswordPage() {
  const user = await requireParent();

  return (
    <PortalShell user={user} pathname="/portal/parent/profile">
      <div className="max-w-xl">
        <PortalPanel
          title="Reset Password"
          description="We will email you a reset link. Use that link to choose a new password."
        >
          <ForgotPasswordForm email={user.email} />
        </PortalPanel>
      </div>
    </PortalShell>
  );
}
