"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { hardwareOEMs, type HardwareOEM } from "@/data/hardware";

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "DCFC", value: "dcfc" },
  { label: "Level 2", value: "level2" },
  { label: "Both", value: "both" },
] as const;

const CONNECTOR_TYPES = ["All", "CCS", "NACS", "CHAdeMO", "J1772"] as const;

const CERTIFICATIONS = [
  "All",
  "EPRI Listed",
  "OCPP Certified",
  "ENERGY STAR",
] as const;

function connectorPillClasses(connector: string): string {
  switch (connector) {
    case "CCS":
      return "bg-accent-green/10 text-accent-green border-accent-green/25";
    case "NACS":
      return "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/25";
    case "CHAdeMO":
      return "bg-accent-amber/10 text-accent-amber border-accent-amber/25";
    case "J1772":
      return "bg-purple-500/10 text-purple-400 border-purple-400/25";
    default:
      return "bg-text-muted/10 text-text-secondary border-text-muted/20";
  }
}

function tierBadgeClasses(tier: HardwareOEM["tier"]): string {
  switch (tier) {
    case "enterprise":
      return "bg-accent-green/10 text-accent-green border border-accent-green/30";
    case "verified":
      return "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30";
    case "standard":
      return "bg-text-muted/10 text-text-secondary border border-text-muted/20";
  }
}

function CertBadge({ label, active }: { label: string; active: boolean }) {
  if (!active) return null;
  return (
    <span className="inline-flex items-center rounded-md bg-bg-secondary px-2 py-0.5 text-xs font-medium text-accent-cyan border border-accent-cyan/20">
      {label}
    </span>
  );
}

export default function HardwarePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [connectorFilter, setConnectorFilter] = useState<string>("All");
  const [certFilter, setCertFilter] = useState<string>("All");

  const filteredOEMs = useMemo(() => {
    return hardwareOEMs.filter((oem) => {
      const matchesSearch =
        searchQuery === "" ||
        oem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        oem.tagline.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || oem.category === categoryFilter;

      const matchesConnector =
        connectorFilter === "All" ||
        oem.connectorTypes.includes(connectorFilter);

      let matchesCert = true;
      if (certFilter === "EPRI Listed") matchesCert = oem.certifications.epriListed;
      else if (certFilter === "OCPP Certified") matchesCert = oem.certifications.ocppVersion !== "";
      else if (certFilter === "ENERGY STAR") matchesCert = oem.certifications.energyStar;

      return matchesSearch && matchesCategory && matchesConnector && matchesCert;
    });
  }, [searchQuery, categoryFilter, connectorFilter, certFilter]);

  return (
    <main className="min-h-screen bg-bg-primary grid-pattern">
      {/* Hero Section */}
      <section className="relative border-b border-border-color">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="animate-fade-up">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              Certified Hardware{" "}
              <span className="text-accent-cyan glow-text-green">OEMs</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-text-secondary">
              Browse EPRI-listed, UL-certified, and OCPP-compliant charging
              hardware from the industry&apos;s leading manufacturers. Every product
              listing is verified against manufacturer specifications.
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
                placeholder="Search by manufacturer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border-color bg-bg-card py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="flex items-center gap-1 rounded-lg border border-border-color bg-bg-card p-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategoryFilter(cat.value)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      categoryFilter === cat.value
                        ? "bg-accent-cyan/15 text-accent-cyan"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Connector Type */}
              <select
                value={connectorFilter}
                onChange={(e) => setConnectorFilter(e.target.value)}
                className="rounded-lg border border-border-color bg-bg-card px-3 py-2.5 text-sm text-text-primary focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan"
                aria-label="Filter by connector type"
              >
                {CONNECTOR_TYPES.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct === "All" ? "All Connectors" : ct}
                  </option>
                ))}
              </select>

              {/* Certification Filter */}
              <select
                value={certFilter}
                onChange={(e) => setCertFilter(e.target.value)}
                className="rounded-lg border border-border-color bg-bg-card px-3 py-2.5 text-sm text-text-primary focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan"
                aria-label="Filter by certification"
              >
                {CERTIFICATIONS.map((cert) => (
                  <option key={cert} value={cert}>
                    {cert === "All" ? "All Certifications" : cert}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <p className="text-sm text-text-muted">
          Showing{" "}
          <span className="font-medium text-text-secondary">
            {filteredOEMs.length}
          </span>{" "}
          {filteredOEMs.length === 1 ? "manufacturer" : "manufacturers"}
        </p>
      </div>

      {/* OEM Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredOEMs.length === 0 ? (
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
              No manufacturers found
            </p>
            <p className="mt-1 text-sm text-text-muted">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOEMs.map((oem, index) => (
              <article
                key={oem.slug}
                className="group relative rounded-xl border border-border-color bg-bg-card transition-all duration-300 hover:border-accent-cyan/30 hover:bg-bg-card-hover animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="p-6">
                  {/* Header: Name + Tier */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-display text-lg font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
                        {oem.name}
                      </h2>
                      <p className="mt-0.5 truncate text-sm text-text-muted">
                        {oem.tagline}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${tierBadgeClasses(oem.tier)} ${
                        oem.tier === "enterprise" ? "pulse-badge" : ""
                      }`}
                    >
                      {oem.tier}
                    </span>
                  </div>

                  {/* Power Range */}
                  <div className="mt-4 flex items-center gap-1.5 text-sm text-text-secondary">
                    <svg
                      className="h-4 w-4 text-accent-amber"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="font-mono text-sm">{oem.powerRange}</span>
                  </div>

                  {/* Connector Types */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {oem.connectorTypes.map((ct) => (
                      <span
                        key={ct}
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${connectorPillClasses(ct)}`}
                      >
                        {ct}
                      </span>
                    ))}
                  </div>

                  {/* Certification Badges */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <CertBadge label="EPRI" active={oem.certifications.epriListed} />
                    <CertBadge label={oem.certifications.ocppVersion || "OCPP"} active={oem.certifications.ocppVersion !== ""} />
                    <CertBadge label="ENERGY STAR" active={oem.certifications.energyStar} />
                  </div>

                  {/* Divider */}
                  <div className="mt-4 border-t border-border-color" />

                  {/* Footer: Product Count + CTA */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-mono text-lg font-bold text-accent-green">
                        {oem.products.length}
                      </span>
                      <span className="ml-1 text-text-muted">
                        {oem.products.length === 1 ? "product" : "products"}
                      </span>
                    </div>
                    <Link
                      href={`/hardware/${oem.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5 px-4 py-2 text-sm font-medium text-accent-cyan transition-all hover:bg-accent-cyan/15 hover:border-accent-cyan/50"
                    >
                      View Products
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
