"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { contractors, type Contractor } from "@/data/contractors";

const SPECIALTIES = [
  "All Specialties",
  "DC Fast Charging",
  "Level 2",
  "Fleet",
  "Transit",
  "Multifamily",
  "Solar + Storage",
] as const;

const TIERS = ["All", "Enterprise", "Verified", "Standard"] as const;

function getUniqueStates(data: Contractor[]): string[] {
  const states = Array.from(new Set(data.map((c) => c.state)));
  states.sort();
  return states;
}

function tierBadgeClasses(tier: Contractor["tier"]): string {
  switch (tier) {
    case "enterprise":
      return "bg-accent-green/10 text-accent-green border border-accent-green/30";
    case "verified":
      return "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30";
    case "standard":
      return "bg-text-muted/10 text-text-secondary border border-text-muted/20";
  }
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${
            i < fullStars
              ? "text-accent-amber"
              : i === fullStars && hasHalf
                ? "text-accent-amber"
                : "text-text-muted/30"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          {i === fullStars && hasHalf ? (
            <>
              <defs>
                <linearGradient id={`half-${i}`}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#half-${i})`}
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </>
          ) : (
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          )}
        </svg>
      ))}
      <span className="ml-1 text-sm text-text-secondary">{rating.toFixed(1)}</span>
    </span>
  );
}

function CertBadge({ label, active }: { label: string; active: boolean }) {
  if (!active) return null;
  return (
    <span className="inline-flex items-center rounded-md bg-bg-secondary px-2 py-0.5 text-xs font-medium text-accent-green border border-accent-green/20">
      {label}
    </span>
  );
}

export default function ContractorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("All Specialties");
  const [tierFilter, setTierFilter] = useState<string>("All");

  const states = useMemo(() => getUniqueStates(contractors), []);

  const filteredContractors = useMemo(() => {
    return contractors.filter((c) => {
      const matchesSearch =
        searchQuery === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState =
        stateFilter === "All States" || c.state === stateFilter;

      const matchesSpecialty =
        specialtyFilter === "All Specialties" ||
        c.specialties.some((s) =>
          s.toLowerCase().includes(specialtyFilter.toLowerCase().replace("level 2", "level 2"))
        );

      const matchesTier =
        tierFilter === "All" || c.tier === tierFilter.toLowerCase();

      return matchesSearch && matchesState && matchesSpecialty && matchesTier;
    });
  }, [searchQuery, stateFilter, specialtyFilter, tierFilter]);

  return (
    <main className="min-h-screen bg-bg-primary grid-pattern">
      {/* Hero Section */}
      <section className="relative border-b border-border-color">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="animate-fade-up">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              Verified Electrical{" "}
              <span className="text-accent-green glow-text-green">Contractors</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-text-secondary">
              Every contractor is algorithmically verified through our multi-layer
              credentialing system -- license validation, insurance confirmation,
              EVITP certification checks, and Know Your Business (KYB) screening.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-0 z-30 border-b border-border-color bg-bg-primary/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border-color bg-bg-card py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-3">
              {/* State Dropdown */}
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="rounded-lg border border-border-color bg-bg-card px-3 py-2.5 text-sm text-text-primary focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan"
                aria-label="Filter by state"
              >
                <option>All States</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {/* Specialty Filter */}
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="rounded-lg border border-border-color bg-bg-card px-3 py-2.5 text-sm text-text-primary focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan"
                aria-label="Filter by specialty"
              >
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {/* Tier Filter */}
              <div className="flex items-center gap-1 rounded-lg border border-border-color bg-bg-card p-1">
                {TIERS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTierFilter(t)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      tierFilter === t
                        ? "bg-accent-green/15 text-accent-green"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <p className="text-sm text-text-muted">
          Showing{" "}
          <span className="font-medium text-text-secondary">
            {filteredContractors.length}
          </span>{" "}
          {filteredContractors.length === 1 ? "contractor" : "contractors"}
        </p>
      </div>

      {/* Contractor Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredContractors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="h-16 w-16 text-text-muted/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="mt-4 text-lg font-medium text-text-secondary">
              No contractors found
            </p>
            <p className="mt-1 text-sm text-text-muted">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredContractors.map((contractor, index) => (
              <article
                key={contractor.slug}
                className={`group relative rounded-xl border border-border-color bg-bg-card transition-all duration-300 hover:border-accent-green/30 hover:bg-bg-card-hover animate-fade-up`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="p-6">
                  {/* Header: Name + Tier */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-display text-lg font-semibold text-text-primary group-hover:text-accent-green transition-colors">
                        {contractor.name}
                      </h2>
                      <p className="mt-0.5 truncate text-sm text-text-muted">
                        {contractor.tagline}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${tierBadgeClasses(contractor.tier)} ${
                        contractor.tier === "enterprise" ? "pulse-badge" : ""
                      }`}
                    >
                      {contractor.tier}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="mt-4 flex items-center gap-1.5 text-sm text-text-secondary">
                    <svg
                      className="h-4 w-4 text-text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {contractor.location}
                  </div>

                  {/* Rating */}
                  <div className="mt-3">
                    <StarRating rating={contractor.rating} />
                    <span className="ml-2 text-xs text-text-muted">
                      ({contractor.reviewCount} reviews)
                    </span>
                  </div>

                  {/* Certification Badges */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <CertBadge label="EVITP" active={contractor.certifications.evitp} />
                    <CertBadge label="C-10" active={contractor.certifications.c10} />
                    <CertBadge label="COI Active" active={contractor.certifications.coiActive} />
                    <CertBadge label="KYB" active={contractor.certifications.kybVerified} />
                  </div>

                  {/* Divider */}
                  <div className="mt-4 border-t border-border-color" />

                  {/* Footer: Projects + CTA */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-mono text-lg font-bold text-accent-cyan">
                        {contractor.projectsCompleted}
                      </span>
                      <span className="ml-1 text-text-muted">projects</span>
                    </div>
                    <Link
                      href={`/contractors/${contractor.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-accent-green/30 bg-accent-green/5 px-4 py-2 text-sm font-medium text-accent-green transition-all hover:bg-accent-green/15 hover:border-accent-green/50"
                    >
                      View Profile
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
