import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "onLight";
type ButtonSize = "md" | "lg" | "sm";

const base =
  "group relative inline-flex items-center justify-center gap-2 font-semibold tracking-wide uppercase whitespace-nowrap rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-green-500 text-ink shadow-[0_0_0_0_rgba(57,217,122,0)] hover:bg-green-400 hover:shadow-[0_0_28px_4px_rgba(57,217,122,0.45)] active:scale-[0.97]",
  secondary:
    "bg-yellow-500 text-ink hover:bg-yellow-400 hover:shadow-[0_0_28px_4px_rgba(244,196,48,0.4)] active:scale-[0.97]",
  outline:
    "border border-white/25 text-bone hover:border-green-400 hover:text-green-300 hover:bg-white/5 active:scale-[0.97]",
  ghost: "text-bone/80 hover:text-green-300",
  onLight:
    "border border-ink/20 text-ink hover:border-green-600 hover:text-green-700 hover:bg-green-500/5 active:scale-[0.97]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  pending?: boolean;
  external?: boolean;
  download?: string | boolean;
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
  disabled,
  pending,
  external,
  download,
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    if (download) {
      return (
        <a
          href={href}
          download={download === true ? true : download}
          className={classes}
        >
          {children}
        </a>
      );
    }
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled || pending} className={classes}>
      {children}
    </button>
  );
}
