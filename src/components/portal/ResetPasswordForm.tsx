"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ActionForm from "@/components/portal/ActionForm";
import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/FormField";
import PasswordRules from "@/components/portal/PasswordRules";
import { updatePasswordAfterResetAction } from "@/lib/portal/actions";

export default function ResetPasswordForm({ nextHref }: { nextHref: string }) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");

  return (
    <ActionForm
      action={updatePasswordAfterResetAction}
      className="flex flex-col gap-4"
      onSuccess={() => router.push(`${nextHref}?password=1`)}
    >
      <div>
        <TextField
          id="newPassword"
          name="newPassword"
          type="password"
          label="New Password"
          autoComplete="new-password"
          required
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <div className="mt-3">
          <PasswordRules value={newPassword} />
        </div>
      </div>
      <TextField
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm New Password"
        autoComplete="new-password"
        required
      />
      <Button type="submit">Save New Password</Button>
    </ActionForm>
  );
}