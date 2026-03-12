// Normalization utilities for raw grant data from DSIRE, Grants.gov, etc.

const HARDWARE_MAP: Record<string, string> = {
  // DCFC variants
  "level 3": "dcfc",
  "level iii": "dcfc",
  dcfc: "dcfc",
  "dc fast": "dcfc",
  "dc fast charger": "dcfc",
  "dc fast charging": "dcfc",
  "fast charger": "dcfc",
  "fast charging": "dcfc",
  "480v": "dcfc",
  // Level 2 variants
  "level 2": "level_2",
  "level ii": "level_2",
  l2: "level_2",
  "240v": "level_2",
  "ac level 2": "level_2",
  // Level 1 variants
  "level 1": "level_1",
  "level i": "level_1",
  l1: "level_1",
  "120v": "level_1",
  // Wireless
  wireless: "wireless",
  inductive: "wireless",
  // Network/make-ready
  "make-ready": "make_ready",
  "make ready": "make_ready",
  "electrical infrastructure": "make_ready",
};

const ENTITY_MAP: Record<string, string> = {
  government: "government",
  "local government": "government",
  "state government": "government",
  "federal government": "government",
  municipality: "government",
  municipal: "government",
  commercial: "commercial",
  business: "commercial",
  "private business": "commercial",
  corporation: "commercial",
  nonprofit: "nonprofit",
  "non-profit": "nonprofit",
  "not-for-profit": "nonprofit",
  tribal: "tribal",
  "tribal government": "tribal",
  "native american": "tribal",
  "school district": "school_district",
  school: "school_district",
  "k-12": "school_district",
  educational: "school_district",
  "transit agency": "transit_agency",
  transit: "transit_agency",
  "public transit": "transit_agency",
  "transportation authority": "transit_agency",
  utility: "utility",
  "electric utility": "utility",
  "utility company": "utility",
};

/**
 * Normalize hardware type strings to our enum values.
 * Returns null if no match found.
 */
export function normalizeHardwareType(raw: string): string | null {
  const key = raw.trim().toLowerCase();
  return HARDWARE_MAP[key] ?? null;
}

/**
 * Extract all hardware types from a text description.
 */
export function extractHardwareTypes(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  for (const [pattern, value] of Object.entries(HARDWARE_MAP)) {
    if (lower.includes(pattern)) {
      found.add(value);
    }
  }

  return Array.from(found);
}

/**
 * Normalize entity type strings to our enum values.
 * Returns null if no match found.
 */
export function normalizeEntityType(raw: string): string | null {
  const key = raw.trim().toLowerCase();
  return ENTITY_MAP[key] ?? null;
}

/**
 * Extract all entity types from a text description.
 */
export function extractEntityTypes(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  for (const [pattern, value] of Object.entries(ENTITY_MAP)) {
    if (lower.includes(pattern)) {
      found.add(value);
    }
  }

  return Array.from(found);
}

/**
 * Parse dollar amount strings into cents (integer).
 * "$1,321,200" → 132120000
 * "Up to $100,000" → 10000000
 * "$50,000 - $500,000" → returns max: 50000000
 * Returns null if unparseable.
 */
export function parseAmount(raw: string): number | null {
  if (!raw) return null;

  // Extract dollar amounts (grab last/largest number for "up to" style)
  const matches = raw.match(/\$[\d,]+(?:\.\d{2})?/g);
  if (!matches || matches.length === 0) return null;

  // Use the last match (typically the max in "X to Y" ranges)
  const lastMatch = matches[matches.length - 1];
  const cleaned = lastMatch.replace(/[$,]/g, "");
  const dollars = parseFloat(cleaned);

  if (isNaN(dollars)) return null;
  return Math.round(dollars * 100);
}

/**
 * Parse a range like "$50,000 - $500,000" into [min, max] in cents.
 */
export function parseAmountRange(
  raw: string
): { min: number | null; max: number | null } {
  if (!raw) return { min: null, max: null };

  const matches = raw.match(/\$[\d,]+(?:\.\d{2})?/g);
  if (!matches || matches.length === 0) return { min: null, max: null };

  if (matches.length === 1) {
    const amount = parseAmount(matches[0]);
    // "Up to X" → max only; otherwise treat as both
    if (raw.toLowerCase().includes("up to")) {
      return { min: null, max: amount };
    }
    return { min: amount, max: amount };
  }

  return {
    min: parseAmount(matches[0]),
    max: parseAmount(matches[matches.length - 1]),
  };
}

/**
 * Parse various date formats into "YYYY-MM-DD".
 * Supports: "12/31/2026", "December 31, 2026", "2026-12-31", "Dec 2026"
 */
export function parseDate(raw: string): string | null {
  if (!raw) return null;

  const trimmed = raw.trim();

  // Already ISO format
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  // Try native Date parsing
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }

  // MM/DD/YYYY
  const mdyMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdyMatch) {
    const [, m, day, y] = mdyMatch;
    return `${y}-${m.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return null;
}

/**
 * Determine grant status based on deadline.
 */
export function computeStatus(
  deadline: string | null
): "active" | "archived" {
  if (!deadline) return "active"; // No deadline = ongoing
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return deadlineDate < today ? "archived" : "active";
}

/**
 * Generate a URL-safe slug from a title.
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

/**
 * Score text relevance to EV charging.
 * Returns 0-100; higher = more relevant.
 */
export function evChargingRelevanceScore(text: string): number {
  const lower = text.toLowerCase();
  let score = 0;

  const strongKeywords = [
    "ev charging",
    "electric vehicle charging",
    "evse",
    "charging station",
    "charging infrastructure",
    "dc fast charg",
    "level 2 charg",
    "fleet charging",
    "fleet electrification",
  ];
  const mediumKeywords = [
    "electric vehicle",
    "zero emission vehicle",
    "alternative fuel",
    "clean transportation",
    "nevi",
    "charger",
  ];
  const weakKeywords = [
    "ev",
    "clean energy",
    "emission reduction",
    "transportation electrification",
  ];

  for (const kw of strongKeywords) {
    if (lower.includes(kw)) score += 25;
  }
  for (const kw of mediumKeywords) {
    if (lower.includes(kw)) score += 10;
  }
  for (const kw of weakKeywords) {
    if (lower.includes(kw)) score += 5;
  }

  return Math.min(score, 100);
}
