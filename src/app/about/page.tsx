import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About CommercialEVHub | Mission, How It Works & FAQ",
  description:
    "Learn how CommercialEVHub eliminates procurement friction for commercial EV charging infrastructure through algorithmic verification, real-time compliance, and AI-agent integration.",
  openGraph: {
    title: "About CommercialEVHub",
    description:
      "The future of commercial EV procurement: zero human latency, real-time compliance, agent-native architecture.",
  },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const steps = [
  {
    number: "01",
    title: "Register",
    description:
      "Contractors, OEMs, and EPCs create a profile with their service areas, certifications, and capabilities.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Get Verified",
    description:
      "Our automated KYB engine verifies business licenses, COI documents, EVITP credentials, and bonding in real time.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Get Matched",
    description:
      "Property owners submit project requirements and our algorithmic matching engine connects them with qualified, verified contractors.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <path d="M13 6h3a2 2 0 0 1 2 2v7" />
        <path d="M11 18H8a2 2 0 0 1-2-2V9" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Deploy",
    description:
      "Matched contractors and OEMs collaborate on hardware procurement, permitting, installation, and commissioning.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

const differentiators = [
  {
    title: "Agent-Native Architecture",
    description:
      "Built from the ground up for AI-agent procurement workflows. Our API-first platform lets autonomous purchasing agents query contractor availability, compliance status, and project timelines programmatically.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 9h6v6H9z" />
        <path d="M9 1v3" />
        <path d="M15 1v3" />
        <path d="M9 20v3" />
        <path d="M15 20v3" />
        <path d="M20 9h3" />
        <path d="M20 14h3" />
        <path d="M1 9h3" />
        <path d="M1 14h3" />
      </svg>
    ),
  },
  {
    title: "Real-Time Compliance",
    description:
      "Continuous KYB monitoring, dynamic COI tracking, and live EVITP certification validation ensure every listed contractor meets current regulatory and insurance requirements -- not just at signup, but every day.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    title: "Zero Human Latency",
    description:
      "Traditional RFQ processes take weeks. Our matching engine connects property owners to verified, available contractors in under 24 hours -- eliminating the back-and-forth of manual procurement.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

const faqs = [
  {
    question: "What is CommercialEVHub.com?",
    answer:
      "CommercialEVHub.com is the definitive B2B directory and matching platform for commercial EV charging infrastructure. We connect property owners, fleet operators, and developers with vetted electrical contractors, certified hardware OEMs, and charge point operators -- all verified through automated compliance monitoring.",
  },
  {
    question: "How does the automated vetting process work?",
    answer:
      "Our platform performs continuous Know Your Business (KYB) verification that checks state contractor licenses, active Certificate of Insurance (COI) documents, EVITP certification status, bonding levels, and business entity standing. This runs automatically -- not just at onboarding, but on an ongoing basis.",
  },
  {
    question: "What certifications do you verify?",
    answer:
      "We verify EVITP (Electric Vehicle Infrastructure Training Program) certification, state electrical contractor licenses (e.g., California C-10), active general liability and workers' compensation insurance, performance and payment bonds, and hardware safety certifications including UL, ENERGY STAR, and OCPP compliance.",
  },
  {
    question: "How does the AI-agent interface work?",
    answer:
      "Enterprise members can access our RESTful API to integrate contractor lookup, availability checks, and compliance validation directly into AI-agent procurement workflows. This enables autonomous purchasing agents to programmatically identify, vet, and shortlist contractors without human intervention.",
  },
  {
    question: "What is EVITP certification?",
    answer:
      "EVITP stands for Electric Vehicle Infrastructure Training Program. It is a nationally recognized certification that trains and qualifies electricians to install EV charging stations safely and to code. Many utilities and incentive programs now require EVITP-certified installers.",
  },
  {
    question: "How much does it cost for property owners?",
    answer:
      "Property owners and developers can submit project requirements and receive matched contractor quotes at no cost. Our platform is free for the demand side. Revenue is generated through contractor and OEM membership plans.",
  },
  {
    question: "How are contractors matched to projects?",
    answer:
      "Our matching algorithm considers service area coverage, active certifications, charger type expertise, current capacity and availability, historical project ratings, and compliance status. Verified Professional and Enterprise members receive priority in the matching queue.",
  },
  {
    question: "What hardware certifications do you require?",
    answer:
      "All listed hardware must carry UL certification (UL 2594 for L2, UL 2202 for DCFC), be ENERGY STAR certified where applicable, support OCPP 1.6J or 2.0.1 for interoperability, and meet ADA accessibility requirements. We also track ENERGY STAR and Buy America compliance for projects using federal funds.",
  },
  {
    question: "Do you operate in all 50 states?",
    answer:
      "Yes. CommercialEVHub serves contractors, OEMs, and property owners across all 50 U.S. states. Our compliance engine adapts to each state's specific licensing requirements, and our incentive database covers federal, state, and utility-level programs.",
  },
  {
    question: "How do I get started as a contractor?",
    answer:
      "Visit our pricing page to choose a membership tier, then complete your profile with your service areas, certifications, and project portfolio. Our automated vetting will verify your credentials -- typically within 24 to 48 hours -- and you will begin receiving matched leads.",
  },
];

/* ------------------------------------------------------------------ */
/*  FAQ JSON-LD                                                        */
/* ------------------------------------------------------------------ */

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  return (
    <>
      {/* FAQ Schema JSON-LD -- static content only, no user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />

      <main className="min-h-screen bg-bg-primary">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border-color">
          <div className="grid-pattern absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center animate-fade-up">
              <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
                The Future of Commercial{" "}
                <span className="text-accent-green glow-text-green">
                  EV Procurement
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-text-secondary">
                Eliminating procurement friction through algorithmic
                verification, real-time compliance, and agent-native
                architecture.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section
          className="py-20 border-b border-border-color"
          aria-labelledby="mission-heading"
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="animate-fade-up">
              <h2
                id="mission-heading"
                className="font-display text-3xl font-bold text-text-primary"
              >
                Our{" "}
                <span className="text-accent-cyan">Mission</span>
              </h2>
              <div className="mt-8 space-y-6 text-text-secondary leading-relaxed">
                <p>
                  The commercial EV charging industry is growing at
                  extraordinary speed -- but the procurement process has not kept
                  up. Property owners spend weeks searching for qualified
                  contractors. Contractors waste resources chasing unqualified
                  leads. And the compliance burden of licenses, insurance, and
                  certifications creates friction at every stage.
                </p>
                <p>
                  CommercialEVHub exists to solve this. We built a platform that
                  algorithmically verifies every contractor, monitors compliance
                  in real time, and matches project requirements to the right
                  professionals in hours instead of weeks. No phone tag. No
                  stale directories. No expired insurance surprises.
                </p>
                <p>
                  For the emerging ecosystem of AI procurement agents, we
                  provide the structured, verified data layer they need to make
                  autonomous purchasing decisions with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          className="py-20 border-b border-border-color"
          aria-labelledby="how-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-up">
              <h2
                id="how-heading"
                className="font-display text-3xl font-bold text-text-primary"
              >
                How It{" "}
                <span className="text-accent-green">Works</span>
              </h2>
              <p className="mt-4 text-text-secondary">
                From registration to deployment in four streamlined steps.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, idx) => (
                <div
                  key={step.number}
                  className={`relative rounded-2xl border border-border-color bg-bg-card p-6 animate-fade-up ${
                    idx === 0
                      ? "animation-delay-100"
                      : idx === 1
                      ? "animation-delay-200"
                      : idx === 2
                      ? "animation-delay-300"
                      : "animation-delay-400"
                  }`}
                >
                  {/* Step number */}
                  <span className="font-mono text-xs font-bold text-accent-green/60">
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-green/10 text-accent-green">
                    {step.icon}
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {step.description}
                  </p>

                  {/* Connector arrow (not on last item) */}
                  {idx < steps.length - 1 && (
                    <div
                      className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-text-muted lg:block"
                      aria-hidden="true"
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
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Differentiators */}
        <section
          className="py-20 border-b border-border-color"
          aria-labelledby="diff-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-up">
              <h2
                id="diff-heading"
                className="font-display text-3xl font-bold text-text-primary"
              >
                Why{" "}
                <span className="text-accent-cyan">CommercialEVHub</span>
              </h2>
              <p className="mt-4 text-text-secondary">
                Three pillars that set us apart from every other directory.
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {differentiators.map((diff, idx) => (
                <article
                  key={diff.title}
                  className={`gradient-border rounded-2xl bg-bg-card p-8 animate-fade-up ${
                    idx === 0
                      ? "animation-delay-100"
                      : idx === 1
                      ? "animation-delay-200"
                      : "animation-delay-300"
                  }`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
                    {diff.icon}
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold text-text-primary">
                    {diff.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {diff.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Team / Vision */}
        <section
          className="py-20 border-b border-border-color"
          aria-labelledby="vision-heading"
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="animate-fade-up">
              <h2
                id="vision-heading"
                className="font-display text-3xl font-bold text-text-primary"
              >
                Our{" "}
                <span className="text-accent-green">Vision</span>
              </h2>
              <div className="mt-8 space-y-6 text-text-secondary leading-relaxed">
                <p>
                  CommercialEVHub was founded on the observation that the
                  commercial EV charging industry -- one of the fastest-growing
                  infrastructure sectors in the country -- was still relying on
                  word-of-mouth referrals, outdated directories, and manual
                  compliance checking to connect supply with demand.
                </p>
                <p>
                  We believe the next generation of infrastructure procurement
                  will be algorithmic, autonomous, and compliance-first. Our
                  platform is designed not just for the human buyers of today,
                  but for the AI procurement agents of tomorrow -- providing
                  machine-readable, verified, real-time data that eliminates
                  every point of friction in the contractor discovery and
                  vetting pipeline.
                </p>
                <p>
                  Our goal is simple: make deploying commercial EV charging
                  infrastructure as fast and reliable as ordering any other
                  business service -- and accelerate the transition to
                  electrified transportation in the process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2
              id="faq-heading"
              className="font-display text-3xl font-bold text-text-primary text-center animate-fade-up"
            >
              Frequently Asked{" "}
              <span className="text-accent-green">Questions</span>
            </h2>
            <p className="mt-4 text-center text-text-secondary animate-fade-up animation-delay-100">
              Everything you need to know about CommercialEVHub.
            </p>

            <div className="mt-12 space-y-4">
              {faqs.map((faq, idx) => (
                <details
                  key={faq.question}
                  className={`group rounded-xl border border-border-color bg-bg-card transition-colors hover:border-accent-green/20 animate-fade-up ${
                    idx < 3
                      ? idx === 0
                        ? "animation-delay-100"
                        : idx === 1
                        ? "animation-delay-200"
                        : "animation-delay-300"
                      : "animation-delay-400"
                  }`}
                >
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-text-primary font-medium select-none">
                    <span>{faq.question}</span>
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
              Ready to modernize your EV procurement?
            </h2>
            <p className="mt-4 text-text-secondary animate-fade-up animation-delay-100">
              Whether you are a contractor looking for qualified leads or a
              property owner seeking verified installers, we are here to help.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-up animation-delay-200">
              <Link
                href="/quote"
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-accent-green to-emerald-500 px-8 py-3 text-sm font-semibold text-bg-primary shadow-lg shadow-accent-green/20 transition-all hover:shadow-accent-green/40 hover:brightness-110"
              >
                Get a Quote
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-lg border border-border-color px-8 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-accent-green/40 hover:text-accent-green"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
