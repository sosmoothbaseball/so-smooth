import { PASSWORD_RULES } from "@/lib/portal/password";
import { cn } from "@/lib/utils";

export default function PasswordRules({ value }: { value: string }) {
  return (
    <ul className="flex flex-col gap-1">
      {PASSWORD_RULES.map((rule) => {
        const passed = value.length > 0 && rule.test(value);
        return (
          <li
            key={rule.id}
            className={cn(
              "text-xs transition-colors",
              passed ? "text-green-700" : "text-ink/45",
            )}
          >
            <span className="mr-1.5 inline-block w-3">{passed ? "✓" : "○"}</span>
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
