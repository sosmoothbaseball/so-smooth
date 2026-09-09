"use client";

import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NewsletterForm() {
  return (
    <form
      className="flex w-full max-w-md items-center gap-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-bone placeholder:text-bone/40 outline-none focus:border-green-400 transition-colors"
      />
      <Button type="submit" variant="primary" size="sm" className="shrink-0">
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
