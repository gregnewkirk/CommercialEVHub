import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { hardwareOEMs, type HardwareOEM, type Product } from "@/data/hardware";

/* ---------- Static generation helpers ---------- */

export function generateStaticParams() {
  return hardwareOEMs.map((oem) => ({ slug: oem.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const oem = hardwareOEMs.find((o) => o.slug === slug);
  if (!oem) return { title: "OEM Not Found" };

  return {
    title: `${oem.name} | Certified Hardware OEM | CommercialEVHub`,
    description: oem.tagline + " - " + oem.description.slice(0, 150),
    openGraph: {
      title: oem.name,
      description: oem.tagline,
      type: "website",
    },
  };
}

/* ---------- Helpers ---------- */

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

function CertificationBadge({
  label,
  active,
  detail,
}: {
  label: string;
  active: boolean;
  detail?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center rounded-xl border p-5 text-center transition-colors ${
        active
          ? "border-accent-cyan/30 bg-accent-cyan/5"
          : "border-border-color bg-bg-card opacity-40"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          active ? "bg-accent-cyan/15 text-accent-cyan pulse-badge" : "bg-bg-secondary text-text-muted"
        }`}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          {active ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
          )}
        </svg>
      </div>
      <span className={`mt-3 text-sm font-semibold ${active ? "text-accent-cyan" : "text-text-muted"}`}>
        {label}
      </span>
      {active && detail && (
        <span className="mt-1 text-xs text-text-muted">{detail}</span>
      )}
      {!active && <span className="mt-1 text-xs text-text-muted">Not certified</span>}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-xl border border-border-color bg-bg-card p-6 transition-all duration-300 hover:border-accent-cyan/30 hover:bg-bg-card-hover">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-text-primary">
          {product.name}
        </h3>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${
            product.type === "DCFC"
              ? "bg-accent-green/10 text-accent-green border-accent-green/25"
              : "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/25"
          }`}
        >
          {product.type}
        </span>
      </div>

      <dl className="mt-4 space-y-3">
        {/* Power Output */}
        <div className="flex items-center justify-between">
          <dt className="text-sm text-text-muted">Power Output</dt>
          <dd className="font-mono text-sm font-bold text-accent-amber">{product.powerOutput}</dd>
        </div>

        {/* Connectors */}
        <div className="flex items-center justify-between">
          <dt className="text-sm text-text-muted">Connectors</dt>
          <dd className="flex gap-1.5">
            {product.connectors.map((c) => (
              <span
                key={c}
                className={`rounded-full border px-2 py-0.5 text-xs font-medium ${connectorPillClasses(c)}`}
              >
                {c}
              </span>
            ))}
          </dd>
        </div>

        {/* Price Range */}
        <div className="flex items-center justify-between">
          <dt className="text-sm text-text-muted">Price Range</dt>
          <dd className="text-sm font-medium text-text-primary">{product.priceRange}</dd>
        </div>

        <div className="border-t border-border-color" />

        {/* Capabilities */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div
              className={`h-2 w-2 rounded-full ${
                product.networkCapable ? "bg-accent-green" : "bg-text-muted/30"
              }`}
            />
            <span className={`text-xs ${product.networkCapable ? "text-text-secondary" : "text-text-muted"}`}>
              Network Capable
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className={`h-2 w-2 rounded-full ${
                product.ocppCompliant ? "bg-accent-cyan" : "bg-text-muted/30"
              }`}
            />
            <span className={`text-xs ${product.ocppCompliant ? "text-text-secondary" : "text-text-muted"}`}>
              OCPP Compliant
            </span>
          </div>
        </div>
      </dl>
    </div>
  );
}

/* ---------- JSON-LD ---------- */

function buildJsonLd(oem: HardwareOEM) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: oem.name,
    description: oem.description,
    url: oem.website,
    foundingDate: String(oem.founded),
    address: {
      "@type": "PostalAddress",
      name: oem.headquarters,
    },
    brand: {
      "@type": "Brand",
      name: oem.name,
    },
    makesOffer: oem.products.map((product) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: product.name,
        category: product.type,
        description: `${product.powerOutput} ${product.type} charger with ${product.connectors.join(", ")} connectors`,
      },
    })),
  };
}

/* ---------- Page ---------- */

