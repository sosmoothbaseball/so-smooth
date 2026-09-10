import Image from "next/image";

const CLAUSES = [
  {
    title: "Assumption of Risk",
    body: "Baseball involves running, throwing, batting, and contact with balls and equipment. I understand those risks and still choose to participate.",
  },
  {
    title: "Release",
    body: "I release So Smooth, its coaches, and staff from claims that arise from ordinary participation, except for conduct the law does not allow us to waive.",
  },
  {
    title: "Medical Care",
    body: "If my player is hurt and I cannot be reached, I authorize staff to seek reasonable emergency care.",
  },
  {
    title: "Photo & Media",
    body: "So Smooth may use photos or video from sessions and games for the program, unless I send a written opt-out.",
  },
  {
    title: "Conduct",
    body: "Players and parents agree to the team standard: respect, effort, and a team-first culture on and off the field.",
  },
];

export default function WaiverDocument() {
  return (
    <article className="relative overflow-hidden rounded-sm bg-white shadow-[0_20px_50px_-28px_rgba(7,16,12,0.45)]">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400" />

      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <header className="flex items-start justify-between gap-4 border-b border-ink/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-ink">
              <Image
                src="/brand/logo.png"
                alt=""
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </span>
            <div>
              <p className="font-display text-2xl uppercase tracking-wide text-ink">
                So Smooth
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink/40">
                Baseball · Training · Travel
              </p>
            </div>
          </div>
          <p className="text-right text-[10px] uppercase tracking-[0.18em] text-ink/35">
            Form SS-W01
            <br />
            Season 2026
          </p>
        </header>

        <h2 className="mt-8 font-display text-3xl uppercase leading-none tracking-wide text-ink sm:text-4xl">
          Player Participation
          <span className="block text-green-700">Waiver & Release</span>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-ink/65">
          This is example copy so the page looks like a finished waiver. Open or
          download the PDF for the file we will use. A parent or guardian signs
          for any player under 18.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 text-xs">
          {[
            ["Player Name", ""],
            ["Date of Birth", ""],
            ["Team / Age Group", "11U · 12U · 13U · 14U"],
            ["Parent / Guardian", ""],
          ].map(([label, hint]) => (
            <div key={label} className="border-b border-ink/15 pb-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/40">
                {label}
              </p>
              <p className="mt-2 min-h-5 text-ink/30">{hint || " "}</p>
            </div>
          ))}
        </div>

        <ol className="mt-8 flex flex-col gap-5">
          {CLAUSES.map((clause, i) => (
            <li key={clause.title} className="flex gap-3">
              <span className="font-display text-xl text-green-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{clause.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/60">
                  {clause.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {["Player Signature", "Parent / Guardian Signature"].map((label) => (
            <div key={label} className="rounded-xl border border-ink/10 bg-bone px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/40">
                {label}
              </p>
              <div className="mt-8 border-b border-ink/25" />
              <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-ink/35">
                Date ____________
              </p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
