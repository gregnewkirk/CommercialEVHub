"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types & constants                                                   */
/* ------------------------------------------------------------------ */

interface FormData {
  /* Step 1 - Property */
  propertyType: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  /* Step 2 - Project */
  ports: string;
  chargerType: string;
  timeline: string;
  goal: string;
  /* Step 3 - Contact */
  company: string;
  contactName: string;
  email: string;
  phone: string;
  /* Step 4 */
  terms: boolean;
}

const initialFormData: FormData = {
  propertyType: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  ports: "",
  chargerType: "",
  timeline: "",
  goal: "",
  company: "",
  contactName: "",
  email: "",
  phone: "",
  terms: false,
};

const propertyTypes = [
  "Multifamily",
  "Retail",
  "Office",
  "Fleet Depot",
  "Hospitality",
  "Healthcare",
  "Municipal / Government",
  "Mixed Use",
];

const usStates = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];

const chargerTypes = ["Level 2", "DCFC", "Mix of Level 2 & DCFC"];
const timelines = [
  "Immediate",
  "1-3 months",
  "3-6 months",
  "6+ months",
];
const goals = [
  "Revenue Generation",
  "Employee/Tenant Amenity",
  "Fleet Operations",
  "Regulatory Compliance",
];

const stepLabels = [
  "Your Property",
  "Project Details",
  "Your Information",
  "Review & Submit",
];

/* ------------------------------------------------------------------ */
/*  Validation helpers                                                  */
/* ------------------------------------------------------------------ */

