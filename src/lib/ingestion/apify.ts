// Apify integration for Grants.gov scraping
// Uses Apify actor to scrape Grants.gov for EV charging related federal grants

import {
  extractHardwareTypes,
  extractEntityTypes,
  parseDate,
  computeStatus,
  slugify,
  evChargingRelevanceScore,
  parseAmountRange,
} from "./normalize";
import type { NormalizedGrant } from "./dsire";

const APIFY_BASE_URL = "https://api.apify.com/v2";

// Grants.gov item structure from Apify scraper
interface GrantsGovItem {
  opportunityId: string;
  opportunityTitle: string;
  oppDescription: string;
  agency: string;
  closingDate: string | null;
  awardCeiling: string;
  awardFloor: string;
  url: string;
  eligibleApplicants: string[];
  fundingCategory: string;
  lastUpdated: string;
}

/**
 * Fetch EV charging grants from Grants.gov via Apify actor.
 * Starts an actor run, polls for completion, then fetches results.
 */
export async function fetchGrantsGov(): Promise<NormalizedGrant[]> {
  const apiToken = process.env.APIFY_API_TOKEN;
  if (!apiToken) {
    console.warn("APIFY_API_TOKEN not set, skipping Grants.gov sync");
    return [];
  }

  // Use a general-purpose Grants.gov scraper actor
  // In production, replace with your specific actor ID
  const actorId = process.env.APIFY_GRANTS_ACTOR_ID ?? "apify~grants-gov-scraper";

  // Start actor run with EV-related search terms
  const runResponse = await fetch(
    `${APIFY_BASE_URL}/acts/${encodeURIComponent(actorId)}/runs`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        searchKeywords: [
          "electric vehicle charging",
          "EVSE",
          "alternative fuel infrastructure",
          "EV charging station",
          "zero emission vehicle infrastructure",
        ],
        maxResults: 200,
      }),
    }
  );

  if (!runResponse.ok) {
    throw new Error(
      `Apify run start failed: ${runResponse.status} ${runResponse.statusText}`
    );
  }

  const runData = await runResponse.json();
  const runId: string = runData.data?.id;
  if (!runId) throw new Error("No run ID returned from Apify");

  // Poll for completion (max 5 minutes)
  const maxWaitMs = 5 * 60 * 1000;
  const pollIntervalMs = 10_000;
  const startTime = Date.now();

  let datasetId: string | null = null;

  while (Date.now() - startTime < maxWaitMs) {
    await new Promise((r) => setTimeout(r, pollIntervalMs));

    const statusResponse = await fetch(
      `${APIFY_BASE_URL}/actor-runs/${runId}`,
      { headers: { Authorization: `Bearer ${apiToken}` } }
    );

    if (!statusResponse.ok) continue;

    const statusData = await statusResponse.json();
    const status = statusData.data?.status;

    if (status === "SUCCEEDED") {
      datasetId = statusData.data?.defaultDatasetId;
      break;
    }
    if (status === "FAILED" || status === "ABORTED") {
      throw new Error(`Apify actor run ${status}: ${statusData.data?.statusMessage}`);
    }
    // RUNNING or READY — keep polling
  }

  if (!datasetId) {
    throw new Error("Apify actor run timed out after 5 minutes");
  }

  // Fetch dataset results
  const dataResponse = await fetch(
    `${APIFY_BASE_URL}/datasets/${datasetId}/items?format=json&limit=500`,
    { headers: { Authorization: `Bearer ${apiToken}` } }
  );

  if (!dataResponse.ok) {
    throw new Error(`Apify dataset fetch failed: ${dataResponse.status}`);
  }

  const items: GrantsGovItem[] = await dataResponse.json();

  // Filter and normalize
  const normalized: NormalizedGrant[] = [];

  for (const item of items) {
    const fullText = `${item.opportunityTitle} ${item.oppDescription} ${item.fundingCategory}`;
    const relevance = evChargingRelevanceScore(fullText);

    // Require minimum relevance score
    if (relevance < 20) continue;

    const deadline = parseDate(item.closingDate ?? "");
    const status = computeStatus(deadline);

    const amountRange = item.awardCeiling
      ? parseAmountRange(`$${item.awardFloor || "0"} - $${item.awardCeiling}`)
      : { min: null, max: null };

    const hardware = extractHardwareTypes(fullText);
    const entities = extractEntityTypes(
      (item.eligibleApplicants || []).join(" ")
    );

    const j40Keywords = [
      "justice40",
      "justice 40",
      "disadvantaged communit",
      "underserved",
      "low-income",
      "environmental justice",
    ];
    const lowerText = fullText.toLowerCase();
    const justice40 = j40Keywords.some((kw) => lowerText.includes(kw));

    const grant: NormalizedGrant = {
      title: item.opportunityTitle,
      slug: slugify(item.opportunityTitle),
      description: item.oppDescription?.slice(0, 2000) ?? "",
      amountMin: amountRange.min,
      amountMax: amountRange.max,
      deadline,
      status,
      sourceUrl: item.url || `https://www.grants.gov/search-results-detail/${item.opportunityId}`,
      funder: item.agency || "Federal Government",
      jurisdiction: "federal",
      state: null,
      eligibleEntities: entities.length > 0 ? entities : ["commercial", "government"],
      eligibleHardware: hardware.length > 0 ? hardware : ["level_2", "dcfc"],
      incentiveType: "grant",
      justice40,
      source: "grants_gov",
      rawData: item as unknown as Record<string, unknown>,
    };

    normalized.push(grant);
  }

  return normalized;
}
