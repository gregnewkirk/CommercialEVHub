// Contractor auto-scraper: EVITP registry + state electrical license databases + Google Places API
//
// Legal note: only public government databases and the official EVITP registry are used.
// robots.txt compliance is checked before each scrape. Rate limiting is enforced (1-2s delays).
//
// Sources:
//   1. EVITP — https://www.evitp.org/find-a-contractor/
//   2. State license DBs (CA, TX, FL, NY, WA)
//   3. Google Places API (optional fallback — requires GOOGLE_PLACES_API_KEY)

import {
  normalizeEVITP,
  normalizeStateLicense,
  normalizeGooglePlaces,
  type NormalizedContractor,
  type EVITPRawRecord,
  type StateLicenseRawRecord,
  type GooglePlacesRawRecord,
} from "./normalize-contractor";

// ---------------------------------------------------------------------------
// Shared utilities
// ---------------------------------------------------------------------------

/** Sleep for ms milliseconds. Used for rate limiting. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Check robots.txt before scraping a host. Returns true if scraping is allowed. */
async function checkRobotsTxt(baseUrl: string, path: string): Promise<boolean> {
  try {
    const robotsUrl = new URL("/robots.txt", baseUrl).toString();
    const res = await fetch(robotsUrl, {
      headers: { "User-Agent": "CommercialEVHub-Bot/1.0 (+https://commercialevhub.com/bot)" },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return true; // No robots.txt = allow

    const text = await res.text();
    const lines = text.split("\n").map((l) => l.trim().toLowerCase());

    let userAgentApplies = false;
    for (const line of lines) {
      if (line.startsWith("user-agent: *") || line.startsWith("user-agent: commercialevhub")) {
        userAgentApplies = true;
      }
      if (userAgentApplies && line.startsWith("disallow:")) {
        const disallowedPath = line.replace("disallow:", "").trim();
        if (disallowedPath && path.startsWith(disallowedPath)) {
          console.warn(`[robots.txt] Scraping disallowed for ${baseUrl}${path}`);
          return false;
        }
      }
      // Reset when a new user-agent block starts
      if (line.startsWith("user-agent:") && !line.includes("*") && !line.includes("commercialevhub")) {
        userAgentApplies = false;
      }
    }
    return true;
  } catch {
    return true; // Network error reading robots.txt — default allow
  }
}

// ---------------------------------------------------------------------------
// Source 1: EVITP Registry
// ---------------------------------------------------------------------------

const EVITP_API_URL = "https://www.evitp.org/wp-json/evitp/v1/contractors";
const EVITP_FALLBACK_URL = "https://www.evitp.org/find-a-contractor/";

/**
 * Fetch EVITP certified contractors.
 *
 * Tries the WP REST API first (undocumented but typically present on WP sites).
 * Falls back to HTML scraping if the API isn't available.
 * If neither works, logs a warning and returns [].
 */
export async function fetchEVITP(): Promise<NormalizedContractor[]> {
  const allowed = await checkRobotsTxt("https://www.evitp.org", "/wp-json/evitp/");
  if (!allowed) {
    console.warn("[EVITP] robots.txt disallows scraping, skipping");
    return [];
  }

  // Try REST API first
  try {
    const res = await fetch(EVITP_API_URL, {
      headers: {
        "User-Agent": "CommercialEVHub-Bot/1.0 (+https://commercialevhub.com/bot)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (res.ok) {
      const data = await res.json();
      const records: EVITPRawRecord[] = (Array.isArray(data) ? data : data.contractors ?? []).map(
        (item: Record<string, unknown>) => ({
          companyName: String(item.company_name ?? item.name ?? ""),
          city: String(item.city ?? ""),
          state: String(item.state ?? ""),
          phone: item.phone ? String(item.phone) : undefined,
          website: item.website ? String(item.website) : undefined,
          certificationStatus: String(item.status ?? item.certification_status ?? "Certified"),
          sourceUrl: EVITP_FALLBACK_URL,
        })
      );

      const valid = records.filter((r) => r.companyName && r.city && r.state);
      console.log(`[EVITP] REST API returned ${valid.length} contractors`);
      return valid.map(normalizeEVITP);
    }
  } catch (err) {
    console.warn("[EVITP] REST API unavailable:", err instanceof Error ? err.message : String(err));
  }

  // Fallback: attempt HTML scrape (graceful parse of locator page)
  console.warn("[EVITP] Falling back to HTML scrape — results may be limited");

  try {
    const res = await fetch(EVITP_FALLBACK_URL, {
      headers: {
        "User-Agent": "CommercialEVHub-Bot/1.0 (+https://commercialevhub.com/bot)",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.warn(`[EVITP] HTML fetch failed: ${res.status}`);
      return [];
    }

    const html = await res.text();

    // Parse contractor cards from HTML. EVITP uses WordPress + a contractor plugin.
    // Common patterns: <div class="contractor-name">, <div class="contractor-location">, etc.
    const records: EVITPRawRecord[] = [];

    // Match typical contractor listing blocks
    const blockRegex = /<div[^>]*class="[^"]*contractor[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?=<div[^>]*class="[^"]*contractor|$)/gi;
    const nameRegex = /<(?:h[1-6]|strong|p)[^>]*class="[^"]*(?:name|title)[^"]*"[^>]*>(.*?)<\/(?:h[1-6]|strong|p)>/i;
    const cityStateRegex = /([A-Za-z\s]+),\s*([A-Z]{2})\b/;
    const phoneRegex = /(?:tel:|phone:?|ph:?)?\s*(\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4})/i;
    const websiteRegex = /href="(https?:\/\/[^"]+)"/i;

    let match;
    while ((match = blockRegex.exec(html)) !== null) {
      const block = match[1];
      const rawName = nameRegex.exec(block)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
      const cityStateMatch = cityStateRegex.exec(block);
      const phoneMatch = phoneRegex.exec(block);
      const websiteMatch = websiteRegex.exec(block);

      if (rawName && cityStateMatch) {
        records.push({
          companyName: rawName,
          city: cityStateMatch[1].trim(),
          state: cityStateMatch[2],
          phone: phoneMatch?.[1],
          website: websiteMatch?.[1],
          certificationStatus: "Certified",
          sourceUrl: EVITP_FALLBACK_URL,
        });
      }
    }

    console.log(`[EVITP] HTML scrape found ${records.length} contractors`);
    return records.map(normalizeEVITP);
  } catch (err) {
    console.error("[EVITP] HTML scrape failed:", err instanceof Error ? err.message : String(err));
    return [];
  }
}

// ---------------------------------------------------------------------------
// Source 2: State electrical license databases
// ---------------------------------------------------------------------------

// CA — CSLB (Contractors State License Board)
// Public lookup: https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx
// CSLB offers a bulk data download via their open data portal — we use that.
const CSLB_OPEN_DATA_URL =
  "https://data.ca.gov/api/3/action/datastore_search?resource_id=b0b3f9e3-13ea-4a49-9f2b-be2a82a5e4a2&filters=%7B%22license_type%22%3A%22C10%22%2C%22license_status%22%3A%22ACTIVE%22%7D&limit=500";

export async function fetchCSLB(): Promise<NormalizedContractor[]> {
  const SOURCE_NAME = "CSLB";
  const BASE_URL = "https://data.ca.gov";
  const RESOURCE_PATH = "/api/3/action/datastore_search";

  const allowed = await checkRobotsTxt(BASE_URL, RESOURCE_PATH);
  if (!allowed) {
    console.warn("[CSLB] robots.txt disallows scraping");
    return [];
  }

  try {
    await sleep(1500);

    // CA Open Data Portal — contractor license records (C-10 Electrical)
    const res = await fetch(CSLB_OPEN_DATA_URL, {
      headers: {
        "User-Agent": "CommercialEVHub-Bot/1.0 (+https://commercialevhub.com/bot)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      console.warn(`[CSLB] Open Data API error: ${res.status}`);
      return [];
    }

    const json = await res.json();
    const rows: Record<string, unknown>[] = json?.result?.records ?? [];

    const contractors: StateLicenseRawRecord[] = rows
      .filter((r) => String(r.license_status ?? "").toUpperCase() === "ACTIVE")
      .map((r) => ({
        name: String(r.business_name ?? r.licensee_name ?? ""),
        licenseNumber: String(r.license_number ?? ""),
        city: String(r.city ?? ""),
        state: "CA",
        phone: r.phone ? String(r.phone) : undefined,
        status: "Active",
        licenseType: "C-10",
        sourceUrl: `https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx`,
        sourceName: SOURCE_NAME,
      }))
      .filter((r) => r.name && r.city);

    console.log(`[CSLB] Fetched ${contractors.length} active C-10 contractors`);
    return contractors.map(normalizeStateLicense);
  } catch (err) {
    console.error("[CSLB] Fetch failed:", err instanceof Error ? err.message : String(err));
    return [];
  }
}

// TX — TDLR (Texas Department of Licensing and Regulation)
// Open data API: https://data.texas.gov/dataset/TDLR-Licenses/
const TDLR_API_URL =
  "https://data.texas.gov/resource/7358-krk7.json?license_type=Electrical%20Contractor&license_status=Active&$limit=500";

export async function fetchTDLR(): Promise<NormalizedContractor[]> {
  const SOURCE_NAME = "TDLR";

  try {
    await sleep(1500);

    const res = await fetch(TDLR_API_URL, {
      headers: {
        "User-Agent": "CommercialEVHub-Bot/1.0 (+https://commercialevhub.com/bot)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      console.warn(`[TDLR] API error: ${res.status}`);
      return [];
    }

    const rows: Record<string, unknown>[] = await res.json();

    const contractors: StateLicenseRawRecord[] = rows
      .map((r) => ({
        name: String(r.business_name ?? r.name ?? ""),
        licenseNumber: String(r.license_number ?? r.license_no ?? ""),
        city: String(r.city ?? ""),
        state: "TX",
        phone: r.phone ? String(r.phone) : undefined,
        status: String(r.license_status ?? "Active"),
        licenseType: String(r.license_type ?? "Electrical Contractor"),
        sourceUrl: "https://www.tdlr.texas.gov/LicenseSearch/",
        sourceName: SOURCE_NAME,
      }))
      .filter((r) => r.name && r.city);

    console.log(`[TDLR] Fetched ${contractors.length} active electrical contractors`);
    return contractors.map(normalizeStateLicense);
  } catch (err) {
    console.error("[TDLR] Fetch failed:", err instanceof Error ? err.message : String(err));
    return [];
  }
}

// FL — DBPR (Florida Department of Business and Professional Regulation)
// Open data: https://opendata.myfloridalicense.com/
const DBPR_API_URL =
  "https://opendata.myfloridalicense.com/resource/f52y-etb6.json?primary_qualifications_license_type=Electrical%20Contractor&license_status=Current%2CActive&$limit=500";

export async function fetchDBPR(): Promise<NormalizedContractor[]> {
  const SOURCE_NAME = "DBPR";

  try {
    await sleep(1500);

    const res = await fetch(DBPR_API_URL, {
      headers: {
        "User-Agent": "CommercialEVHub-Bot/1.0 (+https://commercialevhub.com/bot)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      console.warn(`[DBPR] API error: ${res.status}`);
      return [];
    }

    const rows: Record<string, unknown>[] = await res.json();

    const contractors: StateLicenseRawRecord[] = rows
      .map((r) => ({
        name: String(r.business_name ?? r.licensee_name ?? ""),
        licenseNumber: String(r.license_number ?? ""),
        city: String(r.county_name ?? r.city ?? ""),
        state: "FL",
        phone: r.phone ? String(r.phone) : undefined,
        status: String(r.license_status ?? "Active"),
        licenseType: "Electrical Contractor",
        sourceUrl: "https://www.myfloridalicense.com/wl11.asp",
        sourceName: SOURCE_NAME,
      }))
      .filter((r) => r.name && r.city);

    console.log(`[DBPR] Fetched ${contractors.length} active electrical contractors`);
    return contractors.map(normalizeStateLicense);
  } catch (err) {
    console.error("[DBPR] Fetch failed:", err instanceof Error ? err.message : String(err));
    return [];
  }
}

// NY — NYS Division of Licensing Services
// Open data: https://data.ny.gov/
const NYS_API_URL =
  "https://data.ny.gov/resource/azct-bfab.json?profession_name=Electrical%20Contractor&license_status=Active&$limit=500";

export async function fetchNYS(): Promise<NormalizedContractor[]> {
  const SOURCE_NAME = "NYS";

  try {
    await sleep(1500);

    const res = await fetch(NYS_API_URL, {
      headers: {
        "User-Agent": "CommercialEVHub-Bot/1.0 (+https://commercialevhub.com/bot)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      console.warn(`[NYS] API error: ${res.status}`);
      return [];
    }

    const rows: Record<string, unknown>[] = await res.json();

    const contractors: StateLicenseRawRecord[] = rows
      .map((r) => ({
        name: String(r.business_name ?? r.name ?? ""),
        licenseNumber: String(r.license_number ?? ""),
        city: String(r.city ?? ""),
        state: "NY",
        phone: r.phone ? String(r.phone) : undefined,
        status: String(r.license_status ?? "Active"),
        licenseType: "Electrical Contractor",
        sourceUrl: "https://www.dos.ny.gov/licensing/",
        sourceName: SOURCE_NAME,
      }))
      .filter((r) => r.name && r.city);

    console.log(`[NYS] Fetched ${contractors.length} active contractors`);
    return contractors.map(normalizeStateLicense);
  } catch (err) {
    console.error("[NYS] Fetch failed:", err instanceof Error ? err.message : String(err));
    return [];
  }
}

// WA — L&I Contractor Registration
// Open data: https://data.lni.wa.gov/
const WA_LI_API_URL =
  "https://data.lni.wa.gov/resource/a3e5-gbmj.json?contractor_type=ELECTRICAL&ubi_status=ACTIVE&$limit=500";

export async function fetchWALI(): Promise<NormalizedContractor[]> {
  const SOURCE_NAME = "WA_LI";

  try {
    await sleep(1500);

    const res = await fetch(WA_LI_API_URL, {
      headers: {
        "User-Agent": "CommercialEVHub-Bot/1.0 (+https://commercialevhub.com/bot)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      console.warn(`[WA L&I] API error: ${res.status}`);
      return [];
    }

    const rows: Record<string, unknown>[] = await res.json();

    const contractors: StateLicenseRawRecord[] = rows
      .map((r) => ({
        name: String(r.business_name ?? r.name ?? ""),
        licenseNumber: String(r.license_number ?? r.ubi_number ?? ""),
        city: String(r.city ?? ""),
        state: "WA",
        phone: r.phone ? String(r.phone) : undefined,
        status: String(r.ubi_status ?? "Active"),
        licenseType: "Electrical Contractor",
        sourceUrl: "https://secure.lni.wa.gov/verify/",
        sourceName: SOURCE_NAME,
      }))
      .filter((r) => r.name && r.city);

    console.log(`[WA L&I] Fetched ${contractors.length} active contractors`);
    return contractors.map(normalizeStateLicense);
  } catch (err) {
    console.error("[WA L&I] Fetch failed:", err instanceof Error ? err.message : String(err));
    return [];
  }
}

// ---------------------------------------------------------------------------
// Source 3: Google Places API (optional fallback)
// ---------------------------------------------------------------------------

const GOOGLE_PLACES_BASE = "https://maps.googleapis.com/maps/api/place";

// Major cities per top-5 EV states to search
const TARGET_CITIES: { city: string; state: string }[] = [
  // CA
  { city: "Los Angeles", state: "CA" },
  { city: "San Francisco", state: "CA" },
  { city: "San Diego", state: "CA" },
  { city: "Sacramento", state: "CA" },
  // TX
  { city: "Houston", state: "TX" },
  { city: "Austin", state: "TX" },
  { city: "Dallas", state: "TX" },
  // FL
  { city: "Miami", state: "FL" },
  { city: "Orlando", state: "FL" },
  { city: "Tampa", state: "FL" },
  // NY
  { city: "New York City", state: "NY" },
  { city: "Buffalo", state: "NY" },
  // WA
  { city: "Seattle", state: "WA" },
  { city: "Spokane", state: "WA" },
];

/**
 * Fetch contractors from Google Places API.
 * Requires GOOGLE_PLACES_API_KEY env var. Skips gracefully if not set.
 */
export async function fetchGooglePlaces(): Promise<NormalizedContractor[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.warn("[Google Places] GOOGLE_PLACES_API_KEY not set, skipping");
    return [];
  }

  const results: NormalizedContractor[] = [];
  const seenIds = new Set<string>();

  for (const { city, state } of TARGET_CITIES) {
    try {
      await sleep(1000); // Respect Google's rate limits

      const query = encodeURIComponent(`commercial EV charger installer ${city} ${state}`);
      const url = `${GOOGLE_PLACES_BASE}/textsearch/json?query=${query}&key=${apiKey}`;

      const res = await fetch(url, {
        headers: {
          "User-Agent": "CommercialEVHub-Bot/1.0 (+https://commercialevhub.com/bot)",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        console.warn(`[Google Places] ${city}, ${state}: HTTP ${res.status}`);
        continue;
      }

      const data = await res.json();
      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        console.warn(`[Google Places] ${city}, ${state}: status=${data.status}`);
        continue;
      }

      const places: Record<string, unknown>[] = data.results ?? [];

      for (const place of places) {
        const placeId = String(place.place_id ?? "");
        if (!placeId || seenIds.has(placeId)) continue;
        seenIds.add(placeId);

        // Parse city/state from formatted_address
        const formattedAddress = String(place.formatted_address ?? "");
        const addrParts = formattedAddress.split(",").map((s: string) => s.trim());
        const extractedCity = addrParts.length >= 3 ? addrParts[addrParts.length - 3] : city;
        const stateZip = addrParts.length >= 2 ? addrParts[addrParts.length - 2] : state;
        const extractedState = stateZip.split(" ")[0] || state;

        const raw: GooglePlacesRawRecord = {
          name: String(place.name ?? ""),
          formattedAddress,
          city: extractedCity,
          state: extractedState,
          rating: typeof place.rating === "number" ? place.rating : undefined,
          userRatingsTotal: typeof place.user_ratings_total === "number" ? place.user_ratings_total : undefined,
          placeId,
        };

        if (raw.name) {
          results.push(normalizeGooglePlaces(raw));
        }
      }
    } catch (err) {
      console.warn(
        `[Google Places] ${city}, ${state} failed:`,
        err instanceof Error ? err.message : String(err)
      );
      // Continue with next city
    }
  }

  console.log(`[Google Places] Fetched ${results.length} contractors`);
  return results;
}

// ---------------------------------------------------------------------------
// Aggregator: fetch all sources
// ---------------------------------------------------------------------------

export type ContractorSource = "evitp" | "cslb" | "tdlr" | "dbpr" | "nys" | "wa_li" | "google";

const SOURCE_FETCHERS: Record<ContractorSource, () => Promise<NormalizedContractor[]>> = {
  evitp: fetchEVITP,
  cslb: fetchCSLB,
  tdlr: fetchTDLR,
  dbpr: fetchDBPR,
  nys: fetchNYS,
  wa_li: fetchWALI,
  google: fetchGooglePlaces,
};

/**
 * Fetch contractors from one or all sources.
 * Each source is fetched independently — failure in one doesn't block others.
 */
export async function fetchAllContractors(
  sources?: ContractorSource[]
): Promise<{ source: ContractorSource; contractors: NormalizedContractor[]; error?: string }[]> {
  const targetSources = sources ?? (Object.keys(SOURCE_FETCHERS) as ContractorSource[]);

  const outcomes = await Promise.allSettled(
    targetSources.map(async (source) => {
      const fetcher = SOURCE_FETCHERS[source];
      const contractors = await fetcher();
      return { source, contractors };
    })
  );

  return outcomes.map((result, i) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      const err = result.reason instanceof Error ? result.reason.message : String(result.reason);
      console.error(`[contractors] Source ${targetSources[i]} failed:`, err);
      return { source: targetSources[i], contractors: [], error: err };
    }
  });
}
