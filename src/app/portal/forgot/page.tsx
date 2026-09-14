import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ForgotPasswordForm from "@/components/portal/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | So Smooth",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="Accounts"
        title={
          <>
            Reset <span className="text-green-400">Password</span>
          </>
        }
      />
      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto w-full max-w-xl px-6">
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
            <h2 className="font-display text-4xl uppercase tracking-wide text-ink">
              Forgot Password
            </h2>
            <p className="mt-3 mb-8 text-sm text-ink/60">
              Enter your email and we will send a reset link.
            </p>
            {error ? (
              <p className="mb-6 text-sm text-red-700">
                That reset link is invalid or expired. Request a new one.
              </p>
            ) : null}
            <ForgotPasswordForm />
            <p className="mt-6 text-center text-sm text-ink/60">
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