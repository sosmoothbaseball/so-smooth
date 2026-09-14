import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ForgotPasswordForm from "@/components/portal/ForgotPasswordForm";
import ResetPasswordForm from "@/components/portal/ResetPasswordForm";
import { getSession } from "@/lib/portal/auth";
import { hasPasswordResetSession } from "@/lib/portal/password-reset";

export const metadata: Metadata = {
  title: "Reset Password | So Smooth",
};

export default async function UpdatePasswordPage() {
  const [session, fromEmailLink] = await Promise.all([
    getSession(),
    hasPasswordResetSession(),
  ]);
  const canSetPassword = Boolean(session && fromEmailLink);

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
            {canSetPassword && session ? (
              <>
                <h2 className="font-display text-4xl uppercase tracking-wide text-ink">
                  Choose A Password
                </h2>
                <p className="mt-3 mb-8 text-sm text-ink/60">
                  Pick a new password for {session.email}.
                </p>
                <ResetPasswordForm
                  nextHref={
                    session.role === "coach" ? "/portal/coach/profile" : "/portal/parent/profile"
                  }
                />
              </>
            ) : (
              <>
                <h2 className="font-display text-4xl uppercase tracking-wide text-ink">
                  Reset Password
                </h2>
                <p className="mt-3 mb-8 text-sm text-ink/60">
                  We will email you a reset link. Use that link to choose a
                  new password.
                </p>
                <ForgotPasswordForm email={session?.email} />
              </>
            )}
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
