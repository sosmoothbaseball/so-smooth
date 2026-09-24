export type NavLink = {
  label: string;
  href: string;
  download?: string | boolean;
  external?: boolean;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Training", href: "/training" },
  { label: "Private Lessons", href: "/lessons" },
  { label: "Upcoming Events", href: "/events" },
  { label: "Calendar", href: "/calendar" },
  { label: "Team", href: "/team" },
  { label: "Staff", href: "/staff" },
  { label: "College Program", href: "/college-program" },
  { label: "Shop", href: "/shop" },
  { label: "Careers", href: "/careers" },
  { label: "Waiver", href: "/waiver" },
];

export const INSTAGRAM_ACCOUNTS = [
  {
    handle: "@sosmooth.baseball",
    href: "https://www.instagram.com/sosmooth.baseball",
  },
  {
    handle: "@sosmooth.inf",
    href: "https://www.instagram.com/sosmooth.inf",
  },
];

export const CONTACT = {
  email: "sosmoothbaseball@gmail.com",
  address: "1968 S. Coast Hwy\nPO Box #6499\nLaguna Beach, 92651",
};

/** Set NEXT_PUBLIC_SCHEDULE_URL when the scheduling API / booking app is live. */
export const SCHEDULE_URL =
  process.env.NEXT_PUBLIC_SCHEDULE_URL || "https://schedule.sosmoothbaseball.com";

/** Optional Shopify storefront URL. Shop page stays a blank mount until this is set. */
export const SHOPIFY_STOREFRONT_URL = process.env.NEXT_PUBLIC_SHOPIFY_URL || "";

export const WAIVER_HREF = "/docs/so-smooth-waiver.pdf";
export const WAIVER_FILENAME = "so-smooth-waiver.pdf";

export const PORTAL_HREF = "/portal";
