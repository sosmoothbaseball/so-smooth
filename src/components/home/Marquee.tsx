const WORDS = [
  "DEVELOPMENT",
  "DISCIPLINE",
  "TEAMWORK",
  "CHAMPIONSHIPS",
  "FUNDAMENTALS",
  "COMMUNITY",
];

export default function Marquee() {
  const items = [...WORDS, ...WORDS];

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-green-950 py-4">
      <div className="flex w-max animate-marquee items-center gap-10">
        {[...items, ...items].map((word, i) => (
          <div key={i} className="flex items-center gap-10 shrink-0">
            <span className="font-display text-xl sm:text-2xl uppercase tracking-wider text-bone/85">
              {word}
            </span>
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
