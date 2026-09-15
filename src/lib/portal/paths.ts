export function safeReturnPath(value: unknown) {
  const next = String(value || "").trim();
  if (!next.startsWith("/")) return null;
  if (next.startsWith("//") || next.startsWith("/\\")) return null;
  if (next.includes("://") || next.includes("\\")) return null;
  if (/[\s\0]/.test(next)) return null;
  if (next.length > 200) return null;
  return next;
}