function validateStep(step: number, data: FormData): string[] {
  const errors: string[] = [];
  if (step === 0) {
    if (!data.propertyType) errors.push("propertyType");
    if (!data.city.trim()) errors.push("city");
    if (!data.state) errors.push("state");
    if (!data.zip.trim() || data.zip.length < 5) errors.push("zip");
  } else if (step === 1) {
    if (!data.ports.trim()) errors.push("ports");
    if (!data.chargerType) errors.push("chargerType");
    if (!data.timeline) errors.push("timeline");
    if (!data.goal) errors.push("goal");
  } else if (step === 2) {
    if (!data.company.trim()) errors.push("company");
    if (!data.contactName.trim()) errors.push("contactName");
    if (!data.email.trim() || !data.email.includes("@")) errors.push("email");
    if (!data.phone.trim()) errors.push("phone");
  } else if (step === 3) {
    if (!data.terms) errors.push("terms");
  }
  return errors;
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function QuotePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const hasError = useCallback(
    (field: string) => errors.includes(field),
    [errors]
  );

  function update(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => prev.filter((e) => e !== field));
  }

  function next() {
    const stepErrors = validateStep(step, form);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors([]);
    setStep((s) => Math.min(s + 1, 3));
  }

  function back() {
    setErrors([]);
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const stepErrors = validateStep(3, form);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }
    setSubmitted(true);
  }

  /* Shared input classes */
  const inputBase =
    "w-full rounded-lg border bg-bg-primary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1";
  const inputOk =
    "border-border-color focus:border-accent-green focus:ring-accent-green";
  const inputErr =
    "border-red-500/60 focus:border-red-400 focus:ring-red-400";

  function inputClass(field: string) {
    return `${inputBase} ${hasError(field) ? inputErr : inputOk}`;
  }

  /* ---------------------------------------------------------------- */
  /*  Success state                                                    */
  /* ---------------------------------------------------------------- */

  if (submitted) {
    return (
      <>
        <title>Quote Submitted | CommercialEVHub</title>
        <meta
          name="description"
          content="Your commercial EV charging project quote has been submitted."
        />
        <main className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
          <div className="mx-auto max-w-lg text-center animate-fade-up">
            {/* Success icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-green/10 glow-green">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                className="text-accent-green"
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
            </div>
            <h1 className="mt-8 font-display text-3xl font-bold text-text-primary">
              Quote Submitted!
            </h1>
            <p className="mt-4 text-text-secondary leading-relaxed">
              Your project has been submitted. Our matching engine will connect
              you with verified contractors within 24 hours. Check your email at{" "}
              <strong className="text-text-primary">{form.email}</strong> for
              updates.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/calculator"
                className="inline-flex items-center rounded-lg border border-border-color px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-accent-green/40 hover:text-accent-green"
              >
                Try ROI Calculator
              </Link>
              <Link
                href="/"
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-accent-green to-emerald-500 px-6 py-3 text-sm font-semibold text-bg-primary shadow-lg shadow-accent-green/20 transition-all hover:shadow-accent-green/40 hover:brightness-110"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Main form                                                        */
  /* ---------------------------------------------------------------- */

  return (
    <>
      <title>Get a Free Project Quote | CommercialEVHub</title>
      <meta
        name="description"
        content="Submit your commercial EV charging project details and get matched with verified contractors within 24 hours."
      />

      <main className="min-h-screen bg-bg-primary">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border-color">
          <div className="grid-pattern absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center animate-fade-up">
              <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
                Get a Free Project{" "}
                <span className="text-accent-green glow-text-green">Quote</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-text-secondary">
                Tell us about your project and we will match you with verified,
                certified EV charging contractors.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            {/* Progress Indicator */}
            <div className="mb-12 animate-fade-up">
              <div className="flex items-center justify-between">
                {stepLabels.map((label, idx) => (
                  <div
                    key={label}
                    className="flex flex-1 flex-col items-center text-center"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                        idx < step
                          ? "bg-accent-green text-bg-primary"
                          : idx === step
                          ? "bg-accent-green/20 text-accent-green ring-2 ring-accent-green"
                          : "bg-bg-card text-text-muted"
                      }`}
                    >
                      {idx < step ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M20 6L9 17L4 12" />
                        </svg>
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span
                      className={`mt-2 hidden text-xs font-medium sm:block ${
                        idx <= step ? "text-text-primary" : "text-text-muted"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              {/* Progress bar */}
              <div className="mt-4 h-1 w-full rounded-full bg-bg-card">
                <div
                  className="h-1 rounded-full bg-gradient-to-r from-accent-green to-accent-cyan transition-all duration-500"
                  style={{ width: `${((step + 1) / 4) * 100}%` }}
                />
              </div>
              <p className="mt-3 text-center text-xs text-text-muted">
                Step {step + 1} of 4 &mdash; {stepLabels[step]}
              </p>
            </div>

            {/* Form Card */}
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border-color bg-bg-card p-8 animate-fade-up animation-delay-100"
              noValidate
            >
              {/* ------- Step 1: Your Property ------- */}
              {step === 0 && (
                <fieldset>
                  <legend className="font-display text-xl font-bold text-text-primary mb-6">
                    Your Property
                  </legend>
                  <div className="space-y-5">
                    {/* Property Type */}
                    <div>
                      <label
                        htmlFor="q-property"
                        className="block text-sm font-medium text-text-secondary mb-2"
                      >
                        Property Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="q-property"
                        value={form.propertyType}
                        onChange={(e) => update("propertyType", e.target.value)}
                        className={inputClass("propertyType")}
                      >
                        <option value="">Select property type</option>
                        {propertyTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Address */}
                    <div>
                      <label
                        htmlFor="q-address"
                        className="block text-sm font-medium text-text-secondary mb-2"
                      >
                        Street Address
                      </label>
                      <input
                        id="q-address"
                        type="text"
                        placeholder="123 Main St"
                        value={form.address}
                        onChange={(e) => update("address", e.target.value)}
                        className={inputClass("address")}
                      />
                    </div>
                    {/* City + State */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="q-city"
                          className="block text-sm font-medium text-text-secondary mb-2"
                        >
                          City <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="q-city"
                          type="text"
                          placeholder="Los Angeles"
                          value={form.city}
                          onChange={(e) => update("city", e.target.value)}
                          className={inputClass("city")}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="q-state"
                          className="block text-sm font-medium text-text-secondary mb-2"
                        >
                          State <span className="text-red-400">*</span>
                        </label>
                        <select
                          id="q-state"
                          value={form.state}
                          onChange={(e) => update("state", e.target.value)}
                          className={inputClass("state")}
                        >
                          <option value="">Select state</option>
                          {usStates.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Zip */}
                    <div>
                      <label
                        htmlFor="q-zip"
                        className="block text-sm font-medium text-text-secondary mb-2"
                      >
                        Zip Code <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="q-zip"
                        type="text"
                        inputMode="numeric"
                        maxLength={5}
                        placeholder="90210"
                        value={form.zip}
                        onChange={(e) =>
                          update("zip", e.target.value.replace(/\D/g, ""))
                        }
                        className={inputClass("zip")}
                      />
                    </div>
                  </div>
                </fieldset>
              )}

              {/* ------- Step 2: Project Details ------- */}
              {step === 1 && (
                <fieldset>
                  <legend className="font-display text-xl font-bold text-text-primary mb-6">
                    Project Details
                  </legend>
                  <div className="space-y-5">
                    {/* Number of Ports */}
                    <div>
                      <label
                        htmlFor="q-ports"
                        className="block text-sm font-medium text-text-secondary mb-2"
                      >
                        Number of Charging Ports{" "}
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="q-ports"
                        type="number"
                        min={1}
                        max={500}
                        placeholder="e.g. 10"
                        value={form.ports}
                        onChange={(e) => update("ports", e.target.value)}
                        className={inputClass("ports")}
                      />
                    </div>
                    {/* Charger Type */}
                    <div>
                      <label
                        htmlFor="q-charger"
                        className="block text-sm font-medium text-text-secondary mb-2"
                      >
                        Charger Type Preference{" "}
                        <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="q-charger"
                        value={form.chargerType}
                        onChange={(e) => update("chargerType", e.target.value)}
                        className={inputClass("chargerType")}
                      >
                        <option value="">Select charger type</option>
                        {chargerTypes.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Timeline */}
                    <div>
                      <label
                        htmlFor="q-timeline"
                        className="block text-sm font-medium text-text-secondary mb-2"
                      >
                        Timeline <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="q-timeline"
                        value={form.timeline}
                        onChange={(e) => update("timeline", e.target.value)}
                        className={inputClass("timeline")}
                      >
                        <option value="">Select timeline</option>
                        {timelines.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Primary Goal */}
                    <div>
                      <label
                        htmlFor="q-goal"
                        className="block text-sm font-medium text-text-secondary mb-2"
                      >
                        Primary Goal <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="q-goal"
                        value={form.goal}
                        onChange={(e) => update("goal", e.target.value)}
                        className={inputClass("goal")}
                      >
                        <option value="">Select primary goal</option>
                        {goals.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </fieldset>
              )}

              {/* ------- Step 3: Your Information ------- */}
              {step === 2 && (
                <fieldset>
                  <legend className="font-display text-xl font-bold text-text-primary mb-6">
                    Your Information
                  </legend>
                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="q-company"
                        className="block text-sm font-medium text-text-secondary mb-2"
                      >
                        Company Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="q-company"
                        type="text"
                        placeholder="Acme Properties LLC"
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        className={inputClass("company")}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="q-contact"
                        className="block text-sm font-medium text-text-secondary mb-2"
                      >
                        Contact Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="q-contact"
                        type="text"
                        placeholder="Jane Smith"
                        value={form.contactName}
                        onChange={(e) => update("contactName", e.target.value)}
                        className={inputClass("contactName")}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="q-email"
                        className="block text-sm font-medium text-text-secondary mb-2"
                      >
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="q-email"
                        type="email"
                        placeholder="jane@acme.com"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className={inputClass("email")}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="q-phone"
                        className="block text-sm font-medium text-text-secondary mb-2"
                      >
                        Phone <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="q-phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className={inputClass("phone")}
                      />
                    </div>
                  </div>
                </fieldset>
              )}

              {/* ------- Step 4: Review & Submit ------- */}
              {step === 3 && (
                <fieldset>
                  <legend className="font-display text-xl font-bold text-text-primary mb-6">
                    Review &amp; Submit
                  </legend>

                  {/* Summary */}
                  <div className="space-y-4">
                    <SummarySection title="Property">
                      <SummaryRow label="Type" value={form.propertyType} />
                      {form.address && (
                        <SummaryRow label="Address" value={form.address} />
                      )}
                      <SummaryRow
                        label="Location"
                        value={`${form.city}, ${form.state} ${form.zip}`}
                      />
                    </SummarySection>

                    <SummarySection title="Project">
                      <SummaryRow
                        label="Ports"
                        value={form.ports}
                      />
                      <SummaryRow label="Charger" value={form.chargerType} />
                      <SummaryRow label="Timeline" value={form.timeline} />
                      <SummaryRow label="Goal" value={form.goal} />
                    </SummarySection>

                    <SummarySection title="Contact">
                      <SummaryRow label="Company" value={form.company} />
                      <SummaryRow label="Name" value={form.contactName} />
                      <SummaryRow label="Email" value={form.email} />
                      <SummaryRow label="Phone" value={form.phone} />
                    </SummarySection>
                  </div>

                  {/* Terms */}
                  <div className="mt-8">
                    <label
                      className={`flex items-start gap-3 cursor-pointer ${
                        hasError("terms") ? "text-red-400" : "text-text-secondary"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.terms}
                        onChange={(e) => update("terms", e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-border-color accent-accent-green"
                      />
                      <span className="text-sm leading-relaxed">
                        I agree to the{" "}
                        <span className="text-accent-green underline">
                          Terms of Service
                        </span>{" "}
                        and{" "}
                        <span className="text-accent-green underline">
                          Privacy Policy
                        </span>
                        . I consent to being contacted by matched contractors
                        regarding this project.
                      </span>
                    </label>
                    {hasError("terms") && (
                      <p className="mt-2 text-xs text-red-400">
                        You must accept the terms to submit.
                      </p>
                    )}
                  </div>
                </fieldset>
              )}

              {/* Error summary */}
              {errors.length > 0 && (
                <p className="mt-4 text-sm text-red-400" role="alert">
                  Please fill in all required fields highlighted above.
                </p>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex items-center justify-between">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={back}
                    className="inline-flex items-center rounded-lg border border-border-color px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-accent-green/40 hover:text-accent-green"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                      aria-hidden="true"
                    >
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-accent-green to-emerald-500 px-6 py-3 text-sm font-semibold text-bg-primary shadow-lg shadow-accent-green/20 transition-all hover:shadow-accent-green/40 hover:brightness-110"
                  >
                    Next
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
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-accent-green to-emerald-500 px-8 py-3 text-sm font-semibold text-bg-primary shadow-lg shadow-accent-green/20 transition-all hover:shadow-accent-green/40 hover:brightness-110"
                  >
                    Submit Quote Request
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
                      <path d="M20 6L9 17L4 12" />
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Review summary helpers                                              */
/* ------------------------------------------------------------------ */

function SummarySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border-color bg-bg-primary p-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-accent-cyan mb-3">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-muted">{label}</span>
      <span className="font-medium text-text-primary">{value}</span>
    </div>
  );
}
