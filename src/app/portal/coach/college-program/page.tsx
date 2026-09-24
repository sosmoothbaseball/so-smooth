import Link from "next/link";
import { requireCoach } from "@/lib/portal/auth";
import { getCollegeProgramPage } from "@/lib/portal/queries";
import PortalShell from "@/components/portal/PortalShell";
import PortalPanel from "@/components/portal/PortalPanel";
import CollegeProgramRow from "@/components/college/CollegeProgramRow";

export default async function CoachCollegeProgramPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await requireCoach();
  const { page } = await searchParams;
  const current = Number(page || "1");
  const { items, total, page: safePage, pageCount } = await getCollegeProgramPage(current);

  return (
    <PortalShell user={user} pathname="/portal/coach/college-program">
      <PortalPanel
        title="College Program"
        description="Family player profiles. Open one, tap Email to send it, or tap X to remove it."
      >
        <p className="mb-4 text-xs uppercase tracking-wide text-ink/40">
          {total} {total === 1 ? "profile" : "profiles"}
        </p>
        <ul className="flex flex-col gap-3">
          {items.length === 0 ? (
            <li className="text-sm text-ink/50">No player profiles yet.</li>
          ) : (
            items.map((program) => <CollegeProgramRow key={program.id} program={program} />)
          )}
        </ul>
        {pageCount > 1 ? (
          <div className="mt-6 flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
            {safePage > 1 ? (
              <Link
                href={`/portal/coach/college-program?page=${safePage - 1}`}
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
                href={`/portal/coach/college-program?page=${safePage + 1}`}
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
