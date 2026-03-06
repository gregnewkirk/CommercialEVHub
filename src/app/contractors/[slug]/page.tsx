import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { contractors, type Contractor } from "@/data/contractors";

/* ---------- Static generation helpers ---------- */

export function generateStaticParams() {
  return contractors.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const contractor = contractors.find((c) => c.slug === slug);
  if (!contractor) return { title: "Contractor Not Found" };

  return {
    title: `${contractor.name} | Verified Contractor | CommercialEVHub`,
    description: contractor.tagline + " - " + contractor.description.slice(0, 150),
    openGraph: {
      title: contractor.name,
      description: contractor.tagline,
      type: "profile",
    },
  };
}

/* ---------- Helpers ---------- */

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
          className={`h-5 w-5 ${
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
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1.5 text-base text-text-secondary">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

function VerificationBadge({
  label,
  active,
  date,
}: {
  label: string;
  active: boolean;
  date?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center rounded-xl border p-5 text-center transition-colors ${
        active
          ? "border-accent-green/30 bg-accent-green/5"
          : "border-border-color bg-bg-card opacity-50"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          active ? "bg-accent-green/15 text-accent-green pulse-badge" : "bg-bg-secondary text-text-muted"
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
      <span className={`mt-3 text-sm font-semibold ${active ? "text-accent-green" : "text-text-muted"}`}>
        {label}
      </span>
      {active && date && (
        <span className="mt-1 text-xs text-text-muted">Verified {date}</span>
      )}
      {!active && <span className="mt-1 text-xs text-text-muted">Not verified</span>}
    </div>
  );
}

/* ---------- Timeline ---------- */

interface TimelineEntry {
  label: string;
  date: string;
  status: "verified" | "expires" | "pending";
}

function VerificationTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 h-full w-px bg-border-color" aria-hidden="true" />

      <ol className="space-y-6">
        {entries.map((entry, i) => (
          <li key={i} className="relative flex gap-4 pl-10">
            {/* Dot */}
            <div
              className={`absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 ${
                entry.status === "verified"
                  ? "border-accent-green bg-accent-green/30"
                  : entry.status === "expires"
                    ? "border-accent-amber bg-accent-amber/30"
                    : "border-text-muted bg-text-muted/30"
              }`}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium text-text-primary">{entry.label}</p>
              <time
                className={`text-xs ${
                  entry.status === "verified"
                    ? "text-accent-green"
                    : entry.status === "expires"
                      ? "text-accent-amber"
                      : "text-text-muted"
                }`}
                dateTime={entry.date}
              >
                {entry.status === "expires" ? "Expires " : ""}
                {new Date(entry.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- JSON-LD ---------- */

function buildJsonLd(contractor: Contractor) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: contractor.name,
    description: contractor.description,
    telephone: contractor.phone,
    email: contractor.email,
    url: contractor.website,
    address: {
      "@type": "PostalAddress",
      addressLocality: contractor.city,
      addressRegion: contractor.state,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: contractor.rating,
      reviewCount: contractor.reviewCount,
      bestRating: 5,
    },
    areaServed: contractor.serviceArea,
  };
}

/* ---------- Page ---------- */

export default async function ContractorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const contractor = contractors.find((c) => c.slug === slug);
  if (!contractor) notFound();

  const timelineEntries: TimelineEntry[] = [
    {
      label: "License Verified",
      date: contractor.licenseVerifiedDate,
      status: "verified",
    },
    {
      label: "Insurance Expiry",
      date: contractor.insuranceExpiryDate,
      status: "expires",
    },
    {
      label: "KYB Screening",
      date: contractor.licenseVerifiedDate,
      status: contractor.certifications.kybVerified ? "verified" : "pending",
    },
  ];

  const jsonLd = buildJsonLd(contractor);

  return (
    <>
      <script
        type="application/ld+json"
        /* Static data from local source -- safe for inline JSON-LD */
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-bg-primary grid-pattern">
        {/* Breadcrumb */}
        <nav className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-text-muted">
            <li>
              <Link href="/contractors" className="hover:text-accent-green transition-colors">
                Contractors
              </Link>
            </li>
            <li aria-hidden="true">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-text-secondary">{contractor.name}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="border-b border-border-color">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="animate-fade-up">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${tierBadgeClasses(contractor.tier)} ${
                    contractor.tier === "enterprise" ? "pulse-badge" : ""
                  }`}
                >
                  {contractor.tier}
                </span>
                <span className="text-sm text-text-muted">
                  License #{contractor.licenseNumber}
                </span>
              </div>

              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
                {contractor.name}
              </h1>
              <p className="mt-2 text-xl text-text-secondary">{contractor.tagline}</p>

              <div className="mt-4 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <svg className="h-5 w-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {contractor.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <StarRating rating={contractor.rating} />
                  <span className="text-sm text-text-muted">
                    ({contractor.reviewCount} reviews)
                  </span>
                </div>
                <div className="text-sm text-text-secondary">
                  <span className="font-mono text-lg font-bold text-accent-cyan">{contractor.projectsCompleted}</span>{" "}
                  projects completed
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Verification Badges */}
              <section className="animate-fade-up">
                <h2 className="font-display text-2xl font-bold text-text-primary">
                  Verification <span className="text-accent-green">Badges</span>
                </h2>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <VerificationBadge
                    label="EVITP Certified"
                    active={contractor.certifications.evitp}
                    date={contractor.certifications.evitp ? contractor.licenseVerifiedDate : undefined}
                  />
                  <VerificationBadge
                    label="C-10 Licensed"
                    active={contractor.certifications.c10}
                    date={contractor.certifications.c10 ? contractor.licenseVerifiedDate : undefined}
                  />
                  <VerificationBadge
                    label={`COI ${contractor.certifications.coiLimit}`}
                    active={contractor.certifications.coiActive}
                    date={contractor.certifications.coiActive ? contractor.insuranceExpiryDate : undefined}
                  />
                  <VerificationBadge
                    label="KYB Verified"
                    active={contractor.certifications.kybVerified}
                    date={contractor.certifications.kybVerified ? contractor.licenseVerifiedDate : undefined}
                  />
                </div>
              </section>

              {/* Verification Timeline */}
              <section className="animate-fade-up animation-delay-100">
                <h2 className="font-display text-2xl font-bold text-text-primary">
                  Verification <span className="text-accent-cyan">Timeline</span>
                </h2>
                <div className="mt-6 rounded-xl border border-border-color bg-bg-card p-6">
                  <VerificationTimeline entries={timelineEntries} />
                </div>
              </section>

              {/* About */}
              <section className="animate-fade-up animation-delay-200">
                <h2 className="font-display text-2xl font-bold text-text-primary">About</h2>
                <div className="mt-4 rounded-xl border border-border-color bg-bg-card p-6">
                  <p className="leading-relaxed text-text-secondary">{contractor.description}</p>
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                      Specialties
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {contractor.specialties.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-accent-cyan/20 bg-accent-cyan/5 px-3 py-1 text-xs font-medium text-accent-cyan"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Featured Projects */}
              {contractor.featuredProjects.length > 0 && (
                <section className="animate-fade-up animation-delay-300">
                  <h2 className="font-display text-2xl font-bold text-text-primary">
                    Featured <span className="text-accent-green">Projects</span>
                  </h2>
                  <div className="mt-6 overflow-hidden rounded-xl border border-border-color">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-border-color bg-bg-secondary">
                        <tr>
                          <th className="px-6 py-3 font-semibold text-text-muted uppercase tracking-wider text-xs">
                            Project
                          </th>
                          <th className="px-6 py-3 font-semibold text-text-muted uppercase tracking-wider text-xs">
                            Type
                          </th>
                          <th className="px-6 py-3 font-semibold text-text-muted uppercase tracking-wider text-xs text-right">
                            Ports
                          </th>
                          <th className="px-6 py-3 font-semibold text-text-muted uppercase tracking-wider text-xs">
                            Power Level
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-color bg-bg-card">
                        {contractor.featuredProjects.map((project) => (
                          <tr key={project.name} className="hover:bg-bg-card-hover transition-colors">
                            <td className="px-6 py-4 font-medium text-text-primary">
                              {project.name}
                            </td>
                            <td className="px-6 py-4 text-text-secondary">{project.type}</td>
                            <td className="px-6 py-4 text-right font-mono text-accent-cyan">
                              {project.ports}
                            </td>
                            <td className="px-6 py-4 text-text-secondary">{project.powerLevel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Service Area */}
              <section className="animate-fade-up animation-delay-400">
                <h2 className="font-display text-2xl font-bold text-text-primary">
                  Service <span className="text-accent-cyan">Area</span>
                </h2>
                <div className="mt-4 rounded-xl border border-border-color bg-bg-card p-6">
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {contractor.serviceArea.map((area) => (
                      <li key={area} className="flex items-center gap-2 text-sm text-text-secondary">
                        <svg
                          className="h-4 w-4 shrink-0 text-accent-green"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Contact Card */}
                <div className="rounded-xl border border-border-color bg-bg-card p-6 glow-green animate-fade-up animation-delay-100">
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    Contact Information
                  </h3>
                  <dl className="mt-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <dt>
                        <svg className="mt-0.5 h-5 w-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="sr-only">Phone</span>
                      </dt>
                      <dd className="text-sm text-text-secondary">{contractor.phone}</dd>
                    </div>
                    <div className="flex items-start gap-3">
                      <dt>
                        <svg className="mt-0.5 h-5 w-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="sr-only">Email</span>
                      </dt>
                      <dd className="text-sm text-accent-cyan break-all">{contractor.email}</dd>
                    </div>
                    <div className="flex items-start gap-3">
                      <dt>
                        <svg className="mt-0.5 h-5 w-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <span className="sr-only">Website</span>
                      </dt>
                      <dd>
                        <a
                          href={contractor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent-cyan hover:underline break-all"
                        >
                          {contractor.website.replace("https://", "")}
                        </a>
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6">
                    <Link
                      href="/quote"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-green px-4 py-3 text-sm font-semibold text-bg-primary transition-all hover:bg-accent-green/90 hover:shadow-lg hover:shadow-accent-green/20"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Request Quote
                    </Link>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="rounded-xl border border-border-color bg-bg-card p-6 animate-fade-up animation-delay-200">
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    Quick Stats
                  </h3>
                  <dl className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-text-muted">Years in Business</dt>
                      <dd className="font-mono text-sm font-bold text-text-primary">
                        {contractor.yearsInBusiness}
                      </dd>
                    </div>
                    <div className="border-t border-border-color" />
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-text-muted">Projects Completed</dt>
                      <dd className="font-mono text-sm font-bold text-accent-cyan">
                        {contractor.projectsCompleted}
                      </dd>
                    </div>
                    <div className="border-t border-border-color" />
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-text-muted">COI Coverage</dt>
                      <dd className="font-mono text-sm font-bold text-accent-green">
                        {contractor.certifications.coiLimit}
                      </dd>
                    </div>
                    <div className="border-t border-border-color" />
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-text-muted">Reviews</dt>
                      <dd className="font-mono text-sm font-bold text-text-primary">
                        {contractor.reviewCount}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
