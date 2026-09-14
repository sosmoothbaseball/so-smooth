import { cookies } from "next/headers";

const COOKIE = "so-smooth-pw-reset";

export async function markPasswordResetSession() {
  (await cookies()).set(COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });
}

export async function hasPasswordResetSession() {
  return (await cookies()).get(COOKIE)?.value === "1";
}

export async function clearPasswordResetSession() {
  (await cookies()).delete(COOKIE);
}