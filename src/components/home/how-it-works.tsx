import { Search, Calculator, Handshake } from "lucide-react";

const steps = [
  {
    icon: <Search className="size-6" />,
    title: "Find Your Grants",
    description:
      "Search our database of 500+ federal, state, and utility incentive programs. Filter by location, equipment type, and eligibility.",
  },
  {
    icon: <Calculator className="size-6" />,
    title: "Calculate Your ROI",
    description:
      "Use our interactive calculator to model total project cost, available subsidies, and payback period for your fleet charging investment.",
  },
  {
    icon: <Handshake className="size-6" />,
    title: "Connect with Installers",
    description:
      "Get matched with certified commercial EVSE installers in your area who specialize in the hardware and grants you need.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            How It Works
          </h2>
          <p className="mt-2 text-muted-foreground">
            Three steps to fund your fleet charging infrastructure
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="flex size-14 items-center justify-center rounded-full bg-navy text-white">
                  {step.icon}
                </div>
                <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-ev-green text-xs font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
