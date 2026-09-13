"use client";

import { useState, type ReactNode } from "react";
import ActionForm from "@/components/portal/ActionForm";
import Button from "@/components/ui/Button";
import { stopOfferingLessonsAction } from "@/lib/portal/actions";

export default function OfferLessonsCard({
  offering: savedOffering,
  children,
}: {
  offering: boolean;
  children: ReactNode;
}) {
  const [offering, setOffering] = useState(savedOffering);

  if (!offering) {
    return (
      <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
        <h2 className="font-display text-3xl uppercase tracking-wide text-ink">
          Private Lessons
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">
          You are not offering private lessons right now, so families will not
          see you on the Private Lessons page. If you want to take 1-on-1
          bookings, turn this on and you can set your weekly times.
        </p>
        <div className="mt-6">
          <Button type="button" onClick={() => setOffering(true)}>
            Offer private lessons
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-3xl border border-green-600/20 bg-green-500/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">You are offering private lessons</p>
          <p className="mt-1 text-sm text-ink/55">
            {savedOffering
              ? "Families can see you on the Private Lessons page and book your open times."
              : "Set your weekly times below. Families will see you on the Private Lessons page after you save hours."}
          </p>
        </div>
        {savedOffering ? (
          <ActionForm
            action={stopOfferingLessonsAction}
            confirm={{
              title: "Stop offering lessons?",
              message:
                "You will come off the Private Lessons page and your open times will be removed. Booked lessons stay on your schedule.",
              confirmLabel: "Stop Offering",
            }}
          >
            <Button type="submit" variant="onLight" size="sm">
              Stop offering
            </Button>
          </ActionForm>
        ) : (
          <Button type="button" variant="onLight" size="sm" onClick={() => setOffering(false)}>
            Not now
          </Button>
        )}
      </div>
      {children}
    </>
  );
}
