export const COLLEGE_STAT_OPTIONS = [
  { key: "avg", label: "AVG" },
  { key: "obp", label: "OBP" },
  { key: "slg", label: "SLG" },
  { key: "ops", label: "OPS" },
  { key: "hr", label: "Home Runs" },
  { key: "rbi", label: "RBIs" },
  { key: "sb", label: "Stolen Bases" },
  { key: "r", label: "Runs" },
  { key: "h", label: "Hits" },
  { key: "2b", label: "Doubles" },
  { key: "3b", label: "Triples" },
  { key: "bb", label: "Walks" },
  { key: "so", label: "Strikeouts" },
  { key: "gp", label: "Games Played" },
  { key: "era", label: "ERA" },
  { key: "whip", label: "WHIP" },
  { key: "k", label: "Pitching Ks" },
  { key: "ip", label: "Innings Pitched" },
  { key: "w", label: "Wins" },
  { key: "sv", label: "Saves" },
] as const;

export type CollegeStatKey = (typeof COLLEGE_STAT_OPTIONS)[number]["key"];

export type CollegeStat = {
  key: string;
  value: string;
};

export const COLLEGE_STAT_KEYS = new Set<string>(COLLEGE_STAT_OPTIONS.map((option) => option.key));

export const COLLEGE_PROGRAM_WAIT_MS = 30 * 60 * 1000;
export const COLLEGE_NAME_MAX = 80;
export const COLLEGE_BIO_MAX = 4000;
export const COLLEGE_LINK_MAX = 300;
export const COLLEGE_PHYS_MAX = 24;
export const COLLEGE_STAT_VALUE_MAX = 24;
export const COLLEGE_ACCOLADE_MAX = 120;
export const COLLEGE_STATS_MAX = 12;
export const COLLEGE_ACCOLADES_MAX = 12;

export function collegeStatLabel(key: string) {
  return COLLEGE_STAT_OPTIONS.find((option) => option.key === key)?.label || key.toUpperCase();
}

export function parseCollegeStats(value: unknown): CollegeStat[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const key = String("key" in row ? row.key : "").trim();
      const statValue = String("value" in row ? row.value : "").trim();
      if (!COLLEGE_STAT_KEYS.has(key) || !statValue) return null;
      return { key, value: statValue.slice(0, COLLEGE_STAT_VALUE_MAX) };
    })
    .filter((row): row is CollegeStat => Boolean(row))
    .slice(0, COLLEGE_STATS_MAX);
}

export function parseCollegeAccolades(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .map((item) => item.slice(0, COLLEGE_ACCOLADE_MAX))
    .slice(0, COLLEGE_ACCOLADES_MAX);
}

type CollegeProgramFields = {
  playerName: string;
  height: string;
  weight: string;
  bio: string;
  link: string;
  stats: CollegeStat[];
  accolades: string[];
};

export function readCollegeProgramForm(
  formData: FormData,
): CollegeProgramFields | { error: string } {
  const playerName = String(formData.get("playerName") || "").trim();
  const height = String(formData.get("height") || "").trim();
  const weight = String(formData.get("weight") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const link = String(formData.get("link") || "").trim();
  const keys = formData.getAll("statKey").map((value) => String(value).trim());
  const values = formData.getAll("statValue").map((value) => String(value).trim());
  const stats = keys
    .map((key, index) => ({ key, value: values[index] || "" }))
    .filter((row) => row.key && row.value);
  const accolades = formData
    .getAll("accolade")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (playerName.length < 2) return { error: "Enter the player's name." };
  if (playerName.length > COLLEGE_NAME_MAX) {
    return { error: `Keep the player name under ${COLLEGE_NAME_MAX} characters.` };
  }
  if (height.length < 2) return { error: "Add the player's height." };
  if (height.length > COLLEGE_PHYS_MAX) return { error: "Keep height short, like 5'10\"." };
  if (weight.length < 2) return { error: "Add the player's weight." };
  if (weight.length > COLLEGE_PHYS_MAX) return { error: "Keep weight short, like 165 lbs." };
  if (bio.length > COLLEGE_BIO_MAX) {
    return { error: `Keep the bio under ${COLLEGE_BIO_MAX} characters.` };
  }
  if (link && !/^https?:\/\//i.test(link)) {
    return { error: "The link should start with https://" };
  }
  if (link.length > COLLEGE_LINK_MAX) return { error: "Keep the link shorter." };
  if (stats.length > COLLEGE_STATS_MAX) {
    return { error: `You can add up to ${COLLEGE_STATS_MAX} stats.` };
  }
  if (stats.some((row) => !COLLEGE_STAT_KEYS.has(row.key))) {
    return { error: "Pick a stat from the list." };
  }
  if (stats.some((row) => row.value.length > COLLEGE_STAT_VALUE_MAX)) {
    return { error: "Keep each stat value short." };
  }
  if (accolades.length > COLLEGE_ACCOLADES_MAX) {
    return { error: `You can add up to ${COLLEGE_ACCOLADES_MAX} accolades.` };
  }
  if (accolades.some((item) => item.length > COLLEGE_ACCOLADE_MAX)) {
    return { error: "Keep each accolade a little shorter." };
  }

  return {
    playerName,
    height,
    weight,
    bio,
    link,
    stats: parseCollegeStats(stats),
    accolades: parseCollegeAccolades(accolades),
  };
}

export function collegeProgramMailto(input: {
  playerName: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  height: string;
  weight: string;
  stats: CollegeStat[];
  accolades: string[];
  bio: string;
  link: string;
}) {
  const lines = [
    "SO SMOOTH BASEBALL",
    "College Program Packet",
    "",
    "PLAYER",
    `Name: ${input.playerName}`,
    `Height: ${input.height}`,
    `Weight: ${input.weight}`,
    "",
    "FAMILY",
    `Parent: ${input.parentName}`,
    input.parentEmail ? `Email: ${input.parentEmail}` : "",
    input.parentPhone ? `Phone: ${input.parentPhone}` : "",
    "",
    "STATS",
    ...(input.stats.length
      ? input.stats.map((stat) => `${collegeStatLabel(stat.key)}: ${stat.value}`)
      : ["None listed"]),
    "",
    "ACCOLADES",
    ...(input.accolades.length ? input.accolades.map((item) => `• ${item}`) : ["None listed"]),
    "",
    "BIO",
    input.bio || "None listed",
    "",
    "LINK",
    input.link || "None listed",
    "",
    "—",
    "Sent from the So Smooth coach portal.",
  ].filter((line, index, list) => line !== "" || list[index - 1] !== "");

  const subject = `So Smooth College Program — ${input.playerName}`;
  const body = lines.join("\n");
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
