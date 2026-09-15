"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Quote, Star, X } from "lucide-react";
import { submitTestimonialAction } from "@/lib/portal/actions";
import { ageGroupOptions } from "@/lib/portal/age-groups";
import { TESTIMONIAL_QUOTE_MAX, TESTIMONIAL_QUOTE_MIN } from "@/lib/portal/testimonials";
import { setResumeAuth, takeResumeAuthIf } from "@/lib/portal/resume-auth";
import ActionForm from "@/components/portal/ActionForm";
import AuthDialog from "@/components/portal/AuthDialog";
import Button from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/FormField";
import SectionHeading from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";

export type FeaturedTestimonial = {
  id: string;
  quote: string;
  displayName: string;
  roleLabel: string;
};

type Viewer =
  | { kind: "guest" }
  | { kind: "coach" }
  | { kind: "parent"; name: string; ageGroup: string };

export default function TestimonialsBoard({
  items,
  viewer,
  openSubmit,
}: {
  items: FeaturedTestimonial[];
  viewer: Viewer;
  openSubmit: boolean;
}) {
  const router = useRouter();
  const titleId = useId();
  const [storyOpen, setStoryOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (viewer.kind !== "parent") return;
    if (takeResumeAuthIf("testimonial")) setStoryOpen(true);
  }, [viewer.kind]);

  useEffect(() => {
    if (!openSubmit) return;
    document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (viewer.kind === "parent") setStoryOpen(true);
    else if (viewer.kind === "guest") setAuthOpen(true);
  }, [openSubmit, viewer.kind]);

  useEffect(() => {
    if (!storyOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeStory();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [storyOpen]);

  function closeStory() {
    setStoryOpen(false);
    if (openSubmit) router.replace("/", { scroll: false });
  }

  function startShare() {
    if (viewer.kind === "parent") {
      setStoryOpen(true);
      return;
    }
    setAuthOpen(true);
  }

  return (
    <section id="testimonials" className="bg-bone py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="What Families Say" title="Trusted by Players & Parents" />

        {items.length === 0 ? (
          <p className="mt-16 text-center text-sm text-ink/55">
            Families, we would love to hear how So Smooth has been for your player.
          </p>
        ) : (
          <StaggerGroup className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <StaggerItem key={item.id}>
                <article className="flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg">
                  <div>
                    <Quote className="h-8 w-8 text-green-500/70" />
                    <p className="mt-5 text-sm leading-relaxed text-ink/75">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                  <div className="mt-6">
                    <div className="flex gap-1 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-ink">{item.displayName}</p>
                    <p className="text-xs text-ink/50">{item.roleLabel}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}

        <div className="mt-10 flex flex-col items-center gap-3">
          {viewer.kind === "coach" ? (
            <Button href="/portal/coach/testimonials" variant="onLight">
              Manage Testimonials
            </Button>
          ) : (
            <Button type="button" variant="onLight" onClick={startShare}>
              Share Your Story
            </Button>
          )}
        </div>
      </div>

      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          setResumeAuth({ kind: "testimonial" });
          setAuthOpen(false);
          router.refresh();
        }}
      />

      {storyOpen && viewer.kind === "parent" ? (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/60 p-4 sm:items-center"
          onClick={closeStory}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-[0_24px_50px_-28px_rgba(7,16,12,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">
                  Families
                </p>
                <h3
                  id={titleId}
                  className="mt-2 font-display text-3xl uppercase tracking-wide text-ink"
                >
                  Share Your Story
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={closeStory}
                className="rounded-full border border-ink/10 p-2 text-ink/40 transition-colors hover:border-ink/30 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ActionForm
              action={submitTestimonialAction}
              className="mt-6 flex flex-col gap-4"
              confirm={{
                title: "Send this story?",
                confirmLabel: "Send",
              }}
              onSuccess={closeStory}
            >
              <TextField
                id="testimonial-name"
                name="displayName"
                label="Name To Show"
                defaultValue={viewer.name}
                required
                maxLength={80}
                autoComplete="name"
              />
              <SelectField
                id="testimonial-age"
                name="ageGroup"
                label="Player Age Group"
                defaultValue={viewer.ageGroup}
                required
              >
                {ageGroupOptions(viewer.ageGroup).map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </SelectField>
              <TextAreaField
                id="testimonial-quote"
                name="quote"
                label="Your Story"
                required
                minLength={TESTIMONIAL_QUOTE_MIN}
                maxLength={TESTIMONIAL_QUOTE_MAX}
                placeholder="What has So Smooth meant for your player?"
              />
              <p className="text-xs text-ink/40">
                {TESTIMONIAL_QUOTE_MIN}–{TESTIMONIAL_QUOTE_MAX} characters.
              </p>
              <Button type="submit">Submit Story</Button>
            </ActionForm>
          </div>
        </div>
      ) : null}
    </section>
  );
}
