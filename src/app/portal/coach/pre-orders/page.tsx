import Link from "next/link";
import { requireCoach } from "@/lib/portal/auth";
import { getPreOrderPage } from "@/lib/portal/queries";
import PortalShell from "@/components/portal/PortalShell";
import PortalPanel from "@/components/portal/PortalPanel";
import PreOrderRow from "@/components/portal/PreOrderRow";

export default async function CoachPreOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await requireCoach();
  const { page } = await searchParams;
  const current = Number(page || "1");
  const { items, total, page: safePage, pageCount } = await getPreOrderPage(current);

  return (
    <PortalShell user={user} pathname="/portal/coach/pre-orders">
      <PortalPanel
        title="Pre Orders"
        description="Families on the So Smooth Glove pre-order list. Reach out, or tap X to remove one."
      >
        <p className="mb-4 text-xs uppercase tracking-wide text-ink/40">
          {total} {total === 1 ? "pre-order" : "pre-orders"}
        </p>
        <ul className="flex flex-col gap-3">
          {items.length === 0 ? (
            <li className="text-sm text-ink/50">No pre-orders yet.</li>
          ) : (
            items.map((order) => <PreOrderRow key={order.id} order={order} />)
          )}
        </ul>
        {pageCount > 1 ? (
          <div className="mt-6 flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
            {safePage > 1 ? (
              <Link
                href={`/portal/coach/pre-orders?page=${safePage - 1}`}
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
                href={`/portal/coach/pre-orders?page=${safePage + 1}`}
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
    </PortalShell>
  );
}
