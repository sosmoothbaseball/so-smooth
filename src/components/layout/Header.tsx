"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Mail } from "lucide-react";
import { NAV_LINKS, SOCIAL_LINKS, CONTACT } from "@/lib/nav";
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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-ink/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.35)] border-b border-white/5"
          : "bg-transparent border-b border-transparent",
      )}
    >
      {/* Top utility bar */}
      <div
        className={cn(
          "hidden md:block overflow-hidden border-b border-white/5 transition-all duration-300",
          scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-end px-6 py-2.5">
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-bone/80 transition-colors hover:border-green-400 hover:bg-green-400/10 hover:text-green-300"
              >
                {s.label === "Instagram" ? (
                  <InstagramIcon className="h-5 w-5" />
                ) : (
                  <FacebookIcon className="h-5 w-5" />
                )}
              </a>
            ))}
            <a
              href={`mailto:${CONTACT.email}`}
              aria-label="Email us"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-bone/80 transition-colors hover:border-green-400 hover:bg-green-400/10 hover:text-green-300"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-105 overflow-hidden">
            <Image
              src="/brand/logo.png"
              alt="So Smooth logo"
              width={44}
              height={44}
              className="h-full w-full object-cover"
              priority
            />
            <span className="absolute inset-0 rounded-full ring-2 ring-yellow-500/70 scale-110 opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
          <span className="font-display text-3xl sm:text-4xl uppercase tracking-wide leading-none text-bone">
            So Smooth
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-semibold uppercase tracking-wide text-bone/80 transition-colors hover:text-bone py-2",
                  active && "text-bone",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-green-400 to-yellow-400 transition-transform duration-300 group-hover:scale-x-100",
                    "hover:scale-x-100",
                    active && "scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button href="#" variant="outline" size="sm">
            Client Portal
          </Button>
          <Button href="/waiver" variant="primary" size="sm">
            Join Now
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-white/10 bg-ink"
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
                    className="block py-3 text-lg font-semibold uppercase tracking-wide text-bone/85 border-b border-white/5 hover:text-green-300 transition-colors"
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
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-bone/80 hover:text-green-300 hover:border-green-400 transition-colors"
                  >
                    {s.label === "Instagram" ? (
                      <InstagramIcon className="h-5 w-5" />
                    ) : (
                      <FacebookIcon className="h-5 w-5" />
                    )}
                  </a>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <Button href="#" variant="outline" size="md" className="w-full">
                  Client Portal
                </Button>
                <Button href="/waiver" variant="primary" size="md" className="w-full">
                  Join Now
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
