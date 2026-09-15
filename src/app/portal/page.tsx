import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import { getSession, portalHome } from "@/lib/portal/auth";
import { safeReturnPath } from "@/lib/portal/paths";
import PortalAuthForm from "@/components/portal/PortalAuthForm";

export const metadata: Metadata = {
  title: "Portal | So Smooth",
  description: "Sign in to book lessons, manage bookings, or run the coach calendar.",
};

export default async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const session = await getSession();
  const { error, next: rawNext } = await searchParams;
  const next = safeReturnPath(rawNext);
  if (session) {
    if (session.role === "parent" && next) redirect(next);
    redirect(portalHome(session.role));
  }

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
        <div className="mx-auto w-full max-w-xl px-6">
          <PortalAuthForm initialError={error ? "Incorrect password" : ""} next={next} />
        </div>
      </section>
    </>
  );
}
