"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  deleteTestimonialAction,
  featureTestimonialAction,
  unfeatureTestimonialAction,
} from "@/lib/portal/actions";
import { formatWhen } from "@/lib/portal/dates";
import { TESTIMONIAL_FEATURED_MAX } from "@/lib/portal/testimonials";
import ActionForm from "@/components/portal/ActionForm";
import Button from "@/components/ui/Button";

export type TestimonialRowItem = {
  id: string;
  quote: string;
  displayName: string;
  roleLabel: string;
  featuredSlot: number | null;
  createdAt: Date;
  parent: { name: string; email: string } | null;
};

export type FeaturedChoice = {
  id: string;
  displayName: string;
  roleLabel: string;
  featuredSlot: number | null;
};

export default function TestimonialRow({
  item,
  featured,
}: {
  item: TestimonialRowItem;
  featured: FeaturedChoice[];
}) {
  const [replaceOpen, setReplaceOpen] = useState(false);
  const [replaceId, setReplaceId] = useState(featured[0]?.id || "");
  const featuredCount = featured.length;
  const onHomepage = item.featuredSlot != null;
  const homepageFull = featuredCount >= TESTIMONIAL_FEATURED_MAX;
  const outgoing = featured.find((row) => row.id === replaceId);

  return (
    <li className="rounded-2xl border border-ink/10 px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {onHomepage ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700">
              Homepage slot {item.featuredSlot}
            </p>
          ) : (
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/40">
              Inbox
            </p>
          )}
          <p className="mt-1 font-display text-2xl uppercase tracking-wide text-ink">
            {item.displayName}
          </p>
          <p className="mt-1 text-sm text-ink/55">{item.roleLabel}</p>
          <p className="mt-1 text-sm text-ink/45">{formatWhen(item.createdAt)}</p>
        </div>
        <ActionForm
          action={deleteTestimonialAction}
          confirm={{
            title: "Delete this story?",
            message: onHomepage
              ? `Delete ${item.displayName}'s story? It will also come off the homepage. This cannot be undone.`
              : `Delete ${item.displayName}'s story? This cannot be undone.`,
            confirmLabel: "Delete",
          }}
        >
          <input type="hidden" name="testimonialId" value={item.id} />
          <button
            type="submit"
            aria-label={`Delete ${item.displayName}`}
            className="rounded-full border border-ink/10 p-2 text-ink/40 transition-colors hover:border-red-300 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </ActionForm>
      </div>

      {item.parent ? (
        <p className="mt-2 text-sm text-ink/55">
          From {item.parent.name} · {item.parent.email}
        </p>
      ) : (
        <p className="mt-2 text-sm text-ink/45">Original homepage story</p>
      )}

      <p className="mt-3 text-sm leading-relaxed text-ink/70">&ldquo;{item.quote}&rdquo;</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {onHomepage ? (
          <ActionForm
            action={unfeatureTestimonialAction}
            confirm={{
              title: "Take this off the homepage?",
              message: "It stays in this list. You can add it back later.",
              confirmLabel: "Remove",
            }}
          >
            <input type="hidden" name="testimonialId" value={item.id} />
            <Button type="submit" variant="onLight" size="sm">
              Remove From Homepage
            </Button>
          </ActionForm>
        ) : homepageFull ? (
          <Button type="button" variant="onLight" size="sm" onClick={() => setReplaceOpen(true)}>
            Show On Homepage
          </Button>
        ) : (
          <ActionForm
            action={featureTestimonialAction}
            confirm={{
              title: "Show this on the homepage?",
              message: `${item.displayName}'s story will take an open homepage spot.`,
              confirmLabel: "Show",
            }}
          >
            <input type="hidden" name="testimonialId" value={item.id} />
            <Button type="submit" variant="onLight" size="sm">
              Show On Homepage
            </Button>
          </ActionForm>
        )}
      </div>

      {replaceOpen ? (
        <div
          className="fixed inset-0 z-[95] flex items-end justify-center bg-ink/60 p-4 sm:items-center"
          onClick={() => setReplaceOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_50px_-28px_rgba(7,16,12,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">
              Homepage
            </p>
            <h3 className="mt-2 font-display text-3xl uppercase tracking-wide text-ink">
              Replace a story
            </h3>
            <p className="mt-3 text-sm text-ink/60">
              All 3 spots are filled. Pick which one comes off the homepage. It will still be in this
              list.
            </p>
            <ActionForm
              action={featureTestimonialAction}
              className="mt-5 flex flex-col gap-3"
              onSuccess={() => setReplaceOpen(false)}
            >
              <input type="hidden" name="testimonialId" value={item.id} />
              <input type="hidden" name="replaceId" value={replaceId} />
              <ul className="flex flex-col gap-2">
                {featured.map((row) => (
                  <li key={row.id}>
                    <button
                      type="button"
                      onClick={() => setReplaceId(row.id)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                        replaceId === row.id
                          ? "border-green-700 bg-green-500/10"
                          : "border-ink/10 hover:border-green-600"
                      }`}
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700">
                        Slot {row.featuredSlot}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-ink">{row.displayName}</p>
                      <p className="text-xs text-ink/50">{row.roleLabel}</p>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button type="submit" disabled={!replaceId}>
                  {outgoing ? `Replace ${outgoing.displayName}` : "Replace"}
                </Button>
                <Button type="button" variant="onLight" onClick={() => setReplaceOpen(false)}>
                  Go Back
                </Button>
              </div>
            </ActionForm>
          </div>
        </div>
      ) : null}
    </li>
  );
}
