import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Membership Plans | CommercialEVHub",
  description:
    "Choose the right CommercialEVHub membership plan for your business. From local installers to national EPCs and OEMs, get verified, get matched, and grow your commercial EV charging pipeline.",
  openGraph: {
    title: "Membership Plans | CommercialEVHub",
    description:
      "Enterprise-grade compliance verification and intelligent lead routing for commercial EV charging professionals.",
  },
};

const tiers = [
  {
    name: "Standard Directory",
    price: "$499",
    period: "/yr",
    target: "Local Electrical Installers, Emerging Hardware Brands",
    popular: false,
    enterprise: false,
    features: [
      "Basic algorithmic indexing",
      "Semantic SEO markup",
      "Public directory inclusion",
      "Manual compliance uploads",
      "Standard support via email",
    ],
    cta: "Get Started",
    ctaHref: "/quote",
  },
  {
    name: "Verified Professional",
    price: "$1,200",
    period: "/yr",
    target: "Regional C-10 Contractors, Established CPOs",
    popular: true,
    enterprise: false,
    features: [
      "Everything in Standard, plus:",
      "Real-time KYB monitoring",
      "Dynamic COI tracking",
      "Verified EVITP badge",
      "Priority regional matching",
      "Analytics dashboard access",
    ],
    cta: "Get Verified",
    ctaHref: "/quote",
  },
  {
    name: "Enterprise OEM & EPC",
    price: "$3,600",
    period: "/yr",
    target: "National EPC Firms, Tier 1 OEMs",
    popular: false,
    enterprise: true,
    features: [
      "Everything in Verified, plus:",
      "Full API access",
      "Automated national matchmaking",
      "AI-agent procurement integration",
      "Dedicated lead routing",
      "Custom onboarding & SLA",
    ],
    cta: "Contact Sales",
    ctaHref: "/quote",
  },
];

const faqs = [
  {
    question: "Can I switch plans mid-year?",
    answer:
      "Yes. You can upgrade at any time and we will pro-rate the difference for the remainder of your billing cycle. Downgrades take effect at the next renewal date.",
  },
  {
    question: "Do you offer monthly billing?",
    answer:
      "All plans are billed annually to provide the best value. For Enterprise customers, we can arrange quarterly invoicing upon request.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "We offer a 14-day preview of the Verified Professional tier so you can experience real-time compliance monitoring and priority matching before committing.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, ACH bank transfers, and wire transfers. Enterprise customers can also pay via purchase order with NET-30 terms.",
  },
  {
    question: "What happens if my compliance documents expire?",
    answer:
      "Our system sends automated reminders 60, 30, and 7 days before expiration. If a document lapses, your Verified badge is paused until updated documents are uploaded and re-verified.",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border-color">
        <div className="grid-pattern absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              Membership{" "}
              <span className="text-accent-green glow-text-green">Plans</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-text-secondary">
              Enterprise-grade compliance verification and intelligent lead
              routing -- built for every stage of your commercial EV business.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative py-20" aria-labelledby="pricing-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="pricing-heading" className="sr-only">
            Pricing tiers
          </h2>
          <div className="grid gap-8 lg:grid-cols-3">
            {tiers.map((tier, idx) => (
              <article
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border bg-bg-card p-8 animate-fade-up ${
                  tier.enterprise
                    ? "border-accent-green/40 glow-green"
                    : tier.popular
                    ? "border-accent-cyan/30"
                    : "border-border-color"
                } ${
                  idx === 0
                    ? "animation-delay-100"
                    : idx === 1
                    ? "animation-delay-200"
                    : "animation-delay-300"
                }`}
                style={
                  tier.enterprise
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(0,229,160,0.06) 0%, rgba(11,17,32,1) 60%)",
                      }
                    : undefined
                }
              >
                {/* Popular badge */}
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-cyan px-4 py-1 text-xs font-bold uppercase tracking-wider text-bg-primary">
                    Popular
                  </span>
                )}

                {/* Enterprise gradient border glow */}
                {tier.enterprise && (
                  <div
                    className="pointer-events-none absolute -inset-px rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(0,229,160,0.3), rgba(14,165,233,0.15), transparent)",
                      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      padding: "2px",
                      borderRadius: "inherit",
                    }}
                    aria-hidden="true"
                  />
                )}

                {/* Tier header */}
                <header>
                  <h3 className="font-display text-xl font-bold text-text-primary">
                    {tier.name}
                  </h3>
                  <p className="mt-2 text-sm text-text-muted">{tier.target}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold text-text-primary">
                      {tier.price}
                    </span>
                    <span className="text-text-muted">{tier.period}</span>
                  </div>
                </header>

                {/* Divider */}
                <div
                  className="my-8 h-px bg-border-color"
                  aria-hidden="true"
                />

                {/* Features */}
                <ul className="flex-1 space-y-4" role="list">
                  {tier.features.map((feature) => {
                    const isHeader = feature.endsWith("plus:");
                    return (
                      <li key={feature} className="flex items-start gap-3">
                        {isHeader ? (
                          <span className="text-sm font-semibold text-accent-cyan">
                            {feature}
                          </span>
                        ) : (
                          <>
                            {/* Checkmark */}
                            <svg
                              width="20"
                              height="20"
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
                            <span className="text-sm text-text-secondary">
                              {feature}
                            </span>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* CTA */}
                <Link
                  href={tier.ctaHref}
                  className={`mt-8 flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                    tier.enterprise
                      ? "bg-gradient-to-r from-accent-green to-emerald-500 text-bg-primary shadow-lg shadow-accent-green/20 hover:shadow-accent-green/40 hover:brightness-110"
                      : tier.popular
                      ? "bg-accent-cyan text-bg-primary hover:brightness-110"
                      : "border border-border-color bg-bg-card-hover text-text-primary hover:border-accent-green/40 hover:text-accent-green"
                  }`}
                >
                  {tier.cta}
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
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="border-t border-border-color py-20"
        aria-labelledby="faq-heading"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2
            id="faq-heading"
            className="font-display text-3xl font-bold text-text-primary text-center animate-fade-up"
          >
            Billing{" "}
            <span className="text-accent-cyan">FAQ</span>
          </h2>
          <div className="mt-12 space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={faq.question}
                className={`group rounded-xl border border-border-color bg-bg-card transition-colors hover:border-accent-green/20 animate-fade-up ${
                  idx === 0
                    ? "animation-delay-100"
                    : idx === 1
                    ? "animation-delay-200"
                    : idx === 2
                    ? "animation-delay-300"
                    : idx === 3
                    ? "animation-delay-400"
                    : "animation-delay-500"
                }`}
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-text-primary font-medium select-none">
                  <span>{faq.question}</span>
                  {/* Chevron */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-text-muted transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-sm leading-relaxed text-text-secondary">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border-color py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-text-primary animate-fade-up">
            Not sure which plan is right for you?
          </h2>
          <p className="mt-4 text-text-secondary animate-fade-up animation-delay-100">
            Talk to our team and we will help you choose based on your service
            area, certifications, and growth goals.
          </p>
          <Link
            href="/quote"
            className="mt-8 inline-flex items-center rounded-lg bg-gradient-to-r from-accent-green to-emerald-500 px-8 py-3 text-sm font-semibold text-bg-primary shadow-lg shadow-accent-green/20 transition-all hover:shadow-accent-green/40 hover:brightness-110 animate-fade-up animation-delay-200"
          >
            Get a Quote
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
      </section>
    </main>
  );
}
