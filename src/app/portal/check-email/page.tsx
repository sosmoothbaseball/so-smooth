import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Confirm Email | So Smooth",
};

export default function CheckEmailPage() {
  return (
    <>
      <PageHero
        eyebrow="Accounts"
        title={
          <>
            Check Your <span className="text-green-400">Email</span>
          </>
        }
      />
      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto w-full max-w-xl px-6">
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
            <h2 className="font-display text-4xl uppercase tracking-wide text-ink">
              Almost In
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              Your account is created. Open the email from So Smooth, tap the
              confirm link, then come back here to sign in.
            </p>
            <p className="mt-8 text-center text-sm text-ink/60">
              <Link href="/portal" className="font-semibold text-green-700 hover:text-green-800">
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
