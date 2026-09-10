export type NavLink = {
  label: string;
  href: string;
  download?: string | boolean;
  external?: boolean;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Training", href: "/training" },
  { label: "Team", href: "/team" },
  { label: "Staff", href: "/staff" },
  { label: "Shop", href: "/shop" },
  { label: "Careers", href: "/careers" },
  { label: "Waiver", href: "/waiver" },
];

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
];

export const CONTACT = {
  phone: "(555) 010-1234",
  phoneHref: "tel:+15550101234",
  email: "info@sosmoothbaseball.com",
  address: "123 Diamond Way, Baseball City, CA",
};

/** Set NEXT_PUBLIC_SCHEDULE_URL when the scheduling API / booking app is live. */
export const SCHEDULE_URL =
  process.env.NEXT_PUBLIC_SCHEDULE_URL || "https://schedule.sosmoothbaseball.com";

/** Optional Shopify storefront URL. Shop page stays a blank mount until this is set. */
export const SHOPIFY_STOREFRONT_URL = process.env.NEXT_PUBLIC_SHOPIFY_URL || "";

export const WAIVER_HREF = "/docs/so-smooth-waiver.pdf";
export const WAIVER_FILENAME = "so-smooth-waiver.pdf";

export const PORTAL_HREF = "/portal";
