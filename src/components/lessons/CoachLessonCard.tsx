"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { LessonCoachCard, PublicSlot } from "@/lib/lessons";
import { dayKey, formatSlotDay, formatSlotTime, weekDays } from "@/lib/lessons";
import {
  bookLessonAction,
  checkLessonSlotAction,
  createParentForBookingAction,
  loginForBookingAction,
} from "@/lib/portal/actions";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { TextField } from "@/components/ui/FormField";
import BookingConfirmed from "@/components/portal/BookingConfirmed";
import PickOrAddPlayer, { type BookingPlayer } from "@/components/portal/PickOrAddPlayer";
import PasswordRules from "@/components/portal/PasswordRules";
import { passwordMeetsRules, PASSWORD_RULES_MESSAGE } from "@/lib/portal/password";
import { phoneLooksValid, PHONE_REQUIRED_MESSAGE } from "@/lib/portal/phone";
import { cn } from "@/lib/utils";

type Session = {
  id: string;
  name: string;
  role: string;
  players: BookingPlayer[];
} | null;

export default function CoachLessonCard({
  coach,
  slots,
  session,
  initialSlotId,
}: {
  coach: LessonCoachCard;
  slots: PublicSlot[];
  session: Session;
  initialSlotId?: string;
}) {
  const router = useRouter();
  const [takenIds, setTakenIds] = useState<string[]>([]);
  const liveSlots = useMemo(
    () =>
      slots.filter(
        (slot) =>
          new Date(slot.startsAt).getTime() > Date.now() && !takenIds.includes(slot.id),
      ),
    [slots, takenIds],
  );
  const todayKey = dayKey(new Date());
  const days = useMemo(() => {
    return weekDays(0).filter((date) => dayKey(date) >= todayKey);
  }, [todayKey]);
  const firstOpenKey = days
    .map(dayKey)
    .find((key) => liveSlots.some((slot) => dayKey(slot.startsAt) === key));
  const [selectedDay, setSelectedDay] = useState(firstOpenKey || dayKey(days[0]));
  const [activeSlot, setActiveSlot] = useState<PublicSlot | null>(null);
  const [mode, setMode] = useState<"login" | "create">("login");
  const [error, setError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmed, setConfirmed] = useState<{ title: string; detail: string } | null>(null);
  const [players, setPlayers] = useState<BookingPlayer[]>(session?.players ?? []);
  const [picked, setPicked] = useState<BookingPlayer | null>(session?.players[0] ?? null);
  const [bookingStep, setBookingStep] = useState<"player" | "confirm">("player");

  useEffect(() => {
    setPlayers(session?.players ?? []);
    setPicked((current) => {
      const list = session?.players ?? [];
      if (current && list.some((player) => player.id === current.id)) return current;
      return list[0] ?? null;
    });
  }, [session]);

  useEffect(() => {
    if (!initialSlotId) return;
    const match = liveSlots.find((slot) => slot.id === initialSlotId);
    if (match) {
      setSelectedDay(dayKey(match.startsAt));
      setActiveSlot(match);
    }
  }, [initialSlotId, liveSlots]);

  useEffect(() => {
    if (days.length === 0) return;
    if (days.some((date) => dayKey(date) === selectedDay)) return;
    const open = days
      .map(dayKey)
      .find((key) => liveSlots.some((slot) => dayKey(slot.startsAt) === key));
    setSelectedDay(open || dayKey(days[0]));
  }, [days, selectedDay, liveSlots]);

  const daySlots = liveSlots.filter((slot) => dayKey(slot.startsAt) === selectedDay);

  function markTaken(slotId: string) {
    setTakenIds((current) => (current.includes(slotId) ? current : [...current, slotId]));
  }

  async function openBook(slot: PublicSlot) {
    setError("");
    setMode("login");
    setBookingStep("player");
    setPicked(players[0] ?? session?.players[0] ?? null);
    setActiveSlot(slot);
    const check = new FormData();
    check.set("slotId", slot.id);
    const result = await checkLessonSlotAction(check);
    if (!result.ok) {
      setError(result.error);
      markTaken(slot.id);
    }
  }

  async function confirmBooking(formData: FormData) {
    if (!activeSlot) return;
    if (new Date(activeSlot.startsAt).getTime() <= Date.now()) {
      setError("That time already started.");
      return;
    }
    setPending(true);
    setError("");
    const slotId = String(formData.get("slotId") || activeSlot?.id || "");
    const stillOpen = await checkLessonSlotAction(formData);
    if (!stillOpen.ok) {
      setPending(false);
      setError(stillOpen.error);
      if (slotId) markTaken(slotId);
      return;
    }
    const result = await bookLessonAction(formData);
    setPending(false);
    if (!result?.ok) {
      setError(result?.error || "Could not book that time.");
      if (slotId) markTaken(slotId);
      return;
    }
    if (slotId) markTaken(slotId);
    const playerId = String(formData.get("playerId") || picked?.id || "");
    const player = players.find((entry) => entry.id === playerId) || picked;
    const when = `${formatSlotDay(activeSlot.startsAt)} · ${formatSlotTime(activeSlot.startsAt)} – ${formatSlotTime(activeSlot.endsAt)}`;
    setActiveSlot(null);
    setBookingStep("player");
    setConfirmed({
      title: coach.name,
      detail: [player?.name, player?.ageGroup, when, coach.location].filter(Boolean).join(" · "),
    });
    router.refresh();
  }

  async function signIn(formData: FormData) {
    setPending(true);
    setError("");
    const result = await loginForBookingAction(formData);
    setPending(false);
    if (result?.error) {
      setError(result.error);
      setShakeKey((key) => key + 1);
    }
  }

  async function createAccount(formData: FormData) {
    if (!phoneLooksValid(String(formData.get("phone") || ""))) {
      setError(PHONE_REQUIRED_MESSAGE);
      setShakeKey((key) => key + 1);
      return;
    }
    if (!passwordMeetsRules(String(formData.get("password") || ""))) {
      setError(PASSWORD_RULES_MESSAGE);
      setShakeKey((key) => key + 1);
      return;
    }
    setPending(true);
    setError("");
    const result = await createParentForBookingAction(formData);
    setPending(false);
    if (result?.error) {
      setError(result.error);
      setShakeKey((key) => key + 1);
    }
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_24px_50px_-28px_rgba(7,16,12,0.28)]">
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative flex min-h-64 items-end bg-green-800 p-6 sm:p-8">
          <div className="bg-grid absolute inset-0 opacity-25" />
          <div className="absolute right-6 top-6 flex h-24 w-24 items-center justify-center rounded-full bg-ink text-bone ring-2 ring-yellow-500">
            <span className="font-display text-4xl">{coach.initials}</span>
          </div>
          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-400">
              Private Lesson · 1 on 1
            </p>
            <h2 className="mt-2 font-display text-4xl uppercase tracking-wide text-bone sm:text-5xl">
              {coach.name}
            </h2>
            <p className="mt-2 text-sm text-bone/70">{coach.role}</p>
          </div>
        </div>

        <div className="flex flex-col justify-between p-6 sm:p-8">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/40">Price</dt>
              <dd className="mt-1 font-semibold text-ink">{coach.price}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/40">Location</dt>
              <dd className="mt-1 font-semibold text-ink">{coach.location}</dd>
            </div>
          </dl>
          <Link
            href={`/staff#${coach.slug}`}
            className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-green-700 hover:text-green-800"
          >
            View Full Bio
          </Link>
        </div>
      </div>

      <div className="border-t border-ink/10 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
            Open Times
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/45">This week</p>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {days.map((date) => {
            const key = dayKey(date);
            const count = liveSlots.filter((slot) => dayKey(slot.startsAt) === key).length;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDay(key)}
                className={cn(
                  "min-w-20 rounded-2xl border px-3 py-2 text-left",
                  selectedDay === key
                    ? "border-green-700 bg-green-700 text-bone"
                    : "border-ink/10 bg-bone text-ink",
                )}
              >
                <span className="block text-[10px] uppercase tracking-wide opacity-70">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="block text-sm font-semibold">{date.getDate()}</span>
                <span className="block text-[10px] opacity-70">{count} open</span>
              </button>
            );
          })}
        </div>

        <ul className="mt-5 flex flex-col gap-2">
          {daySlots.length === 0 && (
            <li className="rounded-2xl border border-dashed border-ink/10 px-4 py-5 text-sm text-ink/45">
              No open times this day.
            </li>
          )}
          {daySlots.map((slot) => (
            <li
              key={slot.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-ink/10 px-4 py-3"
            >
              <p className="text-sm font-semibold text-ink">
                {formatSlotTime(slot.startsAt)} – {formatSlotTime(slot.endsAt)}
              </p>
              <Button type="button" size="sm" onClick={() => openBook(slot)}>
                Book
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {activeSlot && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 p-4 sm:items-center">
          <div className="w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-[0_24px_50px_-28px_rgba(7,16,12,0.55)] max-h-[90svh]">
            <div className="flex items-start justify-between border-b border-ink/10 px-6 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">
                  Complete Booking
                </p>
                <h3 className="mt-2 font-display text-3xl uppercase tracking-wide text-ink">
                  {coach.name}
                </h3>
                <p className="mt-1 text-sm text-ink/55">
                  {formatSlotDay(activeSlot.startsAt)} · {formatSlotTime(activeSlot.startsAt)} –{" "}
                  {formatSlotTime(activeSlot.endsAt)}
                </p>
                <p className="mt-1 text-sm text-ink/55">
                  {coach.price} · {coach.location}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setActiveSlot(null)}
                className="text-ink/40 hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-6">
              {session?.role === "parent" ? (
                bookingStep === "player" ? (
                  <div className="flex flex-col gap-4">
                    <PickOrAddPlayer
                      key={activeSlot.id}
                      idPrefix={coach.slug}
                      players={players}
                      selected={picked}
                      onSelect={setPicked}
                      onPlayersChange={setPlayers}
                      onCreated={(player) => {
                        setPicked(player);
                        setBookingStep("confirm");
                      }}
                    />
                    {error && <p className="text-sm text-red-700">{error}</p>}
                    {players.length > 0 ? (
                      <Button type="button" disabled={!picked} onClick={() => setBookingStep("confirm")}>
                        Continue
                      </Button>
                    ) : null}
                  </div>
                ) : picked ? (
                  <form
                    onSubmit={async (event) => {
                      event.preventDefault();
                      await confirmBooking(new FormData(event.currentTarget));
                    }}
                    className="flex flex-col gap-4"
                  >
                    <input type="hidden" name="slotId" value={activeSlot.id} />
                    <input type="hidden" name="playerId" value={picked.id} />
                    <div className="rounded-2xl border border-ink/10 bg-bone p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">
                        Confirm player
                      </p>
                      <p className="mt-2 font-display text-3xl uppercase tracking-wide text-ink">
                        {picked.name}
                      </p>
                      <p className="mt-1 text-sm text-ink/55">{picked.ageGroup}</p>
                      <div className="mt-4 border-t border-ink/10 pt-4 text-sm text-ink/65">
                        <p>
                          {formatSlotDay(activeSlot.startsAt)} · {formatSlotTime(activeSlot.startsAt)} –{" "}
                          {formatSlotTime(activeSlot.endsAt)}
                        </p>
                        <p className="mt-1">
                          {coach.name} · {coach.price} · {coach.location}
                        </p>
                      </div>
                    </div>
                    {error && <p className="text-sm text-red-700">{error}</p>}
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button type="submit" disabled={pending}>
                        {pending ? "Booking…" : "Confirm Booking"}
                      </Button>
                      <Button
                        type="button"
                        variant="onLight"
                        disabled={pending}
                        onClick={() => setBookingStep("player")}
                      >
                        Change Player
                      </Button>
                    </div>
                  </form>
                ) : null
              ) : session?.role === "coach" ? (
                <p className="text-sm text-ink/60">
                  You are signed in as a coach. Use a parent account to book a player.
                </p>
              ) : (
                <div>
                  <div className="mb-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className={cn(
                        "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide",
                        mode === "login" ? "bg-green-700 text-bone" : "bg-bone text-ink/60",
                      )}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("create");
                        setError("");
                        setNewPassword("");
                      }}
                      className={cn(
                        "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide",
                        mode === "create" ? "bg-green-700 text-bone" : "bg-bone text-ink/60",
                      )}
                    >
                      Create Account
                    </button>
                  </div>
                  {mode === "login" ? (
                    <form
                      onSubmit={async (event) => {
                        event.preventDefault();
                        await signIn(new FormData(event.currentTarget));
                      }}
                      className="flex flex-col gap-4"
                    >
                      <input type="hidden" name="slotId" value={activeSlot.id} />
                      <TextField id={`${coach.slug}-email`} name="email" type="email" label="Email" required />
                      <TextField
                        id={`${coach.slug}-password`}
                        name="password"
                        type="password"
                        label="Password"
                        required
                        invalid={Boolean(error)}
                      />
                      {error && (
                        <motion.p
                          key={shakeKey}
                          initial={{ x: 0 }}
                          animate={{ x: [0, -10, 10, -7, 7, -3, 3, 0] }}
                          transition={{ duration: 0.45 }}
                          className="text-sm font-medium text-red-700"
                        >
                          {error}
                        </motion.p>
                      )}
                      <Button type="submit" pending={pending}>
                        {pending ? (
                          <>
                            <Spinner className="h-4 w-4" /> Signing In
                          </>
                        ) : (
                          "Sign In And Continue"
                        )}
                      </Button>
                    </form>
                  ) : (
                    <form
                      onSubmit={async (event) => {
                        event.preventDefault();
                        await createAccount(new FormData(event.currentTarget));
                      }}
                      className="flex flex-col gap-4"
                    >
                      <input type="hidden" name="slotId" value={activeSlot.id} />
                      <TextField id={`${coach.slug}-name`} name="name" label="Your Name" required />
                      <TextField
                        id={`${coach.slug}-phone`}
                        name="phone"
                        type="tel"
                        label="Phone"
                        required
                      />
                      <TextField id={`${coach.slug}-new-email`} name="email" type="email" label="Email" required />
                      <div>
                        <TextField
                          id={`${coach.slug}-new-password`}
                          name="password"
                          type="password"
                          label="Create Password"
                          required
                          invalid={Boolean(error)}
                          value={newPassword}
                          onChange={(event) => setNewPassword(event.target.value)}
                        />
                        <div className="mt-3">
                          <PasswordRules value={newPassword} />
                        </div>
                      </div>
                      <TextField id={`${coach.slug}-player`} name="playerName" label="Player Name" required />
                      <TextField
                        id={`${coach.slug}-age`}
                        name="ageGroup"
                        label="Age Group"
                        defaultValue="12U"
                      />
                      {error && (
                        <motion.p
                          key={shakeKey}
                          initial={{ x: 0 }}
                          animate={{ x: [0, -10, 10, -7, 7, -3, 3, 0] }}
                          transition={{ duration: 0.45 }}
                          className="text-sm font-medium text-red-700"
                        >
                          {error}
                        </motion.p>
                      )}
                      <Button type="submit" pending={pending}>
                        {pending ? (
                          <>
                            <Spinner className="h-4 w-4" /> Creating
                          </>
                        ) : (
                          "Create Account And Continue"
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <BookingConfirmed
        open={Boolean(confirmed)}
        kind="lesson"
        title={confirmed?.title || coach.name}
        detail={confirmed?.detail}
        onClose={() => setConfirmed(null)}
      />
    </article>
  );
}
