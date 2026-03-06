import Link from "next/link";
import { contractors } from "@/data/contractors";
import { hardwareOEMs } from "@/data/hardware";
import ProjectWizard from "@/components/ProjectWizard";

/* ------------------------------------------------------------------ */
/*  Helper: Star Rating                                                */
/* ------------------------------------------------------------------ */
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill={i < fullStars ? "#F59E0B" : i === fullStars && hasHalf ? "url(#half)" : "none"}
          stroke="#F59E0B"
          strokeWidth="1.5"
        >
          {i === fullStars && hasHalf && (
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
          )}
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 13.77 5.06 16.7l.94-5.49-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Helper: Tier Badge                                                 */
/* ------------------------------------------------------------------ */
function TierBadge({ tier }: { tier: "standard" | "verified" | "enterprise" }) {
  const styles = {
    standard: "bg-text-muted/10 text-text-muted border-text-muted/20",
    verified: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20",
    enterprise: "bg-accent-green/10 text-accent-green border-accent-green/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${styles[tier]}`}
    >
      {tier === "enterprise" && (
        <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0l2 5h5.5L11 8.5l1.5 5.5L8 11 3.5 14 5 8.5.5 5H6L8 0z" />
        </svg>
      )}
      {tier}
    </span>
  );
}

/* ================================================================== */
/*  HOMEPAGE                                                           */
/* ================================================================== */
export default function Home() {
  const topContractors = contractors.slice(0, 3);
  const topHardware = hardwareOEMs.slice(0, 3);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* ============================================================ */}
      {/*  1. HERO SECTION                                             */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden grid-pattern">
        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-primary via-transparent to-bg-primary" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,229,160,0.08),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.1] animate-fade-up">
            The Definitive Commercial{" "}
            <span className="text-accent-green glow-text-green">EV Charging</span>{" "}
            Directory
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-text-secondary animate-fade-up animation-delay-100">
            Eliminate procurement friction. Match with vetted electrical contractors
            and certified hardware OEMs for your commercial property -- from
            multifamily housing to fleet depots.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-200">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 rounded-lg bg-accent-green px-8 py-3.5 text-base font-semibold text-bg-primary transition-all duration-200 hover:brightness-110 glow-green"
            >
              Get a Free Quote
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/contractors"
              className="inline-flex items-center gap-2 rounded-lg border border-border-color px-8 py-3.5 text-base font-semibold text-text-primary transition-all duration-200 hover:border-accent-green/40 hover:bg-bg-card"
            >
              Browse Directory
            </Link>
          </div>

          {/* Animated Stats Bar */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 sm:divide-x sm:divide-border-color">
            <div className="flex flex-col items-center animate-fade-up animation-delay-200">
              <span className="font-display text-3xl sm:text-4xl font-bold text-accent-green">
                2,400+
              </span>
              <span className="mt-1 text-sm text-text-muted">
                Verified Contractors
              </span>
            </div>
            <div className="flex flex-col items-center animate-fade-up animation-delay-300">
              <span className="font-display text-3xl sm:text-4xl font-bold text-accent-cyan">
                800+
              </span>
              <span className="mt-1 text-sm text-text-muted">
                Certified Hardware Products
              </span>
            </div>
            <div className="flex flex-col items-center animate-fade-up animation-delay-400">
              <span className="font-display text-3xl sm:text-4xl font-bold text-accent-amber">
                $4.2B+
              </span>
              <span className="mt-1 text-sm text-text-muted">
                Projects Facilitated
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  2. PROJECT SCOPING WIZARD                                   */}
      {/* ============================================================ */}
      <ProjectWizard />

      {/* ============================================================ */}
      {/*  3. TRUST & VERIFICATION SECTION                             */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-secondary">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Algorithmically Guaranteed{" "}
              <span className="text-accent-cyan">Trust</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Every contractor and OEM in our directory passes a rigorous,
              continuously-monitored verification pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* KYB Verification */}
            <div className="relative rounded-xl bg-bg-card gradient-border p-8 transition-all duration-300 hover:bg-bg-card-hover">
              <div className="absolute top-6 right-6">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-green/10 border border-accent-green/20 px-2.5 py-1 text-xs font-semibold text-accent-green pulse-badge">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                  Verified
                </span>
              </div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-green/10 text-accent-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4" />
                  <path d="M12 3c-1.2 0-2.4.6-3 1.5A3.5 3.5 0 004 8v1a5.44 5.44 0 00-.5 2.5C3.5 16 7 20 12 21c5-1 8.5-5 8.5-9.5A5.44 5.44 0 0020 9V8a3.5 3.5 0 00-5-3.5A3.93 3.93 0 0012 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                KYB Verification
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Know-Your-Business verification confirms entity registration,
                active license status, and authorized signatories for every
                contractor in our network.
              </p>
            </div>

            {/* Real-Time COI Tracking */}
            <div className="relative rounded-xl bg-bg-card gradient-border p-8 transition-all duration-300 hover:bg-bg-card-hover">
              <div className="absolute top-6 right-6">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-green/10 border border-accent-green/20 px-2.5 py-1 text-xs font-semibold text-accent-green pulse-badge">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                  Verified
                </span>
              </div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-cyan/10 text-accent-cyan">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M7 8h10M7 12h6M7 16h8" />
                  <circle cx="18" cy="15" r="3" fill="none" />
                  <path d="M18 14v1.5l1 .5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Real-Time COI Tracking
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Certificate of Insurance monitoring runs continuously. Any lapse
                in coverage triggers automatic status updates and alerts --
                protecting property owners from liability gaps.
              </p>
            </div>

            {/* EVITP Certification */}
            <div className="relative rounded-xl bg-bg-card gradient-border p-8 transition-all duration-300 hover:bg-bg-card-hover">
              <div className="absolute top-6 right-6">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-green/10 border border-accent-green/20 px-2.5 py-1 text-xs font-semibold text-accent-green pulse-badge">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                  Verified
                </span>
              </div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-amber/10 text-accent-amber">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L4 7v5c0 5.25 3.4 10.15 8 11.25 4.6-1.1 8-6 8-11.25V7l-8-5z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                EVITP Certification Validation
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Electric Vehicle Infrastructure Training Program credentials are
                validated directly against the EVITP registry. Only contractors
                with active certifications earn our EVITP badge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  4. FEATURED CONTRACTORS PREVIEW                             */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-2">
                Top Verified{" "}
                <span className="text-accent-green">Contractors</span>
              </h2>
              <p className="text-text-secondary">
                Pre-vetted electrical contractors with active insurance and
                certifications.
              </p>
            </div>
            <Link
              href="/contractors"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-medium text-accent-cyan hover:text-accent-green transition-colors"
            >
              View all contractors
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topContractors.map((contractor) => (
              <article
                key={contractor.slug}
                className="group relative rounded-xl bg-bg-card gradient-border p-6 transition-all duration-300 hover:bg-bg-card-hover hover:glow-green"
              >
                {/* Tier + Rating */}
                <div className="flex items-center justify-between mb-4">
                  <TierBadge tier={contractor.tier} />
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={contractor.rating} />
                    <span className="text-xs text-text-muted">
                      ({contractor.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Name + Location */}
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-green transition-colors">
                  {contractor.name}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-text-muted">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.5-2-4.5-4.5-4.5z" />
                    <circle cx="8" cy="6" r="1.5" />
                  </svg>
                  {contractor.location}
                </p>

                {/* Specialties */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {contractor.specialties.slice(0, 3).map((spec) => (
                    <span
                      key={spec}
                      className="rounded-md bg-bg-secondary px-2 py-0.5 text-xs text-text-secondary border border-border-color"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Certs row */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {contractor.certifications.evitp && (
                    <span className="inline-flex items-center gap-1 text-xs text-accent-green">
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0l2 5h5.5L11 8.5l1.5 5.5L8 11 3.5 14 5 8.5.5 5H6L8 0z" />
                      </svg>
                      EVITP
                    </span>
                  )}
                  {contractor.certifications.kybVerified && (
                    <span className="inline-flex items-center gap-1 text-xs text-accent-cyan">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M3 5l1.5 1.5L7 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      KYB
                    </span>
                  )}
                  {contractor.certifications.coiActive && (
                    <span className="inline-flex items-center gap-1 text-xs text-accent-amber">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                        <circle cx="5" cy="5" r="4" />
                      </svg>
                      COI Active
                    </span>
                  )}
                </div>

                {/* Link */}
                <Link
                  href={`/contractors/${contractor.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-green hover:underline"
                >
                  View Profile
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  5. FEATURED HARDWARE PREVIEW                                */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-secondary">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-2">
                Certified Hardware{" "}
                <span className="text-accent-cyan">OEMs</span>
              </h2>
              <p className="text-text-secondary">
                UL-listed, OCPP-compliant charging equipment from trusted
                manufacturers.
              </p>
            </div>
            <Link
              href="/hardware"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-medium text-accent-cyan hover:text-accent-green transition-colors"
            >
              View all hardware
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topHardware.map((oem) => (
              <article
                key={oem.slug}
                className="group relative rounded-xl bg-bg-card gradient-border p-6 transition-all duration-300 hover:bg-bg-card-hover"
              >
                {/* Tier + KYB */}
                <div className="flex items-center justify-between mb-4">
                  <TierBadge tier={oem.tier} />
                  {oem.kybVerified && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-accent-green">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      KYB Verified
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
                  {oem.name}
                </h3>
                <p className="mt-1 text-sm text-text-muted">{oem.headquarters}</p>

                {/* Power Range */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-text-muted uppercase tracking-wider">
                    Power Range
                  </span>
                  <span className="font-mono text-sm text-accent-cyan font-medium">
                    {oem.powerRange}
                  </span>
                </div>

                {/* Connector Types */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {oem.connectorTypes.map((conn) => (
                    <span
                      key={conn}
                      className="rounded-md bg-bg-secondary px-2 py-0.5 text-xs text-text-secondary border border-border-color"
                    >
                      {conn}
                    </span>
                  ))}
                </div>

                {/* Certification Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {oem.certifications.ulListed && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-green/10 border border-accent-green/20 px-2 py-0.5 text-xs text-accent-green">
                      UL Listed
                    </span>
                  )}
                  {oem.certifications.energyStar && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 px-2 py-0.5 text-xs text-accent-cyan">
                      ENERGY STAR
                    </span>
                  )}
                  {oem.certifications.nrtlCertified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-amber/10 border border-accent-amber/20 px-2 py-0.5 text-xs text-accent-amber">
                      NRTL
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-bg-secondary border border-border-color px-2 py-0.5 text-xs text-text-secondary font-mono">
                    {oem.certifications.ocppVersion}
                  </span>
                </div>

                {/* Link */}
                <Link
                  href={`/hardware/${oem.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-cyan hover:underline"
                >
                  View Products
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  6. HOW IT WORKS                                             */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              How It Works
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              From project scoping to contractor deployment in three steps.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {/* Circuit trace connector (desktop only) */}
            <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-0.5">
              <svg
                className="w-full h-6"
                viewBox="0 0 600 24"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 12h180l6-6h28l6 6h180l6-6h28l6 6h160"
                  stroke="url(#circuit-grad)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="186" cy="6" r="3" fill="#0EA5E9" opacity="0.6" />
                <circle cx="414" cy="6" r="3" fill="#0EA5E9" opacity="0.6" />
                <defs>
                  <linearGradient id="circuit-grad" x1="0" y1="0" x2="600" y2="0">
                    <stop offset="0%" stopColor="#00E5A0" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#00E5A0" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-card gradient-border">
                <span className="font-display text-2xl font-bold text-accent-green">
                  1
                </span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Describe Your Project
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                Use our project scoping wizard to specify property type, port
                count, and charging goals. Takes under 60 seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-card gradient-border">
                <span className="font-display text-2xl font-bold text-accent-cyan">
                  2
                </span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Get Matched Instantly
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                Our algorithm matches your requirements with verified contractors
                and certified hardware -- filtered by location, specialty, and
                capacity.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-card gradient-border">
                <span className="font-display text-2xl font-bold text-accent-green">
                  3
                </span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Deploy with Confidence
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                Work with KYB-verified, COI-tracked, EVITP-certified contractors.
                Monitor project milestones through your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  7. CTA SECTION                                              */}
      {/* ============================================================ */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,229,160,0.06),transparent)]" />
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-50" />

        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Ready to Electrify{" "}
            <span className="text-accent-green glow-text-green">
              Your Property
            </span>
            ?
          </h2>
          <p className="text-lg text-text-secondary mb-10 max-w-xl mx-auto">
            Join thousands of commercial property owners who have streamlined
            their EV charging procurement through CommercialEVHub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 rounded-lg bg-accent-green px-8 py-3.5 text-base font-semibold text-bg-primary transition-all duration-200 hover:brightness-110 glow-green"
            >
              Get a Free Quote
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/contractors"
              className="inline-flex items-center gap-2 rounded-lg border border-border-color px-8 py-3.5 text-base font-semibold text-text-primary transition-all duration-200 hover:border-accent-green/40 hover:bg-bg-card"
            >
              Explore the Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
