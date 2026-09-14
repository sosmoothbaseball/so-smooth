import { cookies } from "next/headers";

const COOKIE = "so-smooth-career";
export const CAREER_WAIT_MS = 30 * 60 * 1000;

export async function careerRecentlySent() {
  return (await cookies()).get(COOKIE)?.value === "1";
}

export async function markCareerSent() {
  (await cookies()).set(COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: CAREER_WAIT_MS / 1000,
  });
}
