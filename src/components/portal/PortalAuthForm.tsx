"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { loginAction, signupAction } from "@/lib/portal/actions";
import { passwordMeetsRules, PASSWORD_RULES_MESSAGE } from "@/lib/portal/password";
import { phoneLooksValid, PHONE_REQUIRED_MESSAGE } from "@/lib/portal/phone";
import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/FormField";
import Spinner from "@/components/ui/Spinner";
import PasswordRules from "@/components/portal/PasswordRules";

const shake = { x: [0, -10, 10, -7, 7, -3, 3, 0] };

export default function PortalAuthForm({ initialError = "" }: { initialError?: string }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError);
  const [pending, setPending] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  function showError(message: string) {
    setError(message);
    setShakeKey((key) => key + 1);
  }

  function switchMode(next: "login" | "signup") {
    setMode(next);
    setError("");
    setPassword("");
  }

  async function onSubmit(formData: FormData) {
    if (pending) return;
    setError("");

    if (mode === "signup" && !phoneLooksValid(String(formData.get("phone") || ""))) {
      showError(PHONE_REQUIRED_MESSAGE);
      return;
    }
    if (mode === "signup" && !passwordMeetsRules(String(formData.get("password") || ""))) {
      showError(PASSWORD_RULES_MESSAGE);
      return;
    }

    setPending(true);
    try {
      const result = mode === "login" ? await loginAction(formData) : await signupAction(formData);
      if (result?.ok === false) showError(result.error);
    } catch (error) {
      if (typeof error === "object" && error && "digest" in error) throw error;
      showError(mode === "login" ? "Incorrect password" : "Could not create the account. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-700">
        {mode === "login" ? "Sign In" : "Create Account"}
      </p>
      <h2 className="mt-3 font-display text-4xl uppercase tracking-wide text-ink">
        {mode === "login" ? "Welcome Back" : "Join The Portal"}
      </h2>
      <p className="mt-3 mb-8 text-sm text-ink/60">
        {mode === "login"
          ? "Parents book here. Coaches run slots, camps, and the calendar."
          : "New family accounts land in the parent portal after you sign up."}
      </p>

      <form
        className="flex flex-col gap-5"
        onSubmit={async (event) => {
          event.preventDefault();
          await onSubmit(new FormData(event.currentTarget));
        }}
      >
        {mode === "signup" && (
          <>
            <TextField
              id="portal-name"
              name="name"
              label="Full Name"
              autoComplete="name"
              required
            />
            <TextField
              id="portal-phone"
              name="phone"
              type="tel"
              label="Phone"
              autoComplete="tel"
              required
            />
          </>
        )}
        <TextField
          id="portal-email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          required
        />
        <div>
          <TextField
            id="portal-password"
            name="password"
            type="password"
            label={mode === "signup" ? "Create Password" : "Password"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            invalid={Boolean(error)}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {mode === "signup" && (
            <div className="mt-3">
              <PasswordRules value={password} />
            </div>
          )}
        </div>

        {error && (
          <motion.p
            key={shakeKey}
            initial={{ x: 0 }}
            animate={shake}
            transition={{ duration: 0.45 }}
            className="text-sm font-medium text-red-700"
          >
            {error}
          </motion.p>
        )}

        <Button type="submit" size="lg" className="w-full" pending={pending}>
          {pending ? (
            <>
              <Spinner className="h-5 w-5" />
              {mode === "login" ? "Signing In" : "Creating Account"}
            </>
          ) : mode === "login" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        {mode === "login" ? (
          <>
            No account yet?{" "}
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className="font-semibold text-green-700 hover:text-green-800"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="font-semibold text-green-700 hover:text-green-800"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  );
}
