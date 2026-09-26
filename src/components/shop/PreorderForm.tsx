"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { submitPreOrderAction } from "@/lib/portal/actions";
import {
  formatGlovePrice,
  GLOVE_COLORS,
  GLOVE_SIZES,
  glovePriceForSize,
  PREORDER_PRODUCT,
} from "@/lib/shop/preorder";
import ActionForm from "@/components/portal/ActionForm";
import Button from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/FormField";

export default function PreorderForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-2xl border border-green-600/20 bg-green-500/5 px-5 py-6">
        <p className="font-display text-3xl uppercase tracking-wide text-ink">You&apos;re on the list</p>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">
          You&apos;re signed up for the So Smooth Glove pre-order.
        </p>
      </div>
    );
  }

  return (
    <ActionForm
      action={submitPreOrderAction}
      className="flex flex-col gap-5"
      onSuccess={() => setSent(true)}
    >
      <input type="hidden" name="productSlug" value={PREORDER_PRODUCT.slug} />
      <TextField id="preorder-name" name="name" label="Name" required autoComplete="name" />
      <TextField
        id="preorder-email"
        name="email"
        type="email"
        label="Email"
        required
        autoComplete="email"
      />
      <TextField
        id="preorder-phone"
        name="phone"
        type="tel"
        label="Phone"
        required
        autoComplete="tel"
      />
      <SelectField id="preorder-glove-size" name="gloveSize" label="Glove Size" defaultValue="" required>
        <option value="" disabled>
          Select a size
        </option>
        {GLOVE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size} — {formatGlovePrice(glovePriceForSize(size))}
          </option>
        ))}
      </SelectField>
      <SelectField id="preorder-color" name="color" label="Color" defaultValue="" required>
        <option value="" disabled>
          Select a color
        </option>
        {GLOVE_COLORS.map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </SelectField>
      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Join the List
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </ActionForm>
  );
}
