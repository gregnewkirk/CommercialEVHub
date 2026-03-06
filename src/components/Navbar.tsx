"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/contractors", label: "Contractors" },
  { href: "/hardware", label: "Hardware OEMs" },
  { href: "/calculator", label: "ROI Calculator" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border-color bg-bg-primary/90 backdrop-blur-xl shadow-lg shadow-black/20"
          : "bg-bg-primary/70 backdrop-blur-md"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Primary navigation"
      >
        {/* Brand logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-display text-xl font-bold tracking-tight"
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

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-1 lg:flex" role="list">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-accent-green"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent-green"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          {/* Get a Quote CTA - desktop */}
          <Link
            href="/quote"
            className="hidden rounded-lg bg-gradient-to-r from-accent-green to-emerald-500 px-5 py-2.5 text-sm font-semibold text-bg-primary shadow-lg shadow-accent-green/20 transition-all hover:shadow-accent-green/40 hover:brightness-110 lg:inline-flex"
          >
            Get a Quote
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile slide-out panel */}
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out panel */}
      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] transform border-l border-border-color bg-bg-primary shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between border-b border-border-color px-5 py-4">
          <span className="font-display text-lg font-bold text-text-primary">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
            aria-label="Close menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Panel nav links */}
        <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                  isActive
                    ? "bg-accent-green/10 text-accent-green"
                    : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
                }`}
              >
                {isActive && (
                  <span
                    className="h-2 w-2 rounded-full bg-accent-green"
                    aria-hidden="true"
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Panel CTA */}
        <div className="absolute bottom-0 left-0 w-full border-t border-border-color p-4">
          <Link
            href="/quote"
            className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-accent-green to-emerald-500 px-5 py-3 text-base font-semibold text-bg-primary shadow-lg shadow-accent-green/20 transition-all hover:shadow-accent-green/40 hover:brightness-110"
          >
            Get a Quote
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
