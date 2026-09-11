"use client";

import { useRouter } from "next/navigation";
import ActionForm from "@/components/portal/ActionForm";
import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/FormField";
import { changePasswordAction } from "@/lib/portal/actions";

export default function ChangePasswordForm({ backHref }: { backHref: string }) {
  const router = useRouter();

  return (
    <ActionForm
      action={changePasswordAction}
      className="flex flex-col gap-4"
      onSuccess={() => router.push(`${backHref}?password=1`)}
    >
      <TextField
        id="currentPassword"
        name="currentPassword"
        type="password"
        label="Current Password"
        autoComplete="current-password"
        required
      />
      <TextField
        id="newPassword"
        name="newPassword"
        type="password"
        label="New Password"
        autoComplete="new-password"
        required
      />
      <TextField
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm New Password"
        autoComplete="new-password"
        required
      />
      <div className="flex flex-wrap gap-2">
        <Button type="submit">Save Password</Button>
        <Button href={backHref} variant="onLight">
          Cancel
        </Button>
      </div>
    </ActionForm>
  );
}
