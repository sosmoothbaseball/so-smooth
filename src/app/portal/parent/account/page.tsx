import { redirect } from "next/navigation";

export default function ParentAccountRedirect() {
  redirect("/portal/parent/profile");
}
