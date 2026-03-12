import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getStateByCode } from "@/lib/utils/constants";
import { MOCK_GRANTS } from "@/lib/mock-data";
import { GrantCard } from "@/components/grants/grant-card";
import { SearchBar } from "@/components/layout/search-bar";
import { ChevronRight, MapPin } from "lucide-react";

interface PageProps {
  params: Promise<{ state: string; city: string }>;
}

function titleCase(s: string) {
  return decodeURIComponent(s)
    .split(/[\s-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: stateParam, city: cityParam } = await params;
  const stateInfo = getStateByCode(stateParam.toUpperCase());
  const cityName = titleCase(cityParam);
  if (!stateInfo) return { title: "Not Found" };

  return {
    title: `EV Charging Grants in ${cityName}, ${stateInfo.name} (2026)`,
    description: `Find EV fleet charging grants, tax credits, and rebates in ${cityName}, ${stateInfo.name}. Connect with certified local installers.`,
  };
}

export default async function CityHubPage({ params }: PageProps) {
  const { state: stateParam, city: cityParam } = await params;
  const stateCode = stateParam.toUpperCase();
  const stateInfo = getStateByCode(stateCode);
  if (!stateInfo) notFound();

  const cityName = titleCase(cityParam);

  // Mock: filter grants by state + city
  const cityGrants = MOCK_GRANTS.filter(
    (g) =>
      g.state === stateCode &&
      g.city?.toLowerCase() === decodeURIComponent(cityParam).toLowerCase() &&
      g.status === "active"
  );
  const stateGrants = MOCK_GRANTS.filter(
    (g) => g.state === stateCode && g.status === "active" && !g.city
  );
  const federalGrants = MOCK_GRANTS.filter(
    (g) => g.jurisdiction === "federal" && g.status === "active"
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/grants" className="hover:text-foreground">
          Grants
        </Link>
        <ChevronRight className="size-3" />
        <Link href={`/grants/state/${stateParam}`} className="hover:text-foreground">
          {stateInfo.name}
        </Link>
        <ChevronRight className="size-3" />
        <span className="font-medium text-foreground">{cityName}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <MapPin className="size-6 text-ev-green" />
          <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            EV Charging Grants in {cityName}, {stateInfo.name}
          </h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Find charging infrastructure funding available in {cityName}.
        </p>
      </div>

      {/* City-specific grants */}
      {cityGrants.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-navy">
            {cityName} Programs
          </h2>
          <div className="space-y-3">
            {cityGrants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} />
            ))}
          </div>
        </section>
      )}

      {/* State-level programs */}
      {stateGrants.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-navy">
            {stateInfo.name} Statewide Programs
          </h2>
          <div className="space-y-3">
            {stateGrants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} />
            ))}
          </div>
        </section>
      )}

      {/* Federal */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-navy">
          Federal Programs
        </h2>
        <div className="space-y-3">
          {federalGrants.slice(0, 3).map((grant) => (
            <GrantCard key={grant.id} grant={grant} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl bg-navy p-8 text-center">
        <h2 className="text-xl font-bold text-white">
          Need Help Finding Grants in {cityName}?
        </h2>
        <p className="mt-2 text-sm text-white/60">
          Search for specific programs or connect with a local installer.
        </p>
        <div className="mt-4 flex justify-center">
          <SearchBar size="md" defaultValue={cityName} />
        </div>
      </section>
    </div>
  );
}
