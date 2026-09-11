"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function BookingConfirmed({
  open,
  kind,
  title,
  detail,
  onClose,
}: {
  open: boolean;
  kind: "lesson" | "event";
  title: string;
  detail?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-end justify-center bg-ink/65 p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-confirmed-title"
            initial={{ opacity: 0, y: 32, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white px-7 py-9 text-center shadow-[0_24px_50px_-28px_rgba(7,16,12,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pointer-events-none absolute -left-12 -top-10 h-36 w-36 rounded-full bg-yellow-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 top-10 h-32 w-32 rounded-full bg-green-500/15 blur-3xl" />

            <motion.div
              className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-700 ring-4 ring-yellow-500/80"
              initial={{ scale: 0.35, rotate: -18 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 14, delay: 0.06 }}
            >
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-bone" fill="none">
                <motion.path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, delay: 0.28, ease: "easeOut" }}
                />
              </svg>
            </motion.div>

            <p className="relative mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-green-700">
              You&apos;re In
            </p>
            <h3
              id="booking-confirmed-title"
              className="relative mt-2 font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl"
            >
              {kind === "event" ? "Event Confirmed" : "Lesson Confirmed"}
            </h3>
            <p className="relative mt-3 font-semibold text-ink">{title}</p>
            {detail ? <p className="relative mt-1 text-sm text-ink/55">{detail}</p> : null}
            <p className="relative mt-4 text-sm leading-relaxed text-ink/60">
              It&apos;s on your family&apos;s bookings. Cancel from the portal if plans change.
            </p>
            <div className="relative mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button href="/portal/parent">View Bookings</Button>
              <Button type="button" variant="onLight" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
