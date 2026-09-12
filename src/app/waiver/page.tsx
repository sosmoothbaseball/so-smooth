import type { Metadata } from "next";
import { CheckCircle2, Download, ExternalLink, Shield } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import CTASection from "@/components/home/CTASection";
import { WAIVER_FILENAME, WAIVER_HREF } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Waiver | So Smooth",
  description: "View or download the So Smooth player participation waiver.",
};

const CHECKLIST = [
  "Parent or guardian signs for players under 18",
  "One waiver covers the current season",
  "Ask staff if you need a paper copy at the field",
];

export default function WaiverPage() {
  return (
    <>
      <PageHero
        eyebrow="Required Form"
        title={
          <>
            Player <span className="text-green-400">Waiver</span>
          </>
        }
        description="Open the PDF in a new tab or download it to your phone before your player's first session."
        actions={
          <>
            <Button href={WAIVER_HREF} size="lg" external>
              View PDF
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              href={WAIVER_HREF}
              variant="outline"
              size="lg"
              download={WAIVER_FILENAME}
            >
              Download
              <Download className="h-4 w-4" />
            </Button>
          </>
        }
      />

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-xl px-6">
          <div className="rounded-3xl border border-ink/10 bg-ink p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-yellow-400" />
              <p className="font-display text-2xl uppercase tracking-wide text-bone">
                Before You Play
              </p>
            </div>
            <ul className="mt-6 flex flex-col gap-4">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-bone/70">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Next Step"
        title={
          <>
            Form Done. <span className="text-yellow-400">Book Next.</span>
          </>
        }
        description="Once the waiver is handled, grab a lesson, clinic, or tryout on the scheduler."
        primary={{ href: "/training", label: "View Training" }}
        secondary={{ href: "/team", label: "See Teams" }}
      />
    </>
  );
}
