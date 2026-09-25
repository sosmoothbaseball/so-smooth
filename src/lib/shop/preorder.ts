export const GLOVE_SIZES = [
  '10"',
  '11"',
  '11.25"',
  '11.5"',
  '11.75"',
  '12"',
  '12.25"',
  '12.5"',
  '12.75"',
  '13"',
] as const;

export type GloveSize = (typeof GLOVE_SIZES)[number];

export const PREORDER_PRODUCT = {
  slug: "so-smooth-glove",
  title: "So Smooth Glove",
  eyebrow: "Join the List",
  bannerLine: "Join the pre-order list. Cream or black.",
  description:
    "The So Smooth Glove in cream or black, with green lace, gold stitch, and the interlocking SS. Sign up with your size to get on the list.",
  points: [
    "Two colorways: cream and black",
    "Sized for 10U through 14U travel players",
  ],
  images: [
    {
      src: "/shop/so-smooth-glove-palm.jpg",
      alt: "Cream and black So Smooth gloves, palm view",
    },
    {
      src: "/shop/so-smooth-glove-pocket.jpg",
      alt: "Cream and black So Smooth gloves, pocket view",
    },
    {
      src: "/shop/so-smooth-glove-back.jpg",
      alt: "Cream and black So Smooth gloves, back view",
    },
  ],
} as const;

export function isGloveSize(value: string): value is GloveSize {
  return (GLOVE_SIZES as readonly string[]).includes(value);
}
