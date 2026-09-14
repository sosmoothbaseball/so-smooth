"use client";

import type { ReactNode } from "react";
import ActionForm from "@/components/portal/ActionForm";
import Button from "@/components/ui/Button";
import { setOffersLessonsAction } from "@/lib/portal/actions";

export default function OfferLessonsCard({
  offering,
  children,
}: {
  offering: boolean;
  children: ReactNode;
}) {
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
        <ActionForm action={setOffersLessonsAction} className="mt-6">
          <input type="hidden" name="offersLessons" value="on" />
          <Button type="submit">Offer private lessons</Button>
        </ActionForm>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-3xl border border-green-600/20 bg-green-500/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">You are offering private lessons</p>
          <p className="mt-1 text-sm text-ink/55">
            Families can see you on the Private Lessons page even if you have no
            open times yet. Set weekly hours below when you want bookings.
          </p>
        </div>
        <ActionForm
          action={setOffersLessonsAction}
          confirm={{
            title: "Stop offering lessons?",
            message:
              "You will come off the Private Lessons page and open times will be removed. Your saved hours stay so you can turn this back on.",
            confirmLabel: "Stop Offering",
          }}
        >
          <input type="hidden" name="offersLessons" value="off" />
          <Button type="submit" variant="onLight" size="sm">
            Stop offering
          </Button>
        </ActionForm>
      </div>
      {children}
    </>
  );
}
