export const CAREER_ROLE_LABELS: Record<string, string> = {
  hitting: "Hitting Coach",
  pitching: "Pitching Coach",
  catching: "Catching Coach",
  infield: "Infield Coach",
  outfield: "Outfield Coach",
  operations: "Operations / Staff",
  other: "Other",
};

export const CAREER_AVAILABILITY_LABELS: Record<string, string> = {
  weeknights: "Weeknights",
  weekends: "Weekends",
  mornings: "Mornings",
  "full-time": "Full-time",
  flexible: "Flexible",
};

export const CAREER_EXPERIENCE_LABELS: Record<string, string> = {
  "0-1": "0–1 years",
  "2-4": "2–4 years",
  "5-9": "5–9 years",
  "10+": "10+ years",
};

export function careerLabel(map: Record<string, string>, value: string) {
  if (!value) return "";
  return map[value] || value;
}
