"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkEventSpotAction, type ActionResult } from "@/lib/portal/actions";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import BookingConfirmed from "@/components/portal/BookingConfirmed";
import ConfirmDialog from "@/components/portal/ConfirmDialog";

export type BookableSession = {
  id: string;
  name: string;
  role: string;
  players: { id: string; name: string; ageGroup: string }[];
} | null;

export default function BookButton({
  user,
  action,
  hiddenFields,
  confirmTitle,
  confirmDetail,
}: {
  user: BookableSession;
  action: (formData: FormData) => Promise<ActionResult | void>;
  hiddenFields: Record<string, string>;
  confirmTitle: string;
  confirmDetail?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [queued, setQueued] = useState<FormData | null>(null);
  const [confirmed, setConfirmed] = useState<{ title: string; detail?: string } | null>(null);

  async function book(payload: FormData) {
    setPending(true);
    setError("");
    const stillOpen = await checkEventSpotAction(payload);
    if (!stillOpen.ok) {
      setPending(false);
      setConfirmOpen(false);
      setQueued(null);
      setError(stillOpen.error);
      return;
    }
    const result = await action(payload);
    setPending(false);
    setConfirmOpen(false);
    setQueued(null);
    if (result && result.ok === false) {
      setError(result.error);
      return;
    }
    const playerId = String(payload.get("playerId") || "");
    const player = user?.players.find((entry) => entry.id === playerId);
    setConfirmed({
      title: confirmTitle,
      detail: [player?.name, confirmDetail].filter(Boolean).join(" · ") || undefined,
    });
  }

  if (!user) {
    return (
      <Button href="/portal" size="sm">
        Sign In To Book
      </Button>
    );
  }

  if (user.role !== "parent") {
    return <p className="text-xs uppercase tracking-wide text-ink/40">Coach view</p>;
  }

  if (user.players.length === 0) {
    return <p className="text-xs text-ink/45">Add a player in the portal first.</p>;
  }

  return (
    <>
      <form
        className="flex flex-col items-start gap-2 sm:flex-row sm:items-center"
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          setQueued(new FormData(event.currentTarget));
          setConfirmOpen(true);
        }}
      >
        {Object.entries(hiddenFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <select
          name="playerId"
          defaultValue={user.players[0].id}
          className="rounded-full border border-ink/15 bg-white px-3 py-2 text-xs text-ink"
        >
          {user.players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
        <Button type="submit" size="sm" pending={pending}>
          {pending ? (
            <>
              <Spinner className="h-3.5 w-3.5" /> Booking
            </>
          ) : (
            "Book"
          )}
        </Button>
        {error ? <p className="text-xs text-red-700">{error}</p> : null}
      </form>
      <ConfirmDialog
        open={confirmOpen}
        title="Book this event?"
        message={
          confirmDetail
            ? `Are you sure you want to book ${confirmTitle}? ${confirmDetail}`
            : `Are you sure you want to book ${confirmTitle}?`
        }
        confirmLabel="Book Spot"
        pending={pending}
        onCancel={() => {
          if (pending) return;
          setConfirmOpen(false);
          setQueued(null);
        }}
        onConfirm={() => {
          if (queued) void book(queued);
        }}
      />
      <BookingConfirmed
        open={Boolean(confirmed)}
        kind="event"
        title={confirmed?.title || confirmTitle}
        detail={confirmed?.detail}
        onClose={() => {
          setConfirmed(null);
          router.refresh();
        }}
      />
    </>
  );
}

export function PortalHint() {
  return (
    <p className="text-sm text-ink/50">
      Already booked?{" "}
      <Link href="/portal" className="font-semibold text-green-700 hover:text-green-800">
        Open the portal
      </Link>{" "}
      to cancel.
    </p>
  );
}
