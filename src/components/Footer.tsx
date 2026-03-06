import Link from "next/link";

const footerColumns = [
  {
    title: "Platform",
    links: [
      { label: "Contractor Directory", href: "/contractors" },
      { label: "Hardware OEMs", href: "/hardware" },
      { label: "ROI Calculator", href: "/roi-calculator" },
      { label: "Pricing", href: "/pricing" },
      { label: "Get a Quote", href: "/quote" },
    ],
  },
  {
    title: "For Contractors",
    links: [
      { label: "List Your Business", href: "/contractors/register" },
      { label: "Lead Generation", href: "/contractors/leads" },
      { label: "Verification Program", href: "/contractors/verification" },
      { label: "Contractor Dashboard", href: "/contractors/dashboard" },
      { label: "Success Stories", href: "/contractors/success-stories" },
    ],
  },
  {
    title: "For OEMs",
    links: [
      { label: "List Your Hardware", href: "/hardware/register" },
      { label: "Specification Sheets", href: "/hardware/specs" },
      { label: "Integration Partners", href: "/hardware/partners" },
      { label: "OEM Dashboard", href: "/hardware/dashboard" },
      { label: "Market Reports", href: "/hardware/reports" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "About CommercialEVHub", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "API Documentation", href: "/api-docs" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "CommercialEVHub",
  description:
    "B2B directory platform connecting commercial EV charging contractors, hardware OEMs, and facility managers.",
  url: "https://commercialevhub.com",
  email: "hello@commercialevhub.com",
  priceRange: "$$",
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  sameAs: [
    "https://linkedin.com/company/commercialevhub",
    "https://x.com/commercialevhub",
    "https://github.com/commercialevhub",
  ],
};

// Static JSON-LD string generated from hardcoded data only (no user input)
const localBusinessJsonLdString = JSON.stringify(localBusinessJsonLd);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative border-t border-border-color bg-bg-primary circuit-trace"
      role="contentinfo"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: localBusinessJsonLdString,
        }}
      />

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Top section: brand + columns */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-tight"
              aria-label="CommercialEVHub home"
            >
              {/* Lightning bolt icon */}
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-green to-accent-cyan shadow-lg shadow-accent-green/20 transition-shadow group-hover:shadow-accent-green/40">
                <svg
                  width="18"
                  height="22"
                  viewBox="0 0 18 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M10.5 1L1 13H9L7.5 21L17 9H9L10.5 1Z"
                    fill="#0B1120"
                    stroke="#0B1120"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-text-primary">
                Commercial
                <span className="text-accent-green">EV</span>
                Hub
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              The definitive B2B directory for commercial EV charging
              infrastructure. Connecting facility managers with verified
              contractors and hardware OEMs.
            </p>

            {/* Agent-Ready badge */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 px-3.5 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-cyan" />
              </span>
              <span className="font-mono text-xs font-medium text-accent-cyan">
                Agent-Ready Platform
              </span>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-primary">
                  {column.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-2.5" role="list">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-text-muted transition-colors hover:text-accent-green"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 border-t border-border-color" aria-hidden="true" />

        {/* Bottom row */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Copyright */}
          <p className="text-sm text-text-muted">
            &copy; {currentYear} CommercialEVHub. All rights reserved.
          </p>

          {/* Agent readiness info */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-text-muted" title="Machine-readable metadata available for AI agents">
              llms.txt
            </span>
            <span className="h-3 w-px bg-border-color" aria-hidden="true" />
            <span className="font-mono text-xs text-text-muted" title="Search engine crawling directives">
              robots.txt
            </span>
            <span className="h-3 w-px bg-border-color" aria-hidden="true" />
            <span className="font-mono text-xs text-text-muted" title="Structured data via JSON-LD">
              schema.org
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3" aria-label="Social media links">
            {/* LinkedIn */}
            <a
              href="https://linkedin.com/company/commercialevhub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-card hover:text-accent-green"
              aria-label="CommercialEVHub on LinkedIn"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>

            {/* X (Twitter) */}
            <a
              href="https://x.com/commercialevhub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-card hover:text-accent-green"
              aria-label="CommercialEVHub on X"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/commercialevhub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-card hover:text-accent-green"
              aria-label="CommercialEVHub on GitHub"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
