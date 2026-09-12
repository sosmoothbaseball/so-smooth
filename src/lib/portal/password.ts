export const PASSWORD_RULES = [
  {
    id: "upper",
    label: "One capital letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: "letter",
    label: "One other letter",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    id: "number",
    label: "One number",
    test: (value: string) => /\d/.test(value),
  },
] as const;

export const PASSWORD_RULES_MESSAGE =
  "Use a capital letter, one other letter, and a number.";

export function passwordMeetsRules(password: string) {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}
