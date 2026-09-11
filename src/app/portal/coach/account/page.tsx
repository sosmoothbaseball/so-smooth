import { redirect } from "next/navigation";

export default function CoachAccountRedirect() {
  redirect("/portal/coach/profile");
}
