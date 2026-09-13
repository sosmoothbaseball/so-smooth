import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import { getSession, portalHome } from "@/lib/portal/auth";
import PortalAuthForm from "@/components/portal/PortalAuthForm";

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
      />

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <PortalAuthForm initialError={error ? "Incorrect password" : ""} />

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
