// Contractor normalization — transforms raw records from EVITP, state license DBs,
// and Google Places into the unified NormalizedContractor shape.

import { slugify } from "./normalize";

// Raw shapes from each source —————————————————————————————————————————————

export interface EVITPRawRecord {
  companyName: string;
  city: string;
  state: string;
  phone?: string;
  website?: string;
  certificationStatus: string; // "Certified" | "Active" | etc.
  sourceUrl: string;
}

export interface StateLicenseRawRecord {
  name: string;
  licenseNumber: string;
  city: string;
  state: string; // 2-letter
  phone?: string;
  status: string; // "Active" | "Expired" | "Inactive" | etc.
  licenseType: string; // "C-10" | "Electrical Contractor" | etc.
  sourceUrl: string;
  sourceName: string; // "CSLB" | "TDLR" | "DBPR" | "NYS" | "WA_LI"
}

export interface GooglePlacesRawRecord {
  name: string;
  formattedAddress: string;
  city: string;
  state: string;
  phone?: string;
  website?: string;
  rating?: number;
  userRatingsTotal?: number;
  placeId: string;
}

// Unified output shape —————————————————————————————————————————————————————

export interface NormalizedContractor {
  slug: string;
  name: string;
  tagline: string | null;
  location: string;       // "City, ST"
  state: string;          // 2-letter
  city: string;
  serviceArea: string[];  // [state] initially
  specialties: string[];  // derived from certifications
  certifications: {
    evitp: boolean;
    c10: boolean;          // CA electrical license or equivalent
    coiActive: boolean;
    licenseVerified: boolean;
  };
  licenseNumber: string | null;
  rating: number | null;
  reviewCount: number;
  tier: "standard" | "verified" | "enterprise";
  description: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  sourceUrl: string;
  sourceName: string;     // "EVITP" | "CSLB" | "TDLR" | "DBPR" | "NYS" | "WA_LI" | "Google Places"
}

// Helpers ——————————————————————————————————————————————————————————————————

function isActiveStatus(status: string): boolean {
  const s = status.trim().toLowerCase();
  return s === "active" || s === "certified" || s === "current" || s === "valid";
}

/**
 * Derive tier based on certification data.
 * enterprise: EVITP certified + active state license + COI on file
 * verified:   EVITP certified OR active state license verified
 * standard:   everything else
 */
function assignTier(certs: NormalizedContractor["certifications"]): NormalizedContractor["tier"] {
  const { evitp, c10, coiActive, licenseVerified } = certs;
  if (evitp && (c10 || licenseVerified) && coiActive) return "enterprise";
  if (evitp || licenseVerified) return "verified";
  return "standard";
}

/**
 * Build specialties list from certification flags.
 * These map to display-friendly labels on the frontend.
 */
function deriveSpecialties(certs: NormalizedContractor["certifications"]): string[] {
  const out: string[] = ["EV Charging Installation"];
  if (certs.evitp) out.push("EVITP Certified");
  if (certs.c10) out.push("Licensed Electrician");
  if (certs.coiActive) out.push("Insured");
  if (certs.licenseVerified) out.push("License Verified");
  return out;
}

/** Deduplicate slug — appends a suffix derived from license number or city to avoid collisions. */
export function buildSlug(name: string, city: string, licenseNumber?: string | null): string {
  const base = slugify(`${name} ${city}`);
  if (licenseNumber) {
    const suffix = licenseNumber.replace(/[^a-z0-9]/gi, "").toLowerCase().slice(-6);
    return `${base}-${suffix}`;
  }
  return base;
}

// Normalizers per source ————————————————————————————————————————————————————

export function normalizeEVITP(raw: EVITPRawRecord): NormalizedContractor {
  const isActive = isActiveStatus(raw.certificationStatus);
  const certs: NormalizedContractor["certifications"] = {
    evitp: isActive,
    c10: false,
    coiActive: false,
    licenseVerified: isActive,
  };

  return {
    slug: buildSlug(raw.companyName, raw.city),
    name: raw.companyName.trim(),
    tagline: "EVITP Certified EV Charging Installer",
    location: `${raw.city}, ${raw.state}`,
    state: raw.state.toUpperCase(),
    city: raw.city.trim(),
    serviceArea: [raw.state.toUpperCase()],
    specialties: deriveSpecialties(certs),
    certifications: certs,
    licenseNumber: null,
    rating: null,
    reviewCount: 0,
    tier: assignTier(certs),
    description: `${raw.companyName.trim()} is a licensed EV charging installer in ${raw.city}, ${raw.state}.`,
    phone: raw.phone ?? null,
    email: null,
    website: raw.website ?? null,
    sourceUrl: raw.sourceUrl,
    sourceName: "EVITP",
  };
}

export function normalizeStateLicense(raw: StateLicenseRawRecord): NormalizedContractor {
  const isActive = isActiveStatus(raw.status);
  const isC10 = raw.licenseType.toUpperCase().includes("C-10") ||
                raw.licenseType.toLowerCase().includes("electrical");
  const certs: NormalizedContractor["certifications"] = {
    evitp: false,
    c10: isC10 && isActive,
    coiActive: false,
    licenseVerified: isActive,
  };

  return {
    slug: buildSlug(raw.name, raw.city, raw.licenseNumber),
    name: raw.name.trim(),
    tagline: null,
    location: `${raw.city}, ${raw.state}`,
    state: raw.state.toUpperCase(),
    city: raw.city.trim(),
    serviceArea: [raw.state.toUpperCase()],
    specialties: deriveSpecialties(certs),
    certifications: certs,
    licenseNumber: raw.licenseNumber,
    rating: null,
    reviewCount: 0,
    tier: assignTier(certs),
    description: `${raw.name.trim()} is a licensed EV charging installer in ${raw.city}, ${raw.state}.`,
    phone: raw.phone ?? null,
    email: null,
    website: null,
    sourceUrl: raw.sourceUrl,
    sourceName: raw.sourceName,
  };
}

export function normalizeGooglePlaces(raw: GooglePlacesRawRecord): NormalizedContractor {
  const certs: NormalizedContractor["certifications"] = {
    evitp: false,
    c10: false,
    coiActive: false,
    licenseVerified: false,
  };

  return {
    slug: buildSlug(raw.name, raw.city),
    name: raw.name.trim(),
    tagline: null,
    location: `${raw.city}, ${raw.state}`,
    state: raw.state.toUpperCase(),
    city: raw.city.trim(),
    serviceArea: [raw.state.toUpperCase()],
    specialties: deriveSpecialties(certs),
    certifications: certs,
    licenseNumber: null,
    rating: raw.rating ?? null,
    reviewCount: raw.userRatingsTotal ?? 0,
    tier: "standard",
    description: `${raw.name.trim()} is a licensed EV charging installer in ${raw.city}, ${raw.state}.`,
    phone: raw.phone ?? null,
    email: null,
    website: raw.website ?? null,
    sourceUrl: `https://maps.google.com/?cid=${raw.placeId}`,
    sourceName: "Google Places",
  };
}
