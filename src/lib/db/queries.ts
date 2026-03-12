import { createClient } from "@supabase/supabase-js";
import type { Grant, Installer, Contractor } from "./schema";
import type { NormalizedContractor } from "@/lib/ingestion/normalize-contractor";

// Standalone Supabase client for server-side data queries
// Uses REST API so it works everywhere (no IPv6/DNS issues)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ---------------------------------------------------------------------------
// Transform helpers: Supabase returns snake_case, our types use camelCase
// ---------------------------------------------------------------------------

function toGrant(row: Record<string, unknown>): Grant {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    description: (row.description as string) ?? "",
    amountMin: row.amount_min as number | null,
    amountMax: row.amount_max as number | null,
    deadline: row.deadline as string | null,
    status: row.status as Grant["status"],
    sourceUrl: row.source_url as string | null,
    funder: (row.funder as string) ?? "",
    jurisdiction: row.jurisdiction as Grant["jurisdiction"],
    state: row.state as string | null,
    city: row.city as string | null,
    utility: row.utility as string | null,
    eligibleEntities: (row.eligible_entities as string[]) ?? [],
    eligibleHardware: (row.eligible_hardware as string[]) ?? [],
    incentiveType: row.incentive_type as Grant["incentiveType"],
    justice40: (row.justice40 as boolean) ?? false,
    source: (row.source as string) ?? "manual",
    rawData: row.raw_data as unknown,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function toInstaller(row: Record<string, unknown>): Installer {
  return {
    id: row.id as string,
    userId: row.user_id as string | null,
    companyName: row.company_name as string,
    slug: row.slug as string,
    description: (row.description as string) ?? "",
    logoUrl: row.logo_url as string | null,
    website: row.website as string | null,
    phone: row.phone as string,
    email: row.email as string,
    serviceAreas: (row.service_areas as string[]) ?? [],
    hardwareTypes: (row.hardware_types as string[]) ?? [],
    tier: row.tier as Installer["tier"],
    verified: (row.verified as boolean) ?? false,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

// ---------------------------------------------------------------------------
// Grant queries
// ---------------------------------------------------------------------------

export interface GrantFilters {
  search?: string;
  jurisdiction?: string;
  state?: string;
  city?: string;
  entityType?: string;
  hardwareType?: string;
  incentiveType?: string;
  justice40?: boolean;
  status?: string;
  page?: number;
  limit?: number;
}

export interface GrantsResult {
  grants: Grant[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getGrants(filters: GrantFilters = {}): Promise<GrantsResult> {
  const {
    search,
    jurisdiction,
    state: stateFilter,
    entityType,
    hardwareType,
    incentiveType,
    justice40,
    status = "active",
    page = 1,
    limit = 20,
  } = filters;

  let query = supabase.from("grants").select("*", { count: "exact" });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,funder.ilike.%${search}%`
    );
  }

  if (jurisdiction) {
    query = query.eq("jurisdiction", jurisdiction);
  }

  if (stateFilter) {
    query = query.eq("state", stateFilter.toUpperCase());
  }

  if (entityType) {
    query = query.contains("eligible_entities", [entityType]);
  }

  if (hardwareType) {
    query = query.contains("eligible_hardware", [hardwareType]);
  }

  if (incentiveType) {
    query = query.eq("incentive_type", incentiveType);
  }

  if (justice40) {
    query = query.eq("justice40", true);
  }

  const offset = (page - 1) * limit;
  query = query
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  const { data, count, error } = await query;

  if (error) {
    console.error("getGrants error:", error.message);
    return { grants: [], total: 0, page, totalPages: 0 };
  }

  return {
    grants: (data ?? []).map(toGrant),
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}

export async function getGrantBySlug(slug: string): Promise<Grant | null> {
  const { data, error } = await supabase
    .from("grants")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return toGrant(data);
}

export async function getGrantsByState(stateCode: string): Promise<Grant[]> {
  const { data, error } = await supabase
    .from("grants")
    .select("*")
    .eq("state", stateCode.toUpperCase())
    .eq("status", "active");

  if (error) {
    console.error("getGrantsByState error:", error.message);
    return [];
  }

  return (data ?? []).map(toGrant);
}

export async function getFederalGrants(): Promise<Grant[]> {
  const { data, error } = await supabase
    .from("grants")
    .select("*")
    .eq("jurisdiction", "federal")
    .eq("status", "active");

  if (error) {
    console.error("getFederalGrants error:", error.message);
    return [];
  }

  return (data ?? []).map(toGrant);
}

export async function getRelatedGrants(grantId: string, limit = 5): Promise<Grant[]> {
  const { data, error } = await supabase
    .from("grants")
    .select("*")
    .neq("id", grantId)
    .eq("status", "active")
    .limit(limit);

  if (error) {
    console.error("getRelatedGrants error:", error.message);
    return [];
  }

  return (data ?? []).map(toGrant);
}

export async function getTotalFundingTracked(): Promise<number> {
  const { data, error } = await supabase
    .from("grants")
    .select("amount_max")
    .eq("status", "active");

  if (error) return 0;
  return (data ?? []).reduce((sum, row) => sum + (row.amount_max ?? 0), 0);
}

export async function getActiveGrantCount(): Promise<number> {
  const { count, error } = await supabase
    .from("grants")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  if (error) return 0;
  return count ?? 0;
}

// ---------------------------------------------------------------------------
// Installer queries
// ---------------------------------------------------------------------------

export async function getInstallers(): Promise<Installer[]> {
  const { data, error } = await supabase
    .from("installers")
    .select("*")
    .order("company_name", { ascending: true });

  if (error) {
    console.error("getInstallers error:", error.message);
    return [];
  }

  // Sort premium first, then alphabetical
  const all = (data ?? []).map(toInstaller);
  return all.sort((a, b) => {
    if (a.tier === "premium" && b.tier !== "premium") return -1;
    if (a.tier !== "premium" && b.tier === "premium") return 1;
    return a.companyName.localeCompare(b.companyName);
  });
}

export async function getInstallerBySlug(slug: string): Promise<Installer | null> {
  const { data, error } = await supabase
    .from("installers")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return toInstaller(data);
}

// ---------------------------------------------------------------------------
// Lead creation
// ---------------------------------------------------------------------------

export async function createLead(input: {
  grantId?: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  zipCode: string;
  hardwareType?: string;
  fleetSize?: number;
  numPorts?: number;
  sourcePage?: string;
}) {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      grant_id: input.grantId || null,
      company_name: input.companyName,
      contact_name: input.contactName,
      email: input.email,
      phone: input.phone,
      zip_code: input.zipCode,
      hardware_type: input.hardwareType || null,
      fleet_size: input.fleetSize || null,
      num_ports: input.numPorts || null,
      source_page: input.sourcePage || null,
    })
    .select()
    .single();

  if (error) {
    console.error("createLead error:", error.message);
    throw new Error("Failed to save lead");
  }

  return data;
}

// ---------------------------------------------------------------------------
// Featured grants for homepage
// ---------------------------------------------------------------------------

export async function getFeaturedGrants(limit = 3) {
  const { data, error } = await supabase
    .from("grants")
    .select("*")
    .eq("status", "active")
    .order("amount_max", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map(toGrant);
}

// ---------------------------------------------------------------------------
// Contractor queries
// ---------------------------------------------------------------------------

function toContractor(row: Record<string, unknown>): Contractor {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    tagline: row.tagline as string | null,
    location: row.location as string | null,
    state: row.state as string | null,
    city: row.city as string | null,
    serviceArea: (row.service_area as string[]) ?? [],
    specialties: (row.specialties as string[]) ?? [],
    certifications: (row.certifications as Record<string, boolean>) ?? {},
    licenseNumber: row.license_number as string | null,
    rating: row.rating != null ? Number(row.rating) : null,
    reviewCount: (row.review_count as number) ?? 0,
    tier: row.tier as Contractor["tier"],
    description: row.description as string | null,
    phone: row.phone as string | null,
    email: row.email as string | null,
    website: row.website as string | null,
    createdAt: row.created_at ? new Date(row.created_at as string) : null,
    updatedAt: row.updated_at ? new Date(row.updated_at as string) : null,
  };
}

export interface ContractorFilters {
  state?: string;
  tier?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ContractorsResult {
  contractors: Contractor[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getContractors(
  filters: ContractorFilters = {}
): Promise<ContractorsResult> {
  const { state, tier, search, page = 1, limit = 20 } = filters;

  let query = supabase.from("contractors").select("*", { count: "exact" });

  if (state) {
    query = query.eq("state", state.toUpperCase());
  }

  if (tier) {
    query = query.eq("tier", tier);
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,city.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  const offset = (page - 1) * limit;
  query = query
    .range(offset, offset + limit - 1)
    .order("tier", { ascending: false }) // enterprise > verified > standard
    .order("name", { ascending: true });

  const { data, count, error } = await query;

  if (error) {
    console.error("getContractors error:", error.message);
    return { contractors: [], total: 0, page, totalPages: 0 };
  }

  return {
    contractors: (data ?? []).map(toContractor),
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}

export async function getContractorBySlug(slug: string): Promise<Contractor | null> {
  const { data, error } = await supabase
    .from("contractors")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return toContractor(data);
}

/**
 * Upsert a contractor record by slug.
 * Updates all fields except id and created_at if the slug already exists.
 */
export async function upsertContractor(input: NormalizedContractor): Promise<void> {
  const { error } = await supabase.from("contractors").upsert(
    {
      slug: input.slug,
      name: input.name,
      tagline: input.tagline,
      location: input.location,
      state: input.state,
      city: input.city,
      service_area: input.serviceArea,
      specialties: input.specialties,
      certifications: input.certifications,
      license_number: input.licenseNumber,
      rating: input.rating,
      review_count: input.reviewCount,
      tier: input.tier,
      description: input.description,
      phone: input.phone,
      email: input.email,
      website: input.website,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug" }
  );

  if (error) {
    throw new Error(`upsertContractor failed for slug "${input.slug}": ${error.message}`);
  }
}
