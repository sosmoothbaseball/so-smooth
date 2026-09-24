import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-green-600";

type FieldShellProps = {
  label: string;
  htmlFor: string;
  children: ReactNode;
};

function FieldShell({ label, htmlFor, children }: FieldShellProps) {
  if (!label) {
    return <div className="flex flex-col justify-end">{children}</div>;
  }

  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
        {label}
      </span>
      {children}
    </label>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  invalid?: boolean;
};

export function TextField({
  label,
  id,
  className,
  invalid,
  disabled,
  readOnly,
  ...props
}: TextFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id}>
      <input
        id={id}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={invalid || undefined}
        className={cn(
          fieldClass,
          invalid && "border-red-500 focus:border-red-500",
          (disabled || readOnly) && "cursor-not-allowed bg-bone text-ink/50",
          className,
        )}
        {...props}
      />
    </FieldShell>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  id: string;
};

export function SelectField({
  label,
  id,
  className,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id}>
      <select id={id} className={cn(fieldClass, className)} {...props}>
        {children}
      </select>
    </FieldShell>
  );
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  id: string;
};

export function TextAreaField({
  label,
  id,
  className,
  ...props
}: TextAreaFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id}>
      <textarea id={id} className={cn(fieldClass, "min-h-32 resize-y", className)} {...props} />
    </FieldShell>
  );
}

type FileFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  hint?: string;
};

export function FileField({ label, id, hint, className, ...props }: FileFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id}>
      <input
        id={id}
        type="file"
        className={cn(
          "w-full rounded-xl border border-dashed border-ink/20 bg-bone px-4 py-4 text-sm text-ink file:mr-4 file:rounded-full file:border-0 file:bg-green-700 file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-wide file:text-bone hover:border-green-600",
          className,
        )}
        {...props}
      />
      {hint && <span className="text-xs text-ink/40">{hint}</span>}
    </FieldShell>
  );
}
