import { cn } from "@/lib/utils";

export default function PortalPanel({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-3xl border border-ink/10 bg-white p-6 sm:p-8", className)}>
      <h2 className="font-display text-3xl uppercase tracking-wide text-ink">{title}</h2>
      {description && <p className="mt-2 text-sm leading-relaxed text-ink/55">{description}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}
