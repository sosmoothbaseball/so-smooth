"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import PreorderForm from "@/components/shop/PreorderForm";
import { GLOVE_SIZES, PREORDER_PRODUCT } from "@/lib/shop/preorder";
import { cn } from "@/lib/utils";

export default function PreorderDialog({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const images = PREORDER_PRODUCT.images;
  const current = images[imageIndex] ?? images[0];
  const hasPhotos = images.length > 1;

  useEffect(() => setMounted(true), []);

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
      aria-label={PREORDER_PRODUCT.title}
      className="fixed inset-0 z-[80] flex flex-col bg-bone"
    >
      <div className="relative flex shrink-0 items-center justify-between gap-4 border-b border-ink/10 bg-ink px-4 py-3 sm:px-6">
        <p className="font-display text-2xl uppercase tracking-wide text-bone">Pre-Order List</p>
        <button
          type="button"
          aria-label="Close pre-order"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone/80 transition-colors hover:border-green-400 hover:text-green-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-8 sm:px-10 sm:py-12">
          <span className="inline-flex rounded-full bg-yellow-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink">
            {PREORDER_PRODUCT.eyebrow}
          </span>
          <h2 className="mt-5 font-display text-5xl uppercase leading-none tracking-wide text-ink sm:text-6xl">
            {PREORDER_PRODUCT.title}
          </h2>

          <div className="relative mt-8 overflow-hidden rounded-3xl bg-white">
            <div className="relative aspect-[4/3]">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                priority
                sizes="(max-width: 672px) 100vw, 42rem"
                className="object-contain p-6 sm:p-8"
              />
            </div>

            {hasPhotos && (
              <>
                <div className="relative flex justify-center gap-2 px-4 pb-5">
                  {images.map((image, i) => (
                    <button
                      key={image.src}
                      type="button"
                      aria-label={`View photo ${i + 1}`}
                      onClick={() => setImageIndex(i)}
                      className={cn(
                        "relative h-14 w-14 overflow-hidden rounded-xl border transition-colors",
                        i === imageIndex ? "border-yellow-400" : "border-ink/15 hover:border-ink/40",
                      )}
                    >
                      <Image src={image.src} alt="" fill sizes="56px" className="object-contain bg-white" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() => goPhoto(-1)}
                  className="absolute left-3 top-[28%] flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white/90 text-ink shadow-sm transition-colors hover:border-green-600 hover:text-green-700"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() => goPhoto(1)}
                  className="absolute right-3 top-[28%] flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white/90 text-ink shadow-sm transition-colors hover:border-green-600 hover:text-green-700"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          <div className="mt-8 flex max-w-xl flex-col gap-4 text-sm leading-relaxed text-ink/65">
            {PREORDER_PRODUCT.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                Sizes Available
              </p>
              <p className="mt-2 text-ink/70">{GLOVE_SIZES.join("  ·  ")}</p>
            </div>
          </div>
          <div className="mt-8 max-w-md">
            <PreorderForm />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
