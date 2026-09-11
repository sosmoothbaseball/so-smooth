"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/portal/actions";
import ConfirmDialog from "@/components/portal/ConfirmDialog";

export type ConfirmCopy = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export default function ActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
  onSuccess,
  confirm,
}: {
  action: (formData: FormData) => Promise<ActionResult | void>;
  children: React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
  onSuccess?: () => void;
  confirm?: ConfirmCopy;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [queuedForm, setQueuedForm] = useState<HTMLFormElement | null>(null);

  async function submit(form: HTMLFormElement) {
    setPending(true);
    setError("");
    const result = await action(new FormData(form));
    setPending(false);
    setConfirmOpen(false);
    setQueuedForm(null);
    if (result && result.ok === false) {
      setError(result.error);
      return;
    }
    if (resetOnSuccess) form.reset();
    onSuccess?.();
    router.refresh();
  }

  return (
    <>
      <form
        className={className}
        onSubmit={async (event) => {
          event.preventDefault();
          const form = event.currentTarget;
          if (confirm) {
            setQueuedForm(form);
            setConfirmOpen(true);
            return;
          }
          await submit(form);
        }}
      >
        <fieldset disabled={pending} className="contents">
          {children}
        </fieldset>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </form>
      {confirm ? (
        <ConfirmDialog
          open={confirmOpen}
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          cancelLabel={confirm.cancelLabel}
          pending={pending}
          onCancel={() => {
            if (pending) return;
            setConfirmOpen(false);
            setQueuedForm(null);
          }}
          onConfirm={() => {
            if (queuedForm) void submit(queuedForm);
          }}
        />
      ) : null}
    </>
  );
}
