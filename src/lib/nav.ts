export type NavLink = {
  label: string;
  href: string;
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
