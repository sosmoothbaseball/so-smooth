"use server";

import { redirect } from "next/navigation";
import { createShopifyCheckout } from "@/lib/shopify";

type CheckoutLine = {
  variantId: string;
  quantity: number;
};

export async function startCheckout(formData: FormData) {
  const raw = String(formData.get("lines") || "[]");
  let lines: CheckoutLine[] = [];
  try {
    lines = JSON.parse(raw) as CheckoutLine[];
  } catch {
    throw new Error("Could not read the cart.");
  }

  const checkoutUrl = await createShopifyCheckout(
    lines.map((line) => ({
      variantId: String(line.variantId || ""),
      quantity: Number(line.quantity) || 0,
    })),
  );

  redirect(checkoutUrl);
}
