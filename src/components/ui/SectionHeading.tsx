import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em]",
            dark ? "text-green-300" : "text-green-600",
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wide leading-[0.95]",
          dark ? "text-bone" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-base sm:text-lg leading-relaxed",
            dark ? "text-bone/70" : "text-ink/70",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
