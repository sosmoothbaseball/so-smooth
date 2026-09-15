"use client";

import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import PortalAuthForm from "@/components/portal/PortalAuthForm";

export default function AuthDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const titleId = useId();
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (!open) {
      setAuthMode("login");
      return;
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-ink/60 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-[0_24px_50px_-28px_rgba(7,16,12,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">
              Account
            </p>
            <h3
              id={titleId}
              className="mt-2 font-display text-3xl uppercase tracking-wide text-ink"
            >
              {authMode === "signup" ? "Create Account" : "Sign In"}
            </h3>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full border border-ink/10 p-2 text-ink/40 transition-colors hover:border-ink/30 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6">
          <PortalAuthForm stay embedded onModeChange={setAuthMode} onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
}
