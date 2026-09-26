export const GLOVE_SIZES = ['9.5"', '11.25"', '11.5"', '11.75"'] as const;
export const GLOVE_COLORS = ["Tan", "Black"] as const;

export type GloveSize = (typeof GLOVE_SIZES)[number];
export type GloveColor = (typeof GLOVE_COLORS)[number];

/** 9.5" trainer vs standard game sizes */
export const GLOVE_TRAINER_SIZE: GloveSize = '9.5"';
export const GLOVE_PRICE_TRAINER = 200;
export const GLOVE_PRICE_STANDARD = 275;

export const PREORDER_PRODUCT = {
  slug: "so-smooth-glove",
  title: "So Smooth Glove",
  eyebrow: "Join the List",
  bannerLine: "Join the pre-order list. Tan or black.",
  body: [
    "Introducing the SS1 — built with top-of-the-line Kip Leather and made for Smooth hands.",
    "From the leather to the feel, every detail is designed to help you take your game to the next level. This is just the beginning of the So Smooth Baseball glove lineup, and we’re excited to bring you our first collection!",
  ],
  images: [
    {
      src: "/shop/so-smooth-glove-palm.jpg",
      alt: "Tan and black So Smooth gloves, palm view",
    },
    {
      src: "/shop/so-smooth-glove-pocket.jpg",
      alt: "Tan and black So Smooth gloves, pocket view",
    },
    {
      src: "/shop/so-smooth-glove-back.jpg",
      alt: "Tan and black So Smooth gloves, back view",
    },
  ],
} as const;

export function glovePriceForSize(size: GloveSize): number {
  return size === GLOVE_TRAINER_SIZE ? GLOVE_PRICE_TRAINER : GLOVE_PRICE_STANDARD;
}

export function formatGlovePrice(centsOrDollars: number): string {
  return `$${centsOrDollars}`;
}

export function isGloveSize(value: string): value is GloveSize {
  return (GLOVE_SIZES as readonly string[]).includes(value);
}

export function isGloveColor(value: string): value is GloveColor {
  return (GLOVE_COLORS as readonly string[]).includes(value);
}
