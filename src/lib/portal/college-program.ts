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

export const COLLEGE_POSITION_OPTIONS = [
  { key: "p", label: "Pitcher" },
  { key: "c", label: "Catcher" },
  { key: "1b", label: "First Base" },
  { key: "2b", label: "Second Base" },
  { key: "3b", label: "Third Base" },
  { key: "ss", label: "Shortstop" },
  { key: "lf", label: "Left Field" },
  { key: "cf", label: "Center Field" },
  { key: "rf", label: "Right Field" },
  { key: "dh", label: "Designated Hitter" },
  { key: "util", label: "Utility" },
  { key: "inf", label: "Infield" },
  { key: "of", label: "Outfield" },
  { key: "rhp", label: "Right-Handed Pitcher" },
  { key: "lhp", label: "Left-Handed Pitcher" },
  { key: "2w", label: "Two-Way" },
] as const;

export const COLLEGE_POSITION_KEYS = new Set<string>(
  COLLEGE_POSITION_OPTIONS.map((option) => option.key),
);

export const COLLEGE_PROGRAM_WAIT_MS = 30 * 60 * 1000;
export const COLLEGE_NAME_MAX = 80;
export const COLLEGE_BIO_MAX = 4000;
export const COLLEGE_LINK_MAX = 300;
export const COLLEGE_PHYS_MAX = 24;
export const COLLEGE_STAT_VALUE_MAX = 24;
export const COLLEGE_ACCOLADE_MAX = 120;
export const COLLEGE_STATS_MAX = 12;
export const COLLEGE_ACCOLADES_MAX = 12;
export const COLLEGE_POSITIONS_MAX = 8;

export function collegeStatLabel(key: string) {
  return COLLEGE_STAT_OPTIONS.find((option) => option.key === key)?.label || key.toUpperCase();
}

export function collegePositionLabel(key: string) {
  return COLLEGE_POSITION_OPTIONS.find((option) => option.key === key)?.label || key.toUpperCase();
}

export function parseCollegePositions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value
    .map((item) => String(item || "").trim())
    .filter((key) => COLLEGE_POSITION_KEYS.has(key) && !seen.has(key) && seen.add(key))
    .slice(0, COLLEGE_POSITIONS_MAX);
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

export function splitCollegeHeight(height = "") {
  const match = String(height).match(/(\d+)\s*'\s*(\d+)/);
  if (!match) return { feet: "", inches: "" };
  return { feet: match[1], inches: match[2] };
}

export function formatCollegeHeight(
  feetRaw: string,
  inchesRaw: string,
): { height: string } | { error: string } {
  const feet = Number(feetRaw);
  const inches = Number(inchesRaw);
  if (!Number.isInteger(feet) || feet < 3 || feet > 8) {
    return { error: "Enter height in feet, like 5 or 6." };
  }
  if (!Number.isInteger(inches) || inches < 0 || inches > 11) {
    return { error: "Inches should be a number from 0 to 11." };
  }
  return { height: `${feet}'${inches}"` };
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
  positions: string[];
};

export function readCollegeProgramForm(
  formData: FormData,
): CollegeProgramFields | { error: string } {
  const playerName = String(formData.get("playerName") || "").trim();
  const formattedHeight = formatCollegeHeight(
    String(formData.get("heightFeet") || "").trim(),
    String(formData.get("heightInches") || "").trim(),
  );
  if ("error" in formattedHeight) return { error: formattedHeight.error };
  const height = formattedHeight.height;
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
  const positions = formData
    .getAll("position")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (playerName.length < 2) return { error: "Enter the player's name." };
  if (playerName.length > COLLEGE_NAME_MAX) {
    return { error: `Keep the player name under ${COLLEGE_NAME_MAX} characters.` };
  }
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
  if (positions.length > COLLEGE_POSITIONS_MAX) {
    return { error: `You can add up to ${COLLEGE_POSITIONS_MAX} positions.` };
  }
  if (positions.some((key) => !COLLEGE_POSITION_KEYS.has(key))) {
    return { error: "Pick a position from the list." };
  }

  return {
    playerName,
    height,
    weight,
    bio,
    link,
    stats: parseCollegeStats(stats),
    accolades: parseCollegeAccolades(accolades),
    positions: parseCollegePositions(positions),
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
  positions: string[];
  bio: string;
  link: string;
}) {
  const lines = [
    "SO SMOOTH BASEBALL",
    "College Program Player Profile",
    "",
    "PLAYER",
    `Name: ${input.playerName}`,
    `Height: ${input.height}`,
    `Weight: ${input.weight}`,
    "",
    "POSITIONS",
    ...(input.positions.length
      ? input.positions.map((key) => `• ${collegePositionLabel(key)}`)
      : ["None listed"]),
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
  ].filter((line, index, list) => line !== "" || list[index - 1] !== "");

  const subject = `So Smooth College Program — ${input.playerName}`;
  const body = lines.join("\n");
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
