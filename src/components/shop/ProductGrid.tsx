"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import { useCart } from "@/components/shop/CartProvider";
import type { ShopifyProduct } from "@/lib/shopify";
import { cn } from "@/lib/utils";

export default function ProductGrid({ products }: { products: ShopifyProduct[] }) {
  const { addItem } = useCart();
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
                {product.variantTitle && (
                  <p className="mt-1 text-xs uppercase tracking-wide text-ink/40">
                    {product.variantTitle}
                  </p>
                )}
                <p className="mt-2 text-sm font-semibold text-green-700">{product.price}</p>
                <Button
                  type="button"
                  size="sm"
                  variant="onLight"
                  className="mt-5 w-full"
                  disabled={!product.available}
                  onClick={() =>
                    addItem({
                      variantId: product.variantId,
                      title: product.title,
                      variantTitle: product.variantTitle,
                      image: product.image?.url,
                      price: product.price,
                    })
                  }
                >
                  {product.available ? "Add To Cart" : "Sold Out"}
                </Button>
              </div>
            </article>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </>
  );
}
