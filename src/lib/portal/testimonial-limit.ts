import { cookies } from "next/headers";
import { TESTIMONIAL_WAIT_MS } from "@/lib/portal/testimonials";

const COOKIE = "so-smooth-testimonial";

export async function testimonialRecentlySent() {
  return (await cookies()).get(COOKIE)?.value === "1";
}

export async function markTestimonialSent() {
  (await cookies()).set(COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: TESTIMONIAL_WAIT_MS / 1000,
  });
}
