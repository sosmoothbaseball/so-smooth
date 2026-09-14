import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { markPasswordResetSession } from "@/lib/portal/password-reset";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/portal";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/portal";

  if (code) {
    const supabase = await createSupabaseServer();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        if (safeNext.startsWith("/portal/update-password")) {
          await markPasswordResetSession();
        }
        return NextResponse.redirect(new URL(safeNext, url.origin));
      }
    }
  }

  return NextResponse.redirect(new URL("/portal/forgot?error=1", url.origin));
}