const KEY = "so-smooth-resume-auth";

export type ResumeAuth =
  | { kind: "testimonial" }
  | { kind: "lesson"; slotId: string }
  | { kind: "event"; eventId: string }
  | { kind: "college-program" };

export function setResumeAuth(value: ResumeAuth) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(value));
}

export function peekResumeAuth(): ResumeAuth | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ResumeAuth;
  } catch {
    sessionStorage.removeItem(KEY);
    return null;
  }
}

export function takeResumeAuthIf<K extends ResumeAuth["kind"]>(
  kind: K,
): Extract<ResumeAuth, { kind: K }> | null {
  const value = peekResumeAuth();
  if (!value || value.kind !== kind) return null;
  sessionStorage.removeItem(KEY);
  return value as Extract<ResumeAuth, { kind: K }>;
}