export default async function HardwareDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const oem = hardwareOEMs.find((o) => o.slug === slug);
  if (!oem) notFound();

  const jsonLd = buildJsonLd(oem);

  return (
    <>
      <script
        type="application/ld+json"
        /* Static data sourced from local constants -- safe for inline JSON-LD */
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-bg-primary grid-pattern">
        {/* Breadcrumb */}
        <nav className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-text-muted">
            <li>
              <Link href="/hardware" className="hover:text-accent-cyan transition-colors">
                Hardware
              </Link>
            </li>
            <li aria-hidden="true">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-text-secondary">{oem.name}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="border-b border-border-color">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="animate-fade-up">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${tierBadgeClasses(oem.tier)} ${
                    oem.tier === "enterprise" ? "pulse-badge" : ""
                  }`}
                >
                  {oem.tier}
                </span>
                <span className="rounded-full border border-border-color bg-bg-secondary px-3 py-1 text-xs text-text-muted">
                  Est. {oem.founded}
                </span>
                {oem.kybVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-accent-green/20 bg-accent-green/5 px-3 py-1 text-xs font-medium text-accent-green">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    KYB Verified
                  </span>
                )}
              </div>

              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
                {oem.name}
              </h1>
              <p className="mt-2 text-xl text-text-secondary">{oem.tagline}</p>

              <div className="mt-4 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <svg className="h-5 w-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {oem.headquarters}
                </div>
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <svg className="h-5 w-5 text-accent-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-mono">{oem.powerRange}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {oem.connectorTypes.map((ct) => (
                    <span
                      key={ct}
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${connectorPillClasses(ct)}`}
                    >
                      {ct}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Certification Badges */}
            <section className="animate-fade-up">
              <h2 className="font-display text-2xl font-bold text-text-primary">
                Certification <span className="text-accent-cyan">Status</span>
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <CertificationBadge
                  label="EPRI Listed"
                  active={oem.certifications.epriListed}
                  detail="Trusted Charger List"
                />
                <CertificationBadge
                  label="OCPP"
                  active={oem.certifications.ocppVersion !== ""}
                  detail={oem.certifications.ocppVersion || undefined}
                />
                <CertificationBadge
                  label="ENERGY STAR"
                  active={oem.certifications.energyStar}
                  detail="EPA Certified"
                />
                <CertificationBadge
                  label="UL Listed"
                  active={oem.certifications.ulListed}
                  detail="Safety Certified"
                />
                <CertificationBadge
                  label="NRTL Certified"
                  active={oem.certifications.nrtlCertified}
                  detail="National Recognition"
                />
              </div>
            </section>

            {/* Products */}
            <section className="animate-fade-up animation-delay-100">
              <h2 className="font-display text-2xl font-bold text-text-primary">
                Product <span className="text-accent-green">Lineup</span>
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                {oem.products.map((product) => (
                  <ProductCard key={product.name} product={product} />
                ))}
              </div>
            </section>

            {/* About */}
            <section className="animate-fade-up animation-delay-200">
              <h2 className="font-display text-2xl font-bold text-text-primary">About</h2>
              <div className="mt-4 rounded-xl border border-border-color bg-bg-card p-6">
                <p className="leading-relaxed text-text-secondary">{oem.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <svg className="h-4 w-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <a
                      href={oem.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-cyan hover:underline"
                    >
                      {oem.website.replace("https://", "")}
                    </a>
                  </div>
                  <span className="text-text-muted/30">|</span>
                  <span className="text-sm text-text-muted">
                    Category:{" "}
                    <span className="font-medium text-text-secondary">
                      {oem.category === "dcfc"
                        ? "DC Fast Charging"
                        : oem.category === "level2"
                          ? "Level 2"
                          : "Level 2 + DCFC"}
                    </span>
                  </span>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="animate-fade-up animation-delay-300">
              <div className="gradient-border rounded-2xl">
                <div className="rounded-2xl bg-bg-card p-8 text-center sm:p-12">
                  <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
                    Interested in{" "}
                    <span className="text-accent-green">{oem.name}</span> hardware?
                  </h2>
                  <p className="mx-auto mt-3 max-w-lg text-text-secondary">
                    Get pricing, lead times, and installation requirements for
                    your commercial EV project.
                  </p>
                  <Link
                    href="/quote"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent-green px-6 py-3 text-sm font-semibold text-bg-primary transition-all hover:bg-accent-green/90 hover:shadow-lg hover:shadow-accent-green/20"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Request Hardware Quote
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
