import Link from "next/link";
import { Building2, Bus, Zap, Landmark, Plug, Receipt } from "lucide-react";

const pathways = [
  {
    icon: <Building2 className="size-6" />,
    title: "California Fleet Rebates",
    description: "HVIP and EnergIIZE programs for commercial fleets",
    href: "/grants?state=CA",
  },
  {
    icon: <Bus className="size-6" />,
    title: "School Bus Electrification",
    description: "EPA Clean School Bus program funding",
    href: "/grants?q=school+bus",
  },
  {
    icon: <Zap className="size-6" />,
    title: "DC Fast Charger Grants",
    description: "Federal and state DCFC deployment incentives",
    href: "/grants?hardwareType=dcfc",
  },
  {
    icon: <Landmark className="size-6" />,
    title: "Federal NEVI Program",
    description: "$7.5B for national EV charging network buildout",
    href: "/grants?q=NEVI",
  },
  {
    icon: <Plug className="size-6" />,
    title: "Utility Make-Ready Programs",
    description: "Utility-funded infrastructure and rebates",
    href: "/grants?incentiveType=make_ready",
  },
  {
    icon: <Receipt className="size-6" />,
    title: "Tax Credit (30C)",
    description: "Up to $100K per site for EV charging equipment",
    href: "/grants?q=30C",
  },
];

export function PopularPathways() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            Popular Funding Pathways
          </h2>
          <p className="mt-2 text-muted-foreground">
            Explore the most sought-after EV charging incentive programs
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pathways.map((pathway) => (
            <Link
              key={pathway.title}
              href={pathway.href}
              className="group flex items-start gap-4 rounded-xl border bg-white p-5 transition-all hover:border-ev-green/30 hover:shadow-md"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy transition-colors group-hover:bg-ev-green/10 group-hover:text-ev-green">
                {pathway.icon}
              </div>
              <div>
                <h3 className="font-semibold text-navy group-hover:text-ev-green">
                  {pathway.title}
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {pathway.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
