"use client";

import { useState } from "react";
import Link from "next/link";

const propertyTypes = [
  {
    id: "multifamily",
    label: "Multifamily Housing",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="24" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9" y="12" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
        <rect x="19" y="12" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="19" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
        <rect x="19" y="19" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M14 28V24h4v4" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4 8L16 2L28 8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "retail",
    label: "Retail Center",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="10" width="26" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 10L8 4h16l5 6" stroke="currentColor" strokeWidth="1.5" />
        <rect x="12" y="20" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 10v4M16 10v4M24 10v4" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: "office",
    label: "Office / Workplace",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="8" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" />
        <rect x="18" y="8" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" />
        <rect x="10" y="14" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" />
        <rect x="18" y="14" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" />
        <rect x="10" y="20" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" />
        <rect x="18" y="20" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: "logistics",
    label: "Logistics Depot",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="12" width="28" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 12L16 4L30 12" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="18" width="6" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="20" y="18" width="6" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <path d="M14 22h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "fleet",
    label: "Fleet Facility",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="14" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 18h6l4 4v2H20" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="8" cy="26" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="25" cy="26" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 14V9h4v5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: "hospitality",
    label: "Hospitality",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="24" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 14h24" stroke="currentColor" strokeWidth="1.2" />
        <rect x="8" y="17" width="6" height="4" rx="0.5" stroke="currentColor" strokeWidth="1" />
        <rect x="18" y="17" width="6" height="4" rx="0.5" stroke="currentColor" strokeWidth="1" />
        <path d="M14 28v-5h4v5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M12 8V4h8v4" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: "other",
    label: "Other",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 10v8M12 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const portPresets = [4, 8, 16, 32, 64, 100];

const goals = [
  {
    id: "employee",
    label: "Employee Amenity",
    description: "Attract and retain talent with workplace charging",
  },
  {
    id: "public",
    label: "Public Revenue",
    description: "Generate revenue from public-access charging",
  },
  {
    id: "fleet",
    label: "Fleet Charging",
    description: "Electrify your commercial vehicle fleet",
  },
  {
    id: "tenant",
    label: "Tenant Amenity",
    description: "Add value for tenants and residents",
  },
];

export default function ProjectWizard() {
  const [step, setStep] = useState(1);
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [portCount, setPortCount] = useState<number | null>(null);
  const [goal, setGoal] = useState<string | null>(null);

  const isComplete = propertyType && portCount && goal;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Scope Your Project in 60 Seconds
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Tell us about your project and get matched with pre-vetted contractors and certified hardware instantly.
          </p>
        </div>

        <div className="relative rounded-2xl bg-bg-card gradient-border glow-green p-1">
          <div className="rounded-2xl bg-bg-card p-6 sm:p-10">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-10">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (s === 1) setStep(1);
                      if (s === 2 && propertyType) setStep(2);
                      if (s === 3 && propertyType && portCount) setStep(3);
                    }}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                      step === s
                        ? "bg-accent-green text-bg-primary"
                        : step > s
                        ? "bg-accent-green/20 text-accent-green"
                        : "bg-bg-secondary text-text-muted"
                    }`}
                  >
                    {step > s ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      s
                    )}
                  </button>
                  {s < 3 && (
                    <div
                      className={`h-0.5 w-12 sm:w-20 rounded-full transition-all duration-300 ${
                        step > s ? "bg-accent-green/40" : "bg-bg-secondary"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Property Type */}
            {step === 1 && (
              <div className="animate-fade-up">
                <h3 className="text-center text-xl font-semibold text-text-primary mb-8">
                  What type of property?
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setPropertyType(type.id);
                        setStep(2);
                      }}
                      className={`group relative flex flex-col items-center gap-3 rounded-xl p-5 transition-all duration-200 border ${
                        propertyType === type.id
                          ? "border-accent-green bg-accent-green/5 text-accent-green"
                          : "border-border-color bg-bg-secondary hover:border-accent-green/40 hover:bg-bg-card-hover text-text-secondary hover:text-accent-green"
                      }`}
                    >
                      <div className="transition-transform duration-200 group-hover:scale-110">
                        {type.icon}
                      </div>
                      <span className="text-sm font-medium text-center leading-tight">
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Port Count */}
            {step === 2 && (
              <div className="animate-fade-up">
                <h3 className="text-center text-xl font-semibold text-text-primary mb-8">
                  How many charging ports?
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 max-w-2xl mx-auto">
                  {portPresets.map((count) => (
                    <button
                      key={count}
                      onClick={() => {
                        setPortCount(count);
                        setStep(3);
                      }}
                      className={`relative flex flex-col items-center justify-center rounded-xl p-5 transition-all duration-200 border ${
                        portCount === count
                          ? "border-accent-cyan bg-accent-cyan/5 text-accent-cyan"
                          : "border-border-color bg-bg-secondary hover:border-accent-cyan/40 hover:bg-bg-card-hover text-text-secondary hover:text-accent-cyan"
                      }`}
                    >
                      <span className="text-2xl font-bold font-mono">
                        {count === 100 ? "100+" : count}
                      </span>
                      <span className="text-xs mt-1 text-text-muted">ports</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                  >
                    &larr; Back to property type
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Primary Goal */}
            {step === 3 && (
              <div className="animate-fade-up">
                <h3 className="text-center text-xl font-semibold text-text-primary mb-8">
                  Primary goal?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      className={`relative flex flex-col items-start rounded-xl p-5 transition-all duration-200 border text-left ${
                        goal === g.id
                          ? "border-accent-green bg-accent-green/5"
                          : "border-border-color bg-bg-secondary hover:border-accent-green/40 hover:bg-bg-card-hover"
                      }`}
                    >
                      <span
                        className={`text-base font-semibold mb-1 ${
                          goal === g.id ? "text-accent-green" : "text-text-primary"
                        }`}
                      >
                        {g.label}
                      </span>
                      <span className="text-sm text-text-muted">
                        {g.description}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                  >
                    &larr; Back to port count
                  </button>
                  {isComplete && (
                    <Link
                      href="/contractors"
                      className="inline-flex items-center gap-2 rounded-lg bg-accent-green px-8 py-3 text-base font-semibold text-bg-primary transition-all duration-200 hover:brightness-110 glow-green"
                    >
                      View Matched Solutions
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
