"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/FormField";

export default function PortalLogin() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <TextField
        id="portal-email"
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        required
      />
      <TextField
        id="portal-password"
        name="password"
        type="password"
        label="Password"
        autoComplete="current-password"
        required
      />
      <label className="flex items-center gap-2 text-sm text-ink/60">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-ink/20 text-green-600 focus:ring-green-500"
        />
        Keep me signed in
      </label>
      <Button type="submit" size="lg" className="w-full">
        {sent ? "Portal Coming Next" : "Sign In"}
        <ArrowRight className="h-4 w-4" />
      </Button>
      {sent && (
        <p className="text-sm text-green-700">
          Layout is ready. We will connect parent and player accounts here.
        </p>
      )}
      <p className="text-center text-xs text-ink/40">
        Forgot password will live here once accounts are on.
      </p>
    </form>
  );
}
