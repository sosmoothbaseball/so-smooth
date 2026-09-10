"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SOCIAL_LINKS, PORTAL_HREF } from "@/lib/nav";
import { InstagramIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import Button from "@/components/ui/Button";
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
        <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-2">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm transition-transform group-hover:scale-105">
            <Image
              src="/brand/logo.png"
              alt="So Smooth logo"
              width={40}
              height={40}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <span className="font-display text-2xl uppercase leading-none tracking-wide text-bone sm:text-3xl">
            So Smooth
          </span>
        </Link>

        <nav className="hidden items-center gap-4 xl:flex xl:gap-5">
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
        </nav>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-bone/80 transition-colors hover:border-green-400 hover:bg-green-400/10 hover:text-green-300"
              >
                {s.label === "Instagram" ? (
                  <InstagramIcon className="h-4 w-4" />
                ) : (
                  <FacebookIcon className="h-4 w-4" />
                )}
              </a>
            ))}
          </div>
          <Button href={PORTAL_HREF} variant="primary" size="sm">
            Client Portal
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-bone xl:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
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
            <nav className="flex flex-col gap-1 px-6 py-6">
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
              <div className="mt-5 flex items-center gap-4">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-bone/80 transition-colors hover:border-green-400 hover:text-green-300"
                  >
                    {s.label === "Instagram" ? (
                      <InstagramIcon className="h-5 w-5" />
                    ) : (
                      <FacebookIcon className="h-5 w-5" />
                    )}
                  </a>
                ))}
              </div>
              <div className="mt-5">
                <Button
                  href={PORTAL_HREF}
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Client Portal
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
