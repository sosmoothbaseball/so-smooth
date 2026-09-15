import { AGE_GROUPS } from "@/lib/portal/age-groups";

export const TESTIMONIAL_QUOTE_MIN = 20;
export const TESTIMONIAL_QUOTE_MAX = 1200;
export const TESTIMONIAL_NAME_MAX = 80;
export const TESTIMONIAL_FEATURED_SLOTS = [1, 2, 3] as const;
export const TESTIMONIAL_FEATURED_MAX = TESTIMONIAL_FEATURED_SLOTS.length;
export const TESTIMONIAL_RETURN_TO = "/?testimonial=1";
export const TESTIMONIAL_WAIT_MS = 30 * 60 * 1000;

export type FeaturedSlot = (typeof TESTIMONIAL_FEATURED_SLOTS)[number];

export function testimonialRoleLabel(ageGroup: string) {
  return `Parent, ${ageGroup} Player`;
}

export function parseAgeGroup(value: string) {
  if ((AGE_GROUPS as readonly string[]).includes(value)) return value;
  return /^\d+U$/.test(value) ? value : null;
}

export function nextOpenSlot(used: Array<number | null | undefined>): FeaturedSlot | null {
  const taken = new Set(
    used.filter((slot): slot is FeaturedSlot => slot === 1 || slot === 2 || slot === 3),
  );
  return TESTIMONIAL_FEATURED_SLOTS.find((slot) => !taken.has(slot)) ?? null;
}
