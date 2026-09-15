import { getSession } from "@/lib/portal/auth";
import { getFeaturedTestimonials } from "@/lib/portal/queries";
import { isStaffRole } from "@/lib/portal/roles";
import TestimonialsBoard from "@/components/home/TestimonialsBoard";

export default async function Testimonials({ openSubmit = false }: { openSubmit?: boolean }) {
  const [items, session] = await Promise.all([getFeaturedTestimonials(), getSession()]);

  const viewer = !session
    ? { kind: "guest" as const }
    : isStaffRole(session.role)
      ? { kind: "coach" as const }
      : {
          kind: "parent" as const,
          name: session.name,
          ageGroup: session.players[0]?.ageGroup || "12U",
        };

  return <TestimonialsBoard items={items} viewer={viewer} openSubmit={openSubmit} />;
}
