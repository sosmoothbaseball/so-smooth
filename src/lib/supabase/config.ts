export const AUTH_UNAVAILABLE =
  "Sign-in is not configured. Add the Supabase URL and anon key, then try again.";

export function supabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

export function supabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ""
  );
}

export function supabaseConfigured() {
  return Boolean(supabaseUrl() && supabaseAnonKey());
}
