import type { Metadata } from "next";
import { CheckCircle2, Download, ExternalLink, FileText, Shield } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import CTASection from "@/components/home/CTASection";
import WaiverDocument from "@/components/waiver/WaiverDocument";
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
        description="Open the PDF in a new tab or download it to your phone. The page below is a finished example of how the form reads."
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
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <WaiverDocument />

          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-sm">
              <div className="flex items-center gap-4 border-b border-ink/10 px-6 py-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-700 text-bone">
                  <FileText className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display text-2xl uppercase tracking-wide text-ink">
                    So Smooth Waiver
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-ink/40">
                    PDF · View or download
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 px-6 py-6">
                <Button href={WAIVER_HREF} size="lg" className="w-full" external>
                  View PDF
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  href={WAIVER_HREF}
                  variant="onLight"
                  size="lg"
                  className="w-full"
                  download={WAIVER_FILENAME}
                >
                  Download File
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-ink/10 bg-ink p-6 sm:p-8">
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
          </aside>
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
