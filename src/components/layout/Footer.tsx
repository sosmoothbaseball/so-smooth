import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { NAV_LINKS, SOCIAL_LINKS, CONTACT } from "@/lib/nav";
import { InstagramIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import Button from "@/components/ui/Button";
import NewsletterForm from "@/components/layout/NewsletterForm";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-bone">
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-green-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-yellow-500/10 blur-[100px]" />

      {/* Newsletter strip */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-display text-2xl sm:text-3xl uppercase tracking-wide">
              Stay in the <span className="text-green-400">Loop</span>
            </p>
            <p className="mt-1 text-sm text-bone/60">
              Tryout dates, camp openings, and program news, straight to your inbox.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-ink font-display text-lg">
              C
            </span>
            <span className="font-display text-xl uppercase tracking-wide">
              Carlitos<span className="text-green-400">&apos;</span> Baseball
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-bone/60">
            A year-round youth baseball program built on development, discipline,
            and team, training players to compete on the field and grow off it.
          </p>
          <div className="flex items-center gap-3 pt-1">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone/80 transition-colors hover:border-green-400 hover:text-green-300"
              >
                {s.label === "Instagram" ? (
                  <InstagramIcon className="h-4.5 w-4.5" />
                ) : (
                  <FacebookIcon className="h-4.5 w-4.5" />
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-display text-lg uppercase tracking-wide text-bone">
            Quick Links
          </h3>
          <ul className="mt-5 flex flex-col gap-3 text-sm text-bone/65">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-2 transition-colors hover:text-green-300"
                >
                  <span className="h-1 w-1 rounded-full bg-green-500" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Programs */}
        <div>
          <h3 className="font-display text-lg uppercase tracking-wide text-bone">
            Programs
          </h3>
          <ul className="mt-5 flex flex-col gap-3 text-sm text-bone/65">
            {[
              "Private Lessons",
              "Group Clinics",
              "Camps & Clinics",
              "Travel Teams",
              "Facility Rentals",
              "Memberships",
            ].map((program) => (
              <li key={program} className="inline-flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-yellow-500" />
                {program}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display text-lg uppercase tracking-wide text-bone">
            Get In Touch
          </h3>
          <ul className="mt-5 flex flex-col gap-4 text-sm text-bone/65">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
              {CONTACT.address}
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
              <a href={CONTACT.phoneHref} className="hover:text-green-300 transition-colors">
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-green-300 transition-colors">
                {CONTACT.email}
              </a>
            </li>
          </ul>
          <Button href="#" variant="outline" size="sm" className="mt-6">
            Client Portal
          </Button>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-bone/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Carlitos&apos; Baseball. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/waiver" className="hover:text-green-300 transition-colors">
              Waiver
            </Link>
            <span className="hover:text-green-300 transition-colors cursor-default">
              Privacy Policy
            </span>
            <span className="hover:text-green-300 transition-colors cursor-default">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
