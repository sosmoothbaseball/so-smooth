"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingBag, X } from "lucide-react";
import CartDropdown from "@/components/shop/CartDropdown";
import ProductActions from "@/components/shop/ProductActions";
import type { ShopifyProduct } from "@/lib/shopify";
import { cn } from "@/lib/utils";

export default function ProductViewer({
  product,
  onClose,
}: {
  product: ShopifyProduct;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const images = product.images.length ? product.images : product.image ? [product.image] : [];
  const current = images[imageIndex] ?? images[0];
  const hasPhotos = images.length > 1;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setImageIndex(0);
  }, [product.id]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (!hasPhotos) return;
      if (event.key === "ArrowLeft") {
        setImageIndex((value) => (value - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowRight") {
        setImageIndex((value) => (value + 1) % images.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasPhotos, images.length, onClose]);

  if (!mounted) return null;

  const goPhoto = (direction: -1 | 1) => {
    setImageIndex((value) => (value + direction + images.length) % images.length);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={product.title}
      className="fixed inset-0 z-[80] flex flex-col bg-ink"
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
        <p className="font-display text-2xl uppercase tracking-wide text-bone">The Shop</p>
        <div className="flex items-center gap-2">
          <CartDropdown compact />
          <button
            type="button"
            aria-label="Close product"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone/80 transition-colors hover:border-green-400 hover:text-green-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative grid min-h-0 flex-1 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative flex min-h-[46vh] flex-col bg-green-950 lg:min-h-0">
          <div className="relative flex-1">
            {current ? (
              <Image
                src={current.url}
                alt={current.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-contain p-6 sm:p-10"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-yellow-400" />
              </div>
            )}
          </div>

          {hasPhotos && (
            <>
              <div className="relative flex justify-center gap-2 px-4 pb-5">
                {images.map((image, i) => (
                  <button
                    key={image.url}
                    type="button"
                    aria-label={`View photo ${i + 1}`}
                    onClick={() => setImageIndex(i)}
                    className={cn(
                      "relative h-14 w-14 overflow-hidden rounded-xl border transition-colors",
                      i === imageIndex ? "border-yellow-400" : "border-white/15 hover:border-white/40",
                    )}
                  >
                    <Image src={image.url} alt="" fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => goPhoto(-1)}
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink/50 text-bone backdrop-blur-sm transition-colors hover:border-green-400 hover:text-green-300"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => goPhoto(1)}
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink/50 text-bone backdrop-blur-sm transition-colors hover:border-green-400 hover:text-green-300"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        <div className="relative overflow-y-auto bg-bone px-6 py-8 sm:px-10 sm:py-12">
          <span className="inline-flex rounded-full bg-green-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-bone">
            {product.category}
          </span>
          <h2 className="mt-5 font-display text-5xl uppercase leading-none tracking-wide text-ink sm:text-6xl">
            {product.title}
          </h2>
          <div className="mt-6 max-w-sm">
            <ProductActions key={product.id} product={product} buttonSize="md" buttonVariant="primary" />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
