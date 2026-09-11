import Link from "next/link";
import { logoutAction } from "@/lib/portal/actions";
import type { SessionUser } from "@/lib/portal/auth";
import { cn } from "@/lib/utils";

const COACH_LINKS = [
  { href: "/portal/coach", label: "Lesson Schedule" },
  { href: "/portal/coach/calendar", label: "Calendar" },
  { href: "/portal/coach/events", label: "Add Events" },
  { href: "/portal/coach/profile", label: "Edit Profile" },
];

const PARENT_LINKS = [
  { href: "/portal/parent", label: "View Bookings" },
  { href: "/portal/parent/profile", label: "Edit Profile" },
];

export default function PortalShell({
  user,
  pathname,
  children,
}: {
  user: SessionUser;
  pathname: string;
  children: React.ReactNode;
}) {
  const links = user.role === "coach" ? COACH_LINKS : PARENT_LINKS;

  return (
    <section className="bg-bone py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-700">
              {user.role === "coach" ? "Coach Portal" : "Family Portal"}
            </p>
            <h1 className="mt-2 font-display text-5xl uppercase tracking-wide text-ink sm:text-6xl">
              {user.name}
            </h1>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45 transition-colors hover:text-ink"
            >
              Sign Out
            </button>
          </form>
        </div>

        <nav className="mt-8 flex flex-wrap gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
                  active
                    ? "border-green-700 bg-green-700 text-bone"
                    : "border-ink/10 bg-white text-ink/70 hover:border-green-600 hover:text-green-700",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
