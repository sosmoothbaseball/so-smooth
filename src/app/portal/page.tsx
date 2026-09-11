import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import { TextField } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { getSession, portalHome } from "@/lib/portal/auth";
import { loginAction } from "@/lib/portal/actions";

export const metadata: Metadata = {
  title: "Portal | So Smooth",
  description: "Sign in to book lessons, manage bookings, or run the coach calendar.",
};

export default async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session) redirect(portalHome(session.role));
  const { error } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="Accounts"
        title={
          <>
            Client <span className="text-green-400">Portal</span>
          </>
        }
        description="Parents manage bookings here. Coaches run slots, camps, and the calendar."
      />

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-700">
              Sign In
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase tracking-wide text-ink">
              Welcome Back
            </h2>
            <p className="mt-3 mb-8 text-sm text-ink/60">
              Demo tester login. Use the coach or parent account on the right.
            </p>
            <form action={loginAction} className="flex flex-col gap-5">
              <TextField
                id="portal-email"
                name="email"
                type="email"
                label="Email"
                autoComplete="email"
                required
              />
              <TextField
                id="portal-password"
                name="password"
                type="password"
                label="Password"
                autoComplete="current-password"
                required
              />
              {error && (
                <p className="text-sm text-red-700">That email or password did not match.</p>
              )}
              <Button type="submit" size="lg" className="w-full">
                Sign In
              </Button>
            </form>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
                Coach test account
              </p>
              <p className="mt-3 font-display text-3xl uppercase tracking-wide text-ink">
                Carlos Vega
              </p>
              <p className="mt-2 text-sm text-ink/60">coach@sosmooth.test</p>
              <p className="text-sm text-ink/60">password: coach1</p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
                Parent test account
              </p>
              <p className="mt-3 font-display text-3xl uppercase tracking-wide text-ink">
                Jordan Reyes
              </p>
              <p className="mt-2 text-sm text-ink/60">parent@sosmooth.test</p>
              <p className="text-sm text-ink/60">password: parent</p>
              <p className="mt-3 text-sm text-ink/50">
                Players on this account: Mateo Reyes (12U) and Luca Reyes (11U).
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
