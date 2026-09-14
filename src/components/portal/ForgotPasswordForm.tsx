"use client";

import { useState } from "react";
import ActionForm from "@/components/portal/ActionForm";
import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/FormField";
import { requestPasswordResetAction } from "@/lib/portal/actions";

export default function ForgotPasswordForm({ email }: { email?: string }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="text-sm leading-relaxed text-ink/70">
        If that email has an account, we sent a reset link. Check your inbox
        and spam folder.
      </p>
    );
  }

  return (
    <ActionForm
      action={requestPasswordResetAction}
      className="flex flex-col gap-4"
      onSuccess={() => setSent(true)}
    >
      <TextField
        id="reset-email"
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        required
        defaultValue={email}
        readOnly={Boolean(email)}
      />
      <Button type="submit">Send Reset Link</Button>
    </ActionForm>
  );
}