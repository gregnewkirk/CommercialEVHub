// DSIRE (Database of State Incentives for Renewables & Efficiency) integration
// API docs: https://programs.dsireusa.org/system/program

import {
  extractHardwareTypes,
  extractEntityTypes,
  parseDate,
  computeStatus,
  slugify,
  evChargingRelevanceScore,
  parseAmountRange,
} from "./normalize";

// DSIRE program structure (simplified — real API returns XML/JSON)
interface DSIREProgram {
  id: number;
  name: string;
  state: string;
  websiteUrl: string;
  summary: string;
  startDate: string | null;
  endDate: string | null;
  implementingSector: string;
  technologyCategories: string[];
  eligibleSectors: string[];
  incentiveAmount: string;
  programType: string; // "State Incentive", "Federal Incentive", etc.
  lastUpdated: string;
}

export interface NormalizedGrant {
  title: string;
  slug: string;
  description: string;
  amountMin: number | null;
  amountMax: number | null;
  deadline: string | null;
  status: "active" | "archived";
  sourceUrl: string;
  funder: string;
  jurisdiction: "federal" | "state" | "county" | "city" | "utility";
  state: string | null;
  eligibleEntities: string[];
  eligibleHardware: string[];
  incentiveType: "grant" | "tax_credit" | "rebate" | "make_ready";
  justice40: boolean;
  source: string;
  rawData: Record<string, unknown>;
}

const DSIRE_BASE_URL = "https://programs.dsireusa.org/api/v1";

// Map DSIRE program types to our incentive types
function mapIncentiveType(
  programType: string
): "grant" | "tax_credit" | "rebate" | "make_ready" {
  const lower = programType.toLowerCase();
  if (lower.includes("tax credit") || lower.includes("tax incentive"))
    return "tax_credit";
  if (lower.includes("rebate")) return "rebate";
  if (lower.includes("grant") || lower.includes("loan")) return "grant";
  return "grant";
}

// Map DSIRE state codes (full names) → 2-letter codes
function mapJurisdiction(
  sector: string,
  state: string | null
): "federal" | "state" | "county" | "city" | "utility" {
  const lower = sector.toLowerCase();
  if (lower.includes("federal")) return "federal";
  if (lower.includes("utility")) return "utility";
  if (lower.includes("local") || lower.includes("city")) return "city";
  if (lower.includes("county")) return "county";
  if (state) return "state";
  return "federal";
}

/**
 * Fetch EV charging incentives from DSIRE API.
 * Filters for EV/charging relevant programs and normalizes to our schema.
 */
export async function fetchDSIREIncentives(): Promise<NormalizedGrant[]> {
  const apiUrl = `${DSIRE_BASE_URL}/programs?technology=electric_vehicles&format=json`;

  const response = await fetch(apiUrl, {
    headers: {
      Accept: "application/json",
      "User-Agent": "FleetChargeGrants/1.0",
    },
    next: { revalidate: 0 }, // No cache for sync operations
  });

  if (!response.ok) {
    throw new Error(`DSIRE API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const programs: DSIREProgram[] = data.programs ?? data ?? [];

  const normalized: NormalizedGrant[] = [];

  for (const program of programs) {
    // Score relevance to EV charging
    const relevance = evChargingRelevanceScore(
      `${program.name} ${program.summary}`
    );
    if (relevance < 15) continue; // Skip low-relevance programs

    const amounts = parseAmountRange(program.incentiveAmount);
    const deadline = parseDate(program.endDate ?? "");
    const status = computeStatus(deadline);

    const hardware = extractHardwareTypes(
      `${program.name} ${program.summary} ${program.technologyCategories.join(" ")}`
    );
    const entities = extractEntityTypes(
      program.eligibleSectors.join(" ")
    );

    // Check Justice40 relevance (mention of disadvantaged communities)
    const j40Keywords = [
      "justice40",
      "justice 40",
      "disadvantaged communit",
      "underserved",
      "low-income",
      "environmental justice",
    ];
    const fullText = `${program.name} ${program.summary}`.toLowerCase();
    const justice40 = j40Keywords.some((kw) => fullText.includes(kw));

    const grant: NormalizedGrant = {
      title: program.name,
      slug: slugify(program.name),
      description: program.summary,
      amountMin: amounts.min,
      amountMax: amounts.max,
      deadline,
      status,
      sourceUrl: program.websiteUrl,
      funder: program.implementingSector || "DSIRE",
      jurisdiction: mapJurisdiction(
        program.programType,
        program.state
      ),
      state: program.state?.length === 2 ? program.state : null,
      eligibleEntities: entities.length > 0 ? entities : ["commercial"],
      eligibleHardware: hardware.length > 0 ? hardware : ["level_2", "dcfc"],
      incentiveType: mapIncentiveType(program.programType),
      justice40,
      source: "dsire",
      rawData: program as unknown as Record<string, unknown>,
    };

    normalized.push(grant);
  }

  return normalized;
}
