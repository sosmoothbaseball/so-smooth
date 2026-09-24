"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { submitCollegeProgramAction } from "@/lib/portal/actions";
import { setResumeAuth, takeResumeAuthIf } from "@/lib/portal/resume-auth";
import ActionForm from "@/components/portal/ActionForm";
import AuthDialog from "@/components/portal/AuthDialog";
import Button from "@/components/ui/Button";
import CollegeProgramFields from "@/components/college/CollegeProgramFields";

type Viewer =
  | { kind: "guest" }
  | { kind: "coach" }
  | { kind: "parent"; name: string; players: { id: string; name: string }[] };

export default function CollegeProgramForm({
  viewer,
  openSubmit = false,
}: {
  viewer: Viewer;
  openSubmit?: boolean;
}) {
  const router = useRouter();
  const titleId = useId();
  const [packetOpen, setPacketOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (viewer.kind !== "parent") return;
    if (takeResumeAuthIf("college-program")) setPacketOpen(true);
  }, [viewer.kind]);

  useEffect(() => {
    if (!openSubmit) return;
    if (viewer.kind === "parent") setPacketOpen(true);
    else if (viewer.kind === "guest") setAuthOpen(true);
  }, [openSubmit, viewer.kind]);

  useEffect(() => {
    if (!packetOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closePacket();
    }
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [packetOpen]);

  function closePacket() {
    setPacketOpen(false);
    setSent(false);
    if (openSubmit) router.replace("/college-program", { scroll: false });
  }

  function startPacket() {
    if (viewer.kind === "parent") {
      setSent(false);
      setPacketOpen(true);
      return;
    }
    setAuthOpen(true);
  }

  if (viewer.kind === "coach") {
    return (
      <div className="mt-10 flex justify-center">
        <Button href="/portal/coach/college-program" size="lg">
          Open College Packets
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 flex justify-center">
        <Button type="button" size="lg" onClick={startPacket}>
          Build A Packet
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          setResumeAuth({ kind: "college-program" });
          setAuthOpen(false);
          router.refresh();
        }}
      />

      {packetOpen && viewer.kind === "parent" ? (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/60 p-4 sm:items-center"
          onClick={closePacket}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-[0_24px_50px_-28px_rgba(7,16,12,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">
                  Player Packet
                </p>
                <h3
                  id={titleId}
                  className="mt-2 font-display text-3xl uppercase tracking-wide text-ink"
                >
                  Send It To The Staff
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">
                  This will be submitted to So Smooth coaches.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={closePacket}
                className="rounded-full border border-ink/10 p-2 text-ink/40 transition-colors hover:border-ink/30 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {sent ? (
              <div className="mt-6">
                <p className="font-display text-3xl uppercase tracking-wide text-ink">Packet In</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">
                  You can edit or delete it from your family portal.
                </p>
                <Button href="/portal/parent/college-program" variant="onLight" className="mt-5">
                  View Your Packets
                </Button>
              </div>
            ) : (
              <ActionForm
                action={submitCollegeProgramAction}
                className="mt-6 flex flex-col gap-5"
                confirm={{
                  title: "Send this college packet?",
                  message: "This will be submitted to So Smooth coaches.",
                  confirmLabel: "Submit Packet",
                }}
                onSuccess={() => setSent(true)}
              >
                <CollegeProgramFields
                  idPrefix="college"
                  players={viewer.players}
                  defaults={{ playerName: viewer.players[0]?.name || "" }}
                />
                <Button type="submit">
                  Submit Packet
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </ActionForm>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
