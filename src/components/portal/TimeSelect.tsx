"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = [0, 15, 30, 45];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function partsFromValue(value: string) {
  const [rawHour, rawMinute] = String(value || "13:00").split(":");
  const hour24 = Number(rawHour);
  const minute = Number(rawMinute);
  const safeHour = Number.isFinite(hour24) ? Math.min(23, Math.max(0, hour24)) : 13;
  const safeMinute = Number.isFinite(minute) ? Math.min(59, Math.max(0, minute)) : 0;
  return {
    hour12: safeHour % 12 === 0 ? 12 : safeHour % 12,
    minute: safeMinute,
    period: (safeHour >= 12 ? "PM" : "AM") as "AM" | "PM",
  };
}

function valueFromParts(hour12: number, minute: number, period: "AM" | "PM") {
  const hour24 = (hour12 % 12) + (period === "PM" ? 12 : 0);
  return `${pad(hour24)}:${pad(minute)}`;
}

export default function TimeSelect({
  id,
  name,
  value,
  disabled,
  onChange,
  className,
}: {
  id?: string;
  name?: string;
  value: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}) {
  const autoId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<"hour" | "minute" | null>(null);
  const parts = partsFromValue(value);
  const minutes = MINUTES.includes(parts.minute)
    ? MINUTES
    : [...MINUTES, parts.minute].sort((a, b) => a - b);

  function update(next: Partial<{ hour12: number; minute: number; period: "AM" | "PM" }>) {
    onChange?.(
      valueFromParts(next.hour12 ?? parts.hour12, next.minute ?? parts.minute, next.period ?? parts.period),
    );
  }

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(null);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
    }
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <div
        className={cn(
          "flex items-center justify-between gap-2 rounded-xl border border-ink/15 bg-white px-2.5 py-2 transition-colors",
          open && "border-green-600",
          disabled && "opacity-40",
        )}
      >
        <div className="flex items-center">
          <TimeButton
            id={id || `${autoId}-hour`}
            label="Hour"
            open={open === "hour"}
            disabled={disabled}
            onClick={() => setOpen((current) => (current === "hour" ? null : "hour"))}
          >
            {parts.hour12}
          </TimeButton>
          <span className="px-0.5 text-sm font-semibold text-ink/30">:</span>
          <TimeButton
            label="Minutes"
            open={open === "minute"}
            disabled={disabled}
            onClick={() => setOpen((current) => (current === "minute" ? null : "minute"))}
          >
            {pad(parts.minute)}
          </TimeButton>
        </div>
        <button
          type="button"
          disabled={disabled}
          aria-label="AM or PM"
          onClick={() => update({ period: parts.period === "AM" ? "PM" : "AM" })}
          className="rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink/70 transition-colors hover:bg-green-500/10 hover:text-green-700 disabled:pointer-events-none"
        >
          {parts.period}
        </button>
      </div>

      {open === "hour" && !disabled && (
        <PickerPanel label="Hour">
          <div className="grid grid-cols-4 gap-1">
            {HOURS.map((hour) => (
              <Choice
                key={hour}
                active={hour === parts.hour12}
                onClick={() => {
                  update({ hour12: hour });
                  setOpen(null);
                }}
              >
                {hour}
              </Choice>
            ))}
          </div>
        </PickerPanel>
      )}

      {open === "minute" && !disabled && (
        <PickerPanel label="Minutes">
          <div className="grid grid-cols-4 gap-1">
            {minutes.map((minute) => (
              <Choice
                key={minute}
                active={minute === parts.minute}
                onClick={() => {
                  update({ minute });
                  setOpen(null);
                }}
              >
                {pad(minute)}
              </Choice>
            ))}
          </div>
        </PickerPanel>
      )}
    </div>
  );
}

function TimeButton({
  id,
  label,
  open,
  disabled,
  onClick,
  children,
}: {
  id?: string;
  label: string;
  open: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: number | string;
}) {
  return (
    <button
      id={id}
      type="button"
      aria-label={label}
      aria-expanded={open}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg px-1.5 py-1 text-sm font-semibold text-ink transition-colors hover:bg-green-500/10 hover:text-green-700 disabled:pointer-events-none",
        open && "bg-green-500/10 text-green-700",
      )}
    >
      {children}
      <ChevronDown className="h-3 w-3 text-ink/35" />
    </button>
  );
}

function PickerPanel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      role="listbox"
      aria-label={label}
      className="absolute z-20 mt-2 w-full min-w-[12.5rem] rounded-2xl border border-ink/10 bg-white p-2 shadow-[0_18px_40px_-24px_rgba(7,16,12,0.45)]"
    >
      {children}
    </div>
  );
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: number | string;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-xl px-2 py-2 text-sm font-semibold transition-colors",
        active ? "bg-green-500 text-ink" : "text-ink hover:bg-green-500/10 hover:text-green-700",
      )}
    >
      {children}
    </button>
  );
}
