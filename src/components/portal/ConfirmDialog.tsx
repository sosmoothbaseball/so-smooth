"use client";

import { useEffect, useId } from "react";
import Button from "@/components/ui/Button";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Yes",
  cancelLabel = "Go Back",
  pending = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/60 p-4 sm:items-center"
      onClick={() => {
        if (!pending) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_50px_-28px_rgba(7,16,12,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">
          Confirm
        </p>
        <h3
          id={titleId}
          className="mt-2 font-display text-3xl uppercase tracking-wide text-ink"
        >
          {title}
        </h3>
        {message ? <p className="mt-3 text-sm text-ink/60">{message}</p> : null}
        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" onClick={onConfirm} disabled={pending}>
            {pending ? "Working…" : confirmLabel}
          </Button>
          <Button type="button" variant="onLight" onClick={onCancel} disabled={pending}>
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
