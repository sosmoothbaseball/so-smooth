"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { submitCareerAction } from "@/lib/portal/actions";
import ActionForm from "@/components/portal/ActionForm";
import Button from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/FormField";

export default function CareersForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-2xl border border-green-600/20 bg-green-500/5 px-5 py-6">
        <p className="font-display text-3xl uppercase tracking-wide text-ink">Got it</p>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">
          Your application is in the coach portal. Someone from So Smooth will reach out if it
          is a fit.
        </p>
      </div>
    );
  }

  return (
    <ActionForm
      action={submitCareerAction}
      className="flex flex-col gap-5"
      onSuccess={() => setSent(true)}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField id="name" name="name" label="Full Name" required autoComplete="name" />
        <TextField
          id="email"
          name="email"
          type="email"
          label="Email"
          required
          autoComplete="email"
        />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField id="phone" name="phone" type="tel" label="Phone" autoComplete="tel" />
        <TextField id="city" name="city" label="City" autoComplete="address-level2" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SelectField id="role" name="role" label="Interested In" defaultValue="" required>
          <option value="" disabled>
            Select a role
          </option>
          <option value="hitting">Hitting Coach</option>
          <option value="pitching">Pitching Coach</option>
          <option value="catching">Catching Coach</option>
          <option value="infield">Infield Coach</option>
          <option value="outfield">Outfield Coach</option>
          <option value="operations">Operations / Staff</option>
          <option value="other">Other</option>
        </SelectField>
        <SelectField id="availability" name="availability" label="Availability" defaultValue="">
          <option value="" disabled>
            Select availability
          </option>
          <option value="weeknights">Weeknights</option>
          <option value="weekends">Weekends</option>
          <option value="mornings">Mornings</option>
          <option value="full-time">Full-time</option>
          <option value="flexible">Flexible</option>
        </SelectField>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SelectField id="experience" name="experience" label="Years Coaching" defaultValue="">
          <option value="" disabled>
            Select experience
          </option>
          <option value="0-1">0–1 years</option>
          <option value="2-4">2–4 years</option>
          <option value="5-9">5–9 years</option>
          <option value="10+">10+ years</option>
        </SelectField>
        <TextField
          id="instagram"
          name="instagram"
          label="Instagram or Website"
          placeholder="@handle or url"
        />
      </div>
      <TextField
        id="resumeUrl"
        name="resumeUrl"
        type="url"
        label="Resume Link"
        placeholder="https://"
      />
      <TextAreaField
        id="message"
        name="message"
        label="Tell Us About You"
        placeholder="Playing background, what you want to run, when you can start…"
        required
      />

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Submit
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </ActionForm>
  );
}
