"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, PORTAL_HREF } from "@/lib/nav";
import InstagramPicker from "@/components/layout/InstagramPicker";
import CartDropdown from "@/components/shop/CartDropdown";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-ink/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.35)] border-b border-white/5"
          : "bg-ink/70 backdrop-blur-md border-b border-white/5",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:h-[4.25rem] sm:px-6">
        <Link
          href="/"
          className="min-w-0 shrink-0 font-display text-2xl uppercase leading-none tracking-wide text-bone transition-colors hover:text-green-300 sm:text-3xl"
        >
          So Smooth
        </Link>

        <nav className="hidden items-center gap-3 xl:flex xl:gap-3.5">
          {NAV_LINKS.filter((link) => link.href !== "/").map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative whitespace-nowrap py-2 text-xs font-semibold uppercase tracking-wide text-bone/80 transition-colors hover:text-bone",
                  active && "text-bone",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-green-400 to-yellow-400 transition-transform duration-300 group-hover:scale-x-100",
                    active && "scale-x-100",
                  )}
                />
              </Link>
            );
          })}
          <Link
            href={PORTAL_HREF}
            className={cn(
              "whitespace-nowrap rounded-full bg-green-500 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink shadow-[0_0_0_0_rgba(57,217,122,0)] transition-all hover:bg-green-400 hover:shadow-[0_0_20px_3px_rgba(57,217,122,0.4)]",
              pathname.startsWith("/portal") && "bg-green-400",
            )}
          >
            Client Portal
          </Link>
        </nav>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <InstagramPicker className="h-8 w-8" iconClassName="h-4 w-4" />
          <CartDropdown />
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <CartDropdown compact />
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-bone"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/10 bg-ink xl:hidden"
          >
            <nav className="flex max-h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto overscroll-contain px-6 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:max-h-[calc(100dvh-4.25rem)]">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-white/5 py-3 text-lg font-semibold uppercase tracking-wide text-bone/85 transition-colors hover:text-green-300"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05 }}
              >
                <Link
                  href={PORTAL_HREF}
                  onClick={() => setOpen(false)}
                  className="mt-2 block rounded-full bg-green-500 px-4 py-3 text-center text-lg font-semibold uppercase tracking-wide text-ink hover:bg-green-400"
                >
                  Client Portal
                </Link>
              </motion.div>
              <div className="mt-5">
                <InstagramPicker className="h-11 w-11" iconClassName="h-5 w-5" />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
