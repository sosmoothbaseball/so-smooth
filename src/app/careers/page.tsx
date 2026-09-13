import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import CareersForm from "@/components/careers/CareersForm";

export const metadata: Metadata = {
  title: "Careers | So Smooth",
  description: "Apply to coach or work with So Smooth.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Join the Staff"
        title={
          <>
            Come <span className="text-green-400">Work</span> With Us
          </>
        }
      />

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
            <h2 className="mb-8 font-display text-4xl uppercase tracking-wide text-ink">
              Get In Touch
            </h2>
            <CareersForm />
          </div>
        </div>
      </section>
    </>
  );
}
