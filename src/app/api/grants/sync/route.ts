import { NextRequest, NextResponse } from "next/server";
import { fetchDSIREIncentives } from "@/lib/ingestion/dsire";
import { fetchGrantsGov } from "@/lib/ingestion/apify";
import type { NormalizedGrant } from "@/lib/ingestion/dsire";

// In production, uncomment to use DB:
// import { db } from "@/lib/db";
// import { grants, grantSyncLogs } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";

/**
 * POST /api/grants/sync
 *
 * Triggered by Vercel Cron or manual call.
 * Protected by CRON_SECRET header.
 *
 * Query params:
 *   source=dsire     — sync from DSIRE only
 *   source=grants_gov — sync from Grants.gov only
 *   (no source)      — sync from all sources
 */
export async function POST(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const source = request.nextUrl.searchParams.get("source");

  const results: {
    source: string;
    added: number;
    updated: number;
    errors: string[];
  }[] = [];

  // DSIRE sync
  if (!source || source === "dsire") {
    try {
      const dsireGrants = await fetchDSIREIncentives();
      const { added, updated } = await upsertGrants(dsireGrants);
      results.push({ source: "dsire", added, updated, errors: [] });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results.push({ source: "dsire", added: 0, updated: 0, errors: [message] });
    }
  }

  // Grants.gov sync
  if (!source || source === "grants_gov") {
    try {
      const govGrants = await fetchGrantsGov();
      const { added, updated } = await upsertGrants(govGrants);
      results.push({ source: "grants_gov", added, updated, errors: [] });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results.push({ source: "grants_gov", added: 0, updated: 0, errors: [message] });
    }
  }

  // Log results
  // In production with DB connected:
  // for (const r of results) {
  //   await db.insert(grantSyncLogs).values({
  //     source: r.source,
  //     status: r.errors.length > 0 ? "partial" : "success",
  //     grantsAdded: r.added,
  //     grantsUpdated: r.updated,
  //     errorMessage: r.errors.join("; ") || null,
  //   });
  // }

  const totalAdded = results.reduce((sum, r) => sum + r.added, 0);
  const totalUpdated = results.reduce((sum, r) => sum + r.updated, 0);
  const hasErrors = results.some((r) => r.errors.length > 0);

  return NextResponse.json({
    success: !hasErrors,
    summary: {
      totalAdded,
      totalUpdated,
      sources: results,
    },
  });
}

/**
 * Upsert normalized grants into the database.
 * Uses source_url as the deduplication key.
 *
 * Currently returns mock counts; enable DB code in production.
 */
async function upsertGrants(
  normalizedGrants: NormalizedGrant[]
): Promise<{ added: number; updated: number }> {
  let added = 0;
  let updated = 0;

  // Production implementation with DB:
  // for (const grant of normalizedGrants) {
  //   const existing = await db.query.grants.findFirst({
  //     where: eq(grants.sourceUrl, grant.sourceUrl),
  //   });
  //
  //   if (existing) {
  //     await db
  //       .update(grants)
  //       .set({
  //         title: grant.title,
  //         description: grant.description,
  //         amountMin: grant.amountMin,
  //         amountMax: grant.amountMax,
  //         deadline: grant.deadline,
  //         status: grant.status,
  //         funder: grant.funder,
  //         eligibleEntities: grant.eligibleEntities,
  //         eligibleHardware: grant.eligibleHardware,
  //         incentiveType: grant.incentiveType,
  //         justice40: grant.justice40,
  //         rawData: grant.rawData,
  //         updatedAt: new Date(),
  //       })
  //       .where(eq(grants.id, existing.id));
  //     updated++;
  //   } else {
  //     await db.insert(grants).values({
  //       title: grant.title,
  //       slug: grant.slug,
  //       description: grant.description,
  //       amountMin: grant.amountMin,
  //       amountMax: grant.amountMax,
  //       deadline: grant.deadline,
  //       status: grant.status,
  //       sourceUrl: grant.sourceUrl,
  //       funder: grant.funder,
  //       jurisdiction: grant.jurisdiction,
  //       state: grant.state,
  //       eligibleEntities: grant.eligibleEntities,
  //       eligibleHardware: grant.eligibleHardware,
  //       incentiveType: grant.incentiveType,
  //       justice40: grant.justice40,
  //       source: grant.source,
  //       rawData: grant.rawData,
  //     });
  //     added++;
  //   }
  // }

  // Mock: count grants as "added" for now
  added = normalizedGrants.length;

  return { added, updated };
}

// Also support GET for Vercel Cron (it uses GET by default)
export async function GET(request: NextRequest) {
  return POST(request);
}
