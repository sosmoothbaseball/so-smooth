"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ShoppingBag, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { startCheckout } from "@/app/shop/actions";
import { useCart } from "@/components/shop/CartProvider";
import { cn } from "@/lib/utils";

export default function CartDropdown({ compact = false }: { compact?: boolean }) {
  const { items, count, setQuantity, removeItem } = useCart();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Open cart"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "relative flex items-center justify-center rounded-full border border-white/15 text-bone/80 transition-colors hover:border-green-400 hover:bg-green-400/10 hover:text-green-300",
          compact ? "h-10 w-10" : "h-8 w-8",
        )}
      >
        <ShoppingBag className={compact ? "h-5 w-5" : "h-4 w-4"} />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-500 px-1 text-[10px] font-bold text-ink">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-ink shadow-[0_24px_50px_-28px_rgba(7,16,12,0.65)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="font-display text-xl uppercase tracking-wide text-bone">Cart</p>
            <button
              type="button"
              aria-label="Close cart"
              onClick={() => setOpen(false)}
              className="text-bone/50 transition-colors hover:text-bone"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-8 text-sm text-bone/55">No gear in the bag yet.</p>
          ) : (
            <>
              <ul className="max-h-80 overflow-y-auto px-4 py-3">
                {items.map((item) => (
                  <li
                    key={item.variantId}
                    className="flex gap-3 border-b border-white/5 py-3 last:border-b-0"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-green-800">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-bone">{item.title}</p>
                      {item.variantTitle && (
                        <p className="truncate text-xs text-bone/45">{item.variantTitle}</p>
                      )}
                      <p className="mt-1 text-xs font-semibold text-green-300">{item.price}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-bone/70"
                          onClick={() => setQuantity(item.variantId, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-xs text-bone">{item.quantity}</span>
                        <button
                          type="button"
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-bone/70"
                          onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="ml-auto text-[10px] uppercase tracking-wide text-bone/40 hover:text-bone"
                          onClick={() => removeItem(item.variantId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <form action={startCheckout} className="border-t border-white/10 p-4">
                <input
                  type="hidden"
                  name="lines"
                  value={JSON.stringify(
                    items.map((item) => ({
                      variantId: item.variantId,
                      quantity: item.quantity,
                    })),
                  )}
                />
                <Button type="submit" size="sm" className="w-full">
                  Checkout On Shopify
                </Button>
                <p className="mt-2 text-center text-[11px] leading-relaxed text-bone/40">
                  Payment, shipping, and taxes finish on Shopify.
                </p>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
