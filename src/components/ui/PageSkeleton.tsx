import { cn } from "@/lib/utils";

function Block({ className }: { className?: string }) {
  return <div className={cn("animate-shimmer rounded-2xl bg-ink/8", className)} />;
}

function HeroSkeleton() {
  return (
    <section className="relative isolate overflow-hidden bg-ink pt-36 pb-20 sm:pt-44 sm:pb-28">
      <div className="bg-grid mask-fade-x absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6">
        <Block className="h-7 w-36 rounded-full bg-white/10" />
        <Block className="mt-6 h-16 w-64 sm:h-20 sm:w-96 bg-white/10" />
        <Block className="mt-6 h-4 w-72 max-w-full bg-white/10 sm:w-[28rem]" />
      </div>
    </section>
  );
}

export default function PageSkeleton({
  variant = "page",
}: {
  variant?: "page" | "cards" | "portal" | "dashboard";
}) {
  if (variant === "portal") {
    return (
      <>
        <HeroSkeleton />
        <section className="bg-bone py-20 sm:py-28">
          <div className="mx-auto max-w-xl px-6">
            <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-10">
              <Block className="h-3 w-20" />
              <Block className="mt-4 h-10 w-48" />
              <Block className="mt-8 h-12 w-full" />
              <Block className="mt-4 h-12 w-full" />
              <Block className="mt-6 h-12 w-full rounded-full" />
            </div>
          </div>
        </section>
      </>
    );
  }

  if (variant === "dashboard") {
    return (
      <section className="bg-bone py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Block className="h-3 w-28" />
          <Block className="mt-3 h-12 w-56" />
          <div className="mt-8 flex gap-2">
            <Block className="h-9 w-32 rounded-full" />
            <Block className="h-9 w-28 rounded-full" />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Block className="h-72" />
            <Block className="h-72" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <HeroSkeleton />
      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          {variant === "cards" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Block className="h-80" />
              <Block className="h-80" />
            </div>
          ) : (
            <>
              <Block className="mx-auto h-8 w-48" />
              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                <Block className="h-44" />
                <Block className="h-44" />
                <Block className="h-44" />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
