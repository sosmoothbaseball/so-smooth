"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { INSTAGRAM_ACCOUNTS } from "@/lib/nav";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { cn } from "@/lib/utils";

export default function InstagramPicker({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Instagram"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center justify-center rounded-full border border-white/15 text-bone/80 transition-colors hover:border-green-400 hover:bg-green-400/10 hover:text-green-300",
          className,
        )}
      >
        <InstagramIcon className={iconClassName} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-end justify-center bg-ink/65 p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="instagram-picker-title"
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 shadow-[0_24px_50px_-28px_rgba(7,16,12,0.55)]"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-ink/35 hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-green-700">
                Instagram
              </p>
              <h3
                id="instagram-picker-title"
                className="mt-2 font-display text-3xl uppercase tracking-wide text-ink"
              >
                Pick An Account
              </h3>
              <p className="mt-2 text-sm text-ink/55">
                Choose which So Smooth page to open.
              </p>
              <ul className="mt-5 flex flex-col gap-2">
                {INSTAGRAM_ACCOUNTS.map((account) => (
                  <li key={account.href}>
                    <a
                      href={account.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-bone px-4 py-3 text-ink transition-colors hover:border-green-600 hover:bg-green-500/5"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-bone">
                          <InstagramIcon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold">{account.handle}</span>
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-green-700">
                        Open
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
