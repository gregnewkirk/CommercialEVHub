import { NextRequest, NextResponse } from "next/server";
import {
  fetchAllContractors,
  type ContractorSource,
} from "@/lib/ingestion/contractors";
import { upsertContractor } from "@/lib/db/queries";
import type { NormalizedContractor } from "@/lib/ingestion/normalize-contractor";

/**
 * POST /api/contractors/sync
 *
 * Triggered by Vercel Cron (weekly) or manual call.
 * Protected by CRON_SECRET Bearer token — same pattern as /api/grants/sync.
 *
 * Query params:
 *   source=evitp       — sync EVITP only
 *   source=cslb        — sync CA CSLB only
 *   source=tdlr        — sync TX TDLR only
 *   source=dbpr        — sync FL DBPR only
 *   source=nys         — sync NY only
 *   source=wa_li       — sync WA L&I only
 *   source=google      — sync Google Places only
 *   (no source param)  — sync all sources
 *
 * Response:
 *   { synced: number, skipped: number, errors: number, source: string }
 */
export async function POST(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sourceParam = request.nextUrl.searchParams.get("source");
  const sources: ContractorSource[] | undefined = sourceParam
    ? [sourceParam as ContractorSource]
    : undefined;

  // Validate source param if provided
  const validSources: ContractorSource[] = ["evitp", "cslb", "tdlr", "dbpr", "nys", "wa_li", "google"];
  if (sourceParam && !validSources.includes(sourceParam as ContractorSource)) {
    return NextResponse.json(
      { error: `Invalid source. Must be one of: ${validSources.join(", ")}` },
      { status: 400 }
    );
  }

  const startedAt = new Date().toISOString();
  console.log(`[contractors/sync] Starting sync at ${startedAt}`, { sources: sources ?? "all" });

  // Fetch from all requested sources (parallel, isolated failures)
  const outcomes = await fetchAllContractors(sources);

  // Tally results per source
  const sourceResults: {
    source: string;
    synced: number;
    skipped: number;
    errors: number;
    errorMessages: string[];
  }[] = [];

  for (const outcome of outcomes) {
    let synced = 0;
    let skipped = 0;
    let errors = 0;
    const errorMessages: string[] = [];

    if (outcome.error) {
      errorMessages.push(outcome.error);
      errors++;
    } else {
      for (const contractor of outcome.contractors) {
        // Skip records missing slug or name
        if (!contractor.slug || !contractor.name) {
          skipped++;
          continue;
        }

        try {
          await upsertContractor(contractor);
          synced++;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error(`[contractors/sync] upsert failed for ${contractor.slug}:`, msg);
          errorMessages.push(`${contractor.slug}: ${msg}`);
          errors++;
        }
      }
    }

    sourceResults.push({
      source: outcome.source,
      synced,
      skipped,
      errors,
      errorMessages,
    });

    console.log(
      `[contractors/sync] ${outcome.source}: synced=${synced} skipped=${skipped} errors=${errors}`
    );
  }

  const totalSynced = sourceResults.reduce((s, r) => s + r.synced, 0);
  const totalSkipped = sourceResults.reduce((s, r) => s + r.skipped, 0);
  const totalErrors = sourceResults.reduce((s, r) => s + r.errors, 0);
  const sourceLabel = sourceParam ?? "all";

  // Log sync result to console (DB logging can be wired here when schema supports it)
  console.log(
    `[contractors/sync] Completed: synced=${totalSynced} skipped=${totalSkipped} errors=${totalErrors} source=${sourceLabel}`
  );

  return NextResponse.json({
    synced: totalSynced,
    skipped: totalSkipped,
    errors: totalErrors,
    source: sourceLabel,
    details: sourceResults,
    ranAt: startedAt,
  });
}

// Vercel Cron sends GET — support both
export async function GET(request: NextRequest) {
  return POST(request);
}
