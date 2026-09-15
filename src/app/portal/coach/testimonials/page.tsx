import Link from "next/link";
import { requireCoach } from "@/lib/portal/auth";
import { getTestimonialPage } from "@/lib/portal/queries";
import { TESTIMONIAL_FEATURED_SLOTS } from "@/lib/portal/testimonials";
import { unfeatureTestimonialAction } from "@/lib/portal/actions";
import PortalShell from "@/components/portal/PortalShell";
import PortalPanel from "@/components/portal/PortalPanel";
import TestimonialRow from "@/components/portal/TestimonialRow";
import ActionForm from "@/components/portal/ActionForm";
import Button from "@/components/ui/Button";

export default async function CoachTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await requireCoach();
  const { page } = await searchParams;
  const current = Number(page || "1");
  const { items, total, featured, page: safePage, pageCount } =
    await getTestimonialPage(current);

  return (
    <PortalShell user={user} pathname="/portal/coach/testimonials">
      <div className="flex flex-col gap-6">
        <PortalPanel
          title="On The Homepage"
          description="Pick anywhere from 0 to 3 stories. Replacing one takes it off the homepage but keeps it in the list below."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {TESTIMONIAL_FEATURED_SLOTS.map((slot) => {
              const item = featured.find((row) => row.featuredSlot === slot);
              if (!item) {
                return (
                  <div
                    key={slot}
                    className="rounded-2xl border border-dashed border-ink/15 px-4 py-5 text-sm text-ink/40"
                  >
                    Slot {slot} open
                  </div>
                );
              }
              return (
                <div key={item.id} className="rounded-2xl border border-ink/10 px-4 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700">
                    Slot {slot}
                  </p>
                  <p className="mt-2 font-display text-xl uppercase tracking-wide text-ink">
                    {item.displayName}
                  </p>
                  <p className="mt-1 text-xs text-ink/50">{item.roleLabel}</p>
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-ink/70">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <ActionForm
                    action={unfeatureTestimonialAction}
                    className="mt-4"
                    confirm={{
                      title: "Take this off the homepage?",
                      message: "It stays in the list below. You can add it back later.",
                      confirmLabel: "Remove",
                    }}
                  >
                    <input type="hidden" name="testimonialId" value={item.id} />
                    <Button type="submit" variant="onLight" size="sm">
                      Remove
                    </Button>
                  </ActionForm>
                </div>
              );
            })}
          </div>
        </PortalPanel>

        <PortalPanel
          title="All Testimonials"
          description="Every family story. Show up to 3 on the homepage, or tap X to delete one."
        >
          <p className="mb-4 text-xs uppercase tracking-wide text-ink/40">
            {total} {total === 1 ? "story" : "stories"}
          </p>
          <ul className="flex flex-col gap-3">
            {items.length === 0 && (
              <li className="text-sm text-ink/50">No stories yet.</li>
            )}
            {items.map((item) => (
              <TestimonialRow key={item.id} item={item} featured={featured} />
            ))}
          </ul>
          {pageCount > 1 ? (
            <div className="mt-6 flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
              {safePage > 1 ? (
                <Link
                  href={`/portal/coach/testimonials?page=${safePage - 1}`}
                  className="text-green-700 hover:text-green-800"
                >
                  Previous
                </Link>
              ) : (
                <span className="text-ink/25">Previous</span>
              )}
              <span className="text-ink/45">
                Page {safePage} of {pageCount}
              </span>
              {safePage < pageCount ? (
                <Link
                  href={`/portal/coach/testimonials?page=${safePage + 1}`}
                  className="text-green-700 hover:text-green-800"
                >
                  Next
                </Link>
              ) : (
                <span className="text-ink/25">Next</span>
              )}
            </div>
          ) : null}
        </PortalPanel>
      </div>
    </PortalShell>
  );
}
