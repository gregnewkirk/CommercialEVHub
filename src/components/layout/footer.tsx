import Link from "next/link";
import { Zap } from "lucide-react";

const stateLinks = [
  { code: "CA", name: "California" },
  { code: "NY", name: "New York" },
  { code: "TX", name: "Texas" },
  { code: "FL", name: "Florida" },
  { code: "IL", name: "Illinois" },
  { code: "CO", name: "Colorado" },
  { code: "WA", name: "Washington" },
  { code: "MA", name: "Massachusetts" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-light">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Browse Grants */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Browse Grants
            </h3>
            <ul className="mt-3 space-y-2">
              {stateLinks.map((state) => (
                <li key={state.code}>
                  <Link
                    href={`/grants/state/${state.code.toLowerCase()}`}
                    className="text-sm text-white/50 transition-colors hover:text-white/80"
                  >
                    {state.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/grants"
                  className="text-sm font-medium text-ev-green/80 transition-colors hover:text-ev-green"
                >
                  View All States
                </Link>
              </li>
            </ul>
          </div>

          {/* Contractors & Hardware */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Find Contractors
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/contractors" className="text-sm text-white/50 transition-colors hover:text-white/80">
                  Contractor Directory
                </Link>
              </li>
              <li>
                <Link href="/hardware" className="text-sm text-white/50 transition-colors hover:text-white/80">
                  Hardware OEMs
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-sm text-white/50 transition-colors hover:text-white/80">
                  ROI Calculator
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-white/50 transition-colors hover:text-white/80">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Installers */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              For Installers
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/portal" className="text-sm text-white/50 transition-colors hover:text-white/80">
                  Installer Portal
                </Link>
              </li>
              <li>
                <Link href="/installers" className="text-sm text-white/50 transition-colors hover:text-white/80">
                  Installer Directory
                </Link>
              </li>
              <li>
                <Link href="/portal" className="text-sm text-white/50 transition-colors hover:text-white/80">
                  List Your Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Legal
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-white/50 transition-colors hover:text-white/80">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-white/50 transition-colors hover:text-white/80">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-ev-green" />
            <span className="text-sm font-semibold text-white/80">
              Commercial<span className="text-ev-green">EVHub</span>.com
            </span>
          </div>
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} CommercialEVHub.com. All rights reserved.
            Grant data is informational only &mdash; verify with program administrators.
          </p>
        </div>
      </div>
    </footer>
  );
}
