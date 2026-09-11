"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import { useCart } from "@/components/shop/CartProvider";
import type { ShopifyProduct } from "@/lib/shopify";
import { cn } from "@/lib/utils";

function ProductCard({ product }: { product: ShopifyProduct }) {
  const { addItem } = useCart();
  const defaultVariant =
    product.variants.find((variant) => variant.available) ?? product.variants[0];
  const [variantId, setVariantId] = useState(defaultVariant?.id ?? "");
  const selected =
    product.variants.find((variant) => variant.id === variantId) ?? defaultVariant;
  const hasChoices = product.variants.length > 1;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white">
      <div className="relative flex aspect-square items-center justify-center bg-green-800">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.alt}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div className="bg-grid absolute inset-0 opacity-25" />
            <ShoppingBag className="relative h-10 w-10 text-yellow-400" />
          </>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-bone px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl uppercase tracking-wide text-ink">
          {product.title}
        </h3>
        <p className="mt-2 text-sm font-semibold text-green-700">{selected?.price}</p>
        {hasChoices && (
          <label className="mt-4 block">
            <span className="sr-only">Choose a size</span>
            <select
              value={variantId}
              onChange={(event) => setVariantId(event.target.value)}
              className="w-full rounded-full border border-ink/15 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink outline-none focus:border-green-600"
            >
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id} disabled={!variant.available}>
                  {variant.title || "One Size"}
                  {variant.available ? "" : " · Sold Out"}
                </option>
              ))}
            </select>
          </label>
        )}
        <Button
          type="button"
          size="sm"
          variant="onLight"
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
    </article>
  );
}

export default function ProductGrid({ products }: { products: ShopifyProduct[] }) {
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((product) => product.category)));
    return ["All", ...unique];
  }, [products]);
  const [active, setActive] = useState("All");
  const visible =
    active === "All" ? products : products.filter((product) => product.category === active);

  return (
    <>
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
                active === category
                  ? "bg-green-600 text-bone"
                  : "border border-ink/15 bg-white text-ink/60 hover:border-green-600 hover:text-green-700",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <StaggerGroup className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {visible.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </>
  );
}
