"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Expand, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { item as staggerItem } from "@/components/ui/Stagger";
import ProductActions from "@/components/shop/ProductActions";
import ProductViewer from "@/components/shop/ProductViewer";
import type { ShopifyProduct } from "@/lib/shopify";
import { cn } from "@/lib/utils";

function ProductCard({
  product,
  onOpen,
}: {
  product: ShopifyProduct;
  onOpen: () => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white">
      <button
        type="button"
        onClick={onOpen}
        className="relative flex aspect-square items-center justify-center bg-green-800"
      >
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
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-bone backdrop-blur-sm">
          <Expand className="h-3.5 w-3.5" />
        </span>
        <span className="absolute inset-x-3 bottom-3 rounded-full bg-ink/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-bone opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          View Full Screen
        </span>
      </button>
      <div className="flex flex-1 flex-col p-5">
        <button type="button" onClick={onOpen} className="text-left">
          <h3 className="font-display text-2xl uppercase tracking-wide text-ink transition-colors hover:text-green-700">
            {product.title}
          </h3>
        </button>
        <div className="mt-2">
          <ProductActions product={product} />
        </div>
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
  const [openedId, setOpenedId] = useState<string | null>(null);
  const visible =
    active === "All" ? products : products.filter((product) => product.category === active);
  const opened = visible.find((product) => product.id === openedId) ?? null;

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

      {visible.length === 0 ? (
        <p className="mt-10 text-sm text-ink/55">No gear in this category yet.</p>
      ) : (
        <motion.div
          key={active}
          className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.04 },
            },
          }}
        >
          {visible.map((product) => (
            <motion.div key={product.id} variants={staggerItem}>
              <ProductCard product={product} onOpen={() => setOpenedId(product.id)} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {opened && <ProductViewer product={opened} onClose={() => setOpenedId(null)} />}
    </>
  );
}
