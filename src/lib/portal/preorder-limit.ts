import { cookies } from "next/headers";

const COOKIE = "so-smooth-preorder";
export const PREORDER_WAIT_MS = 30 * 60 * 1000;

export async function preorderRecentlySent() {
  return (await cookies()).get(COOKIE)?.value === "1";
}

export async function markPreorderSent() {
  (await cookies()).set(COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: PREORDER_WAIT_MS / 1000,
  });
}
