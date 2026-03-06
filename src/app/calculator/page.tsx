"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const propertyTypes = [
  "Multifamily",
  "Retail",
  "Office",
  "Fleet",
  "Hospitality",
] as const;

const states = [
  "California",
  "Texas",
  "Colorado",
  "New York",
  "Florida",
  "Washington",
  "Oregon",
  "Arizona",
  "Illinois",
  "Massachusetts",
  "New Jersey",
  "Georgia",
  "Virginia",
  "Maryland",
  "Nevada",
] as const;

const chargerTypes = ["Level 2", "DCFC", "Mix"] as const;
const goals = [
  "Revenue Generation",
  "Employee/Tenant Amenity",
  "Fleet Operations",
] as const;

type PropertyType = (typeof propertyTypes)[number];
type ChargerType = (typeof chargerTypes)[number];
type Goal = (typeof goals)[number];

/* ------------------------------------------------------------------ */
/*  State-specific incentive data (mock)                                */
/* ------------------------------------------------------------------ */

const stateIncentives: Record<string, { name: string; detail: string }[]> = {
  California: [
    { name: "CALeVIP", detail: "Up to $80,000 per DCFC port" },
    { name: "SDG&E Power Your Drive", detail: "Up to $4,500 per L2 port" },
    { name: "CPUC Make-Ready", detail: "Utility-funded infrastructure buildout" },
  ],
  Texas: [
    { name: "TCEQ DCFC Program", detail: "Up to $40,000 per DCFC port" },
    {
      name: "Texas VW Settlement",
      detail: "Grants for corridor fast charging",
    },
  ],
  Colorado: [
    { name: "Charge Ahead Colorado", detail: "Up to $9,000 per L2 port" },
    {
      name: "Xcel Energy EV Program",
      detail: "Rebates up to $20,000 per DCFC",
    },
  ],
  "New York": [
    { name: "NYSERDA EV Make-Ready", detail: "Up to $4,000 per L2 port" },
    {
      name: "Con Edison SmartCharge",
      detail: "Up to $50,000 per DCFC station",
    },
  ],
  Florida: [
    {
      name: "FL NEVI Program",
      detail: "Federal corridor DCFC funding",
    },
    {
      name: "FPL EVolution",
      detail: "Up to $3,500 per L2 port",
    },
  ],
  Washington: [
    { name: "WA Commerce Grants", detail: "Up to $60,000 per DCFC" },
    {
      name: "PSE Up & Go Electric",
      detail: "Up to $4,000 per L2 port",
    },
  ],
  Oregon: [
    { name: "Oregon CFP Credits", detail: "Revenue credits for kWh delivered" },
    { name: "PGE Fleet Partner", detail: "Up to $6,000 per L2 port" },
  ],
  Arizona: [
    {
      name: "AZ NEVI Program",
      detail: "Federally funded corridor DCFC",
    },
    {
      name: "APS EV Charging Pilot",
      detail: "Up to $2,500 per L2 port",
    },
  ],
  Illinois: [
    {
      name: "IL Rebuilding Act Grants",
      detail: "Up to $50,000 per DCFC station",
    },
    { name: "ComEd Charging Rebate", detail: "Up to $4,000 per L2 port" },
  ],
  Massachusetts: [
    { name: "MassEVIP", detail: "Up to $50,000 per DCFC port" },
    {
      name: "National Grid EV Program",
      detail: "Up to $3,800 per L2 port",
    },
  ],
  "New Jersey": [
    { name: "NJ It Pay$ to Plug In", detail: "Up to $4,000 per L2 port" },
    {
      name: "PSE&G Clean Energy",
      detail: "Up to $50,000 per DCFC station",
    },
  ],
  Georgia: [
    {
      name: "GA EPD NEVI",
      detail: "Federal corridor DCFC funding",
    },
    {
      name: "Georgia Power EV",
      detail: "Up to $2,000 per L2 port",
    },
  ],
  Virginia: [
    {
      name: "VA Clean Cities",
      detail: "Up to $40,000 per DCFC station",
    },
    {
      name: "Dominion Energy EV",
      detail: "Up to $3,000 per L2 port",
    },
  ],
  Maryland: [
    { name: "MD EVSE Rebate", detail: "Up to $4,000 per L2 port" },
    {
      name: "BGE EVsmart",
      detail: "Up to $45,000 per DCFC station",
    },
  ],
  Nevada: [
    { name: "NV Energy EV Program", detail: "Up to $3,000 per L2 port" },
    {
      name: "NV NEVI Program",
      detail: "Federal corridor DCFC funding",
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Cost/revenue estimation functions                                   */
/* ------------------------------------------------------------------ */

function estimateHardwareCost(
  ports: number,
  charger: ChargerType
): [number, number] {
  if (charger === "Level 2") return [ports * 4000, ports * 8000];
  if (charger === "DCFC") return [ports * 40000, ports * 120000];
  // Mix: half L2, half DCFC
  const l2 = Math.ceil(ports / 2);
  const dc = Math.floor(ports / 2);
  return [l2 * 4000 + dc * 40000, l2 * 8000 + dc * 120000];
}

function estimateInstallCost(hwLow: number, hwHigh: number): [number, number] {
  return [Math.round(hwLow * 0.5), Math.round(hwHigh * 1.0)];
}

function estimateAnnualRevenue(
  ports: number,
  charger: ChargerType,
  goal: Goal
): [number, number] {
  if (goal === "Fleet Operations" || goal === "Employee/Tenant Amenity") {
    return [0, 0];
  }
  if (charger === "Level 2") return [ports * 2000, ports * 3500];
  if (charger === "DCFC") return [ports * 3500, ports * 5000];
  const l2 = Math.ceil(ports / 2);
  const dc = Math.floor(ports / 2);
  return [l2 * 2000 + dc * 3500, l2 * 3500 + dc * 5000];
}

function estimatePayback(
  totalCostHigh: number,
  revenueLow: number,
  revenueHigh: number
): string {
  if (revenueLow === 0) return "N/A (non-revenue)";
  const avgRevenue = (revenueLow + revenueHigh) / 2;
  const years = totalCostHigh / avgRevenue;
  if (years < 1) return "< 1 year";
  if (years > 15) return "15+ years";
  return `${years.toFixed(1)} years`;
}

function estimateROI(
  totalCostAvg: number,
  revenueAvg: number,
  years: number = 5
): string {
  if (revenueAvg === 0) return "N/A";
  const roi = ((revenueAvg * years - totalCostAvg) / totalCostAvg) * 100;
  return `${roi.toFixed(0)}%`;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function CalculatorPage() {
  const [propertyType, setPropertyType] = useState<PropertyType>("Retail");
  const [state, setState] = useState<string>("California");
  const [zip, setZip] = useState<string>("");
  const [ports, setPorts] = useState<number>(10);
  const [chargerType, setChargerType] = useState<ChargerType>("Level 2");
  const [goal, setGoal] = useState<Goal>("Revenue Generation");
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => {
    const [hwLow, hwHigh] = estimateHardwareCost(ports, chargerType);
    const [instLow, instHigh] = estimateInstallCost(hwLow, hwHigh);
    const [revLow, revHigh] = estimateAnnualRevenue(ports, chargerType, goal);
    const totalLow = hwLow + instLow;
    const totalHigh = hwHigh + instHigh;
    const totalAvg = (totalLow + totalHigh) / 2;
    const revAvg = (revLow + revHigh) / 2;
    const payback = estimatePayback(totalHigh, revLow, revHigh);
    const roi = estimateROI(totalAvg, revAvg, 5);
    const incentives = stateIncentives[state] || [];

    return {
      hwLow,
      hwHigh,
      instLow,
      instHigh,
      revLow,
      revHigh,
      payback,
      roi,
      incentives,
    };
  }, [ports, chargerType, goal, state]);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setShowResults(true);
  }

  return (
    <>
      {/* Head metadata via Next.js generateMetadata equivalent for client pages */}
      <title>Commercial EV Charging ROI Calculator | CommercialEVHub</title>
      <meta
        name="description"
        content="Estimate hardware costs, installation costs, incentives, annual revenue, and payback period for your commercial EV charging project."
      />

      <main className="min-h-screen bg-bg-primary">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border-color">
          <div className="grid-pattern absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center animate-fade-up">
              <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
                Commercial EV Charging{" "}
                <span className="text-accent-green glow-text-green">
                  ROI Calculator
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-text-secondary">
                Estimate costs, incentives, and returns for your commercial EV
                charging deployment in under 60 seconds.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* ---- Input Form ---- */}
              <form
                onSubmit={handleCalculate}
                className="rounded-2xl border border-border-color bg-bg-card p-8 animate-fade-up"
              >
                <h2 className="font-display text-xl font-bold text-text-primary mb-8">
                  Project Details
                </h2>

                <div className="space-y-6">
                  {/* Property Type */}
                  <div>
                    <label
                      htmlFor="property-type"
                      className="block text-sm font-medium text-text-secondary mb-2"
                    >
                      Property Type
                    </label>
                    <select
                      id="property-type"
                      value={propertyType}
                      onChange={(e) =>
                        setPropertyType(e.target.value as PropertyType)
                      }
                      className="w-full rounded-lg border border-border-color bg-bg-primary px-4 py-3 text-sm text-text-primary focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
                    >
                      {propertyTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* State */}
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-text-secondary mb-2"
                    >
                      State
                    </label>
                    <select
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full rounded-lg border border-border-color bg-bg-primary px-4 py-3 text-sm text-text-primary focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
                    >
                      {states.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Zip Code */}
                  <div>
                    <label
                      htmlFor="zip"
                      className="block text-sm font-medium text-text-secondary mb-2"
                    >
                      Zip Code
                    </label>
                    <input
                      id="zip"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{5}"
                      maxLength={5}
                      placeholder="e.g. 90210"
                      value={zip}
                      onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
                      className="w-full rounded-lg border border-border-color bg-bg-primary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
                    />
                  </div>

                  {/* Number of Ports - Slider */}
                  <div>
                    <label
                      htmlFor="ports"
                      className="flex items-center justify-between text-sm font-medium text-text-secondary mb-2"
                    >
                      <span>Number of Ports</span>
                      <span className="font-mono text-accent-green">
                        {ports}
                      </span>
                    </label>
                    <input
                      id="ports"
                      type="range"
                      min={2}
                      max={200}
                      step={1}
                      value={ports}
                      onChange={(e) => setPorts(Number(e.target.value))}
                      className="w-full accent-accent-green"
                    />
                    <div className="flex justify-between text-xs text-text-muted mt-1">
                      <span>2</span>
                      <span>200</span>
                    </div>
                  </div>

                  {/* Charger Type */}
                  <div>
                    <label
                      htmlFor="charger-type"
                      className="block text-sm font-medium text-text-secondary mb-2"
                    >
                      Charger Type
                    </label>
                    <select
                      id="charger-type"
                      value={chargerType}
                      onChange={(e) =>
                        setChargerType(e.target.value as ChargerType)
                      }
                      className="w-full rounded-lg border border-border-color bg-bg-primary px-4 py-3 text-sm text-text-primary focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
                    >
                      {chargerTypes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Primary Goal */}
                  <div>
                    <label
                      htmlFor="goal"
                      className="block text-sm font-medium text-text-secondary mb-2"
                    >
                      Primary Goal
                    </label>
                    <select
                      id="goal"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value as Goal)}
                      className="w-full rounded-lg border border-border-color bg-bg-primary px-4 py-3 text-sm text-text-primary focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
                    >
                      {goals.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Calculate Button */}
                <button
                  type="submit"
                  className="mt-8 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-accent-green to-emerald-500 px-6 py-3.5 text-sm font-semibold text-bg-primary shadow-lg shadow-accent-green/20 transition-all hover:shadow-accent-green/40 hover:brightness-110"
                >
                  Calculate ROI
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
                </button>
              </form>

              {/* ---- Results Dashboard ---- */}
              <div className="animate-fade-up animation-delay-200">
                {!showResults ? (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border-color bg-bg-card/50 p-12">
                    <div className="text-center">
                      {/* Calculator icon */}
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="mx-auto mb-4 text-text-muted"
                        aria-hidden="true"
                      >
                        <rect
                          x="4"
                          y="2"
                          width="16"
                          height="20"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <rect
                          x="8"
                          y="6"
                          width="8"
                          height="4"
                          rx="1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <circle cx="9" cy="14" r="1" fill="currentColor" />
                        <circle cx="12" cy="14" r="1" fill="currentColor" />
                        <circle cx="15" cy="14" r="1" fill="currentColor" />
                        <circle cx="9" cy="18" r="1" fill="currentColor" />
                        <circle cx="12" cy="18" r="1" fill="currentColor" />
                        <circle cx="15" cy="18" r="1" fill="currentColor" />
                      </svg>
                      <p className="text-text-muted text-sm">
                        Fill in your project details and click{" "}
                        <strong className="text-text-secondary">
                          Calculate ROI
                        </strong>{" "}
                        to see your estimates.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="font-display text-xl font-bold text-text-primary">
                      Your Estimated Results
                    </h2>

                    {/* Result Cards Grid */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Hardware Cost */}
                      <div className="rounded-xl border border-border-color bg-bg-card p-5 glow-green">
                        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                          Hardware Cost
                        </p>
                        <p className="mt-2 font-display text-2xl font-bold text-accent-green">
                          {formatCurrency(results.hwLow)} &ndash;{" "}
                          {formatCurrency(results.hwHigh)}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          {ports} port{ports > 1 ? "s" : ""} &middot;{" "}
                          {chargerType}
                        </p>
                      </div>

                      {/* Installation Cost */}
                      <div className="rounded-xl border border-border-color bg-bg-card p-5 glow-cyan">
                        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                          Installation Cost
                        </p>
                        <p className="mt-2 font-display text-2xl font-bold text-accent-cyan">
                          {formatCurrency(results.instLow)} &ndash;{" "}
                          {formatCurrency(results.instHigh)}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          50-100% of hardware
                        </p>
                      </div>

                      {/* Annual Revenue */}
                      <div className="rounded-xl border border-border-color bg-bg-card p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                          Est. Annual Revenue
                        </p>
                        <p className="mt-2 font-display text-2xl font-bold text-text-primary">
                          {results.revLow === 0
                            ? "N/A"
                            : `${formatCurrency(results.revLow)} \u2013 ${formatCurrency(results.revHigh)}`}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          {goal === "Revenue Generation"
                            ? "Public/retail scenario"
                            : goal}
                        </p>
                      </div>

                      {/* Payback Period */}
                      <div className="rounded-xl border border-border-color bg-bg-card p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                          Payback Period
                        </p>
                        <p className="mt-2 font-display text-2xl font-bold text-text-primary">
                          {results.payback}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          Before incentives
                        </p>
                      </div>

                      {/* ROI */}
                      <div className="rounded-xl border border-accent-green/30 bg-bg-card p-5 sm:col-span-2 glow-green">
                        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                          Estimated 5-Year ROI
                        </p>
                        <p className="mt-2 font-display text-3xl font-bold text-accent-green">
                          {results.roi}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          Before applicable incentives and tax credits
                        </p>
                      </div>
                    </div>

                    {/* Incentives */}
                    {results.incentives.length > 0 && (
                      <div className="rounded-xl border border-accent-cyan/20 bg-bg-card p-6">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-accent-cyan">
                          {/* Sparkle icon */}
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          Available Incentives in {state}
                        </h3>
                        <ul className="mt-4 space-y-3" role="list">
                          {results.incentives.map((inc) => (
                            <li
                              key={inc.name}
                              className="flex items-start gap-3"
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="mt-0.5 shrink-0 text-accent-green"
                                aria-hidden="true"
                              >
                                <path
                                  d="M20 6L9 17L4 12"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div>
                                <span className="text-sm font-medium text-text-primary">
                                  {inc.name}
                                </span>
                                <span className="ml-2 text-sm text-text-secondary">
                                  &mdash; {inc.detail}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Disclaimer */}
                    <p className="text-xs text-text-muted leading-relaxed">
                      * These estimates are for planning purposes only and based
                      on industry averages. Actual costs, revenue, and
                      incentives vary by location, utility, vendor, and project
                      scope. Contact our team for a detailed, site-specific
                      analysis.
                    </p>

                    {/* CTA */}
                    <Link
                      href="/quote"
                      className="flex items-center justify-center rounded-lg bg-gradient-to-r from-accent-green to-emerald-500 px-8 py-3.5 text-sm font-semibold text-bg-primary shadow-lg shadow-accent-green/20 transition-all hover:shadow-accent-green/40 hover:brightness-110"
                    >
                      Get Expert Consultation
                      <svg
                        width="16"
                        height="16"
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
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
