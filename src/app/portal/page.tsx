import type { Metadata } from "next";
import { CalendarDays, CreditCard, Users } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import PortalLogin from "@/components/portal/PortalLogin";

export const metadata: Metadata = {
  title: "Client Portal | So Smooth",
  description: "Parent and player sign-in for schedules, payments, and roster info.",
};

const PERKS = [
  { icon: CalendarDays, title: "Schedule", body: "Lessons, clinics, and team days in one place." },
  { icon: CreditCard, title: "Billing", body: "Invoices and packages once accounts are live." },
  { icon: Users, title: "Roster", body: "Player info, contacts, and waiver status." },
];

export default function PortalPage() {
  return (
    <>
      <PageHero
        eyebrow="Parents & Players"
        title={
          <>
            Client <span className="text-green-400">Portal</span>
          </>
        }
        description="Sign-in lives here. The form is a finished example until we connect accounts."
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
              Use the email on your family account. Nothing is sent until we hook this up.
            </p>
            <PortalLogin />
          </div>

          <div className="flex flex-col gap-5">
            {PERKS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-ink/10 bg-white p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-700 text-bone">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-wide text-ink">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
