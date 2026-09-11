"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCart } from "@/components/shop/CartProvider";
import type { ShopifyProduct } from "@/lib/shopify";

export default function ProductActions({
  product,
  buttonSize = "sm",
  buttonVariant = "onLight",
}: {
  product: ShopifyProduct;
  buttonSize?: "sm" | "md";
  buttonVariant?: "onLight" | "primary";
}) {
  const { addItem } = useCart();
  const defaultVariant =
    product.variants.find((variant) => variant.available) ?? product.variants[0];
  const [variantId, setVariantId] = useState(defaultVariant?.id ?? "");
  const selected =
    product.variants.find((variant) => variant.id === variantId) ?? defaultVariant;
  const hasChoices = product.variants.length > 1;

  return (
    <div>
      <p
        className={
          buttonSize === "md"
            ? "text-lg font-semibold text-green-700"
            : "text-sm font-semibold text-green-700"
        }
      >
        {selected?.price}
      </p>
      {hasChoices && (
        <label className="relative mt-4 block">
          <span className="sr-only">Choose a size</span>
          <select
            value={variantId}
            onChange={(event) => setVariantId(event.target.value)}
            className="w-full appearance-none rounded-full border border-ink/15 bg-white py-2 pl-3.5 pr-9 text-xs font-semibold uppercase tracking-wide text-ink outline-none focus:border-green-600"
          >
            {product.variants.map((variant) => (
              <option key={variant.id} value={variant.id} disabled={!variant.available}>
                {variant.title || "One Size"}
                {variant.available ? "" : " · Sold Out"}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/55"
          />
        </label>
      )}
      <Button
        type="button"
        size={buttonSize}
        variant={buttonVariant}
        className="mt-5 w-full"
        disabled={!selected?.available}
        onClick={() => {
          if (!selected) return;
          addItem({
            variantId: selected.id,
            title: product.title,
            variantTitle: selected.title,
            image: product.image?.url,
            price: selected.price,
          });
        }}
      >
        {selected?.available ? "Add To Cart" : "Sold Out"}
      </Button>
    </div>
  );
}
