import Link from "next/link";
import { cn } from "@/lib/utils";

export default function OwnerCoachPicker({
  coaches,
  selectedId,
  ownerId,
}: {
  coaches: { id: string; name: string }[];
  selectedId: string;
  ownerId: string;
}) {
  return (
    <div className="mb-6 rounded-3xl border border-ink/10 bg-white p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-700">
        All Coaches
      </p>
      <p className="mt-2 text-sm text-ink/55">
        Open a coach to see their booked lessons.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {coaches.map((coach) => {
          const href =
            coach.id === ownerId ? "/portal/coach" : `/portal/coach?coach=${coach.id}`;
          const active = coach.id === selectedId;
          return (
            <Link
              key={coach.id}
              href={href}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
                active
                  ? "border-green-700 bg-green-700 text-bone"
                  : "border-ink/10 bg-white text-ink/70 hover:border-green-600 hover:text-green-700",
              )}
            >
              {coach.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
