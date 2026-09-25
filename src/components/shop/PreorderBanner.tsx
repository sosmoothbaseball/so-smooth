"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import PreorderDialog from "@/components/shop/PreorderDialog";
import Button from "@/components/ui/Button";
import { PREORDER_PRODUCT } from "@/lib/shop/preorder";

export default function PreorderBanner() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-green-950 shadow-[0_30px_60px_-25px_rgba(10,42,28,0.5)]">
        <div className="grid lg:grid-cols-2">
          <div className="relative flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-yellow-300">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
              {PREORDER_PRODUCT.eyebrow}
            </span>
            <h2 className="mt-4 max-w-xl font-display text-4xl uppercase leading-[0.95] tracking-wide text-bone sm:text-6xl">
              {PREORDER_PRODUCT.title}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-bone/70 sm:text-base">
              {PREORDER_PRODUCT.bannerLine}
            </p>
            <div className="mt-7">
              <Button type="button" variant="secondary" size="lg" onClick={() => setOpen(true)}>
                Join the List
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative min-h-[16rem] bg-white sm:min-h-[20rem]"
            aria-label={`Join the list for ${PREORDER_PRODUCT.title}`}
          >
            <Image
              src={PREORDER_PRODUCT.images[0].src}
              alt={PREORDER_PRODUCT.images[0].alt}
              fill
              sizes="(max-width: 1024px) 100vw, 40rem"
              className="object-contain p-6 sm:p-8"
              priority
            />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400" />
      </div>

      {open ? <PreorderDialog onClose={() => setOpen(false)} /> : null}
    </>
  );
}
