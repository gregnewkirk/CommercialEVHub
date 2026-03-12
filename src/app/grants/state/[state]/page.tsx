import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { US_STATES, getStateByCode } from "@/lib/utils/constants";
import { getGrantsByState, getFederalGrants } from "@/lib/db/queries";
import { GrantCard } from "@/components/grants/grant-card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, MapPin } from "lucide-react";

interface PageProps {
  params: Promise<{ state: string }>;
}

export function generateStaticParams() {
  return US_STATES.map((s) => ({ state: s.code.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: stateParam } = await params;
  const stateInfo = getStateByCode(stateParam.toUpperCase());
  if (!stateInfo) return { title: "State Not Found" };

  const grants = await getGrantsByState(stateParam.toUpperCase());

  return {
    title: `${grants.length} Active EV Charging Grants in ${stateInfo.name} (2026)`,
    description: `Browse ${grants.length} EV fleet charging grants, tax credits, and rebates available in ${stateInfo.name}. Find funding for Level 2 and DC fast charger installations.`,
  };
}

export default async function StateHubPage({ params }: PageProps) {
  const { state: stateParam } = await params;
  const stateCode = stateParam.toUpperCase();
  const stateInfo = getStateByCode(stateCode);
  if (!stateInfo) notFound();

  const [stateGrants, federalGrants] = await Promise.all([
    getGrantsByState(stateCode),
    getFederalGrants(),
  ]);

  // Get unique cities for this state
  const cities = [
    ...new Set(stateGrants.map((g) => g.city).filter(Boolean)),
  ] as string[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/grants" className="hover:text-foreground">
          Grants
        </Link>
        <ChevronRight className="size-3" />
        <span className="font-medium text-foreground">{stateInfo.name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <MapPin className="size-6 text-ev-green" />
          <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            EV Fleet Charging Grants in {stateInfo.name}
          </h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          {stateGrants.length} state-level program{stateGrants.length !== 1 ? "s" : ""} plus{" "}
          {federalGrants.length} federal programs available.
        </p>
      </div>

      {/* State-specific grants */}
      {stateGrants.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-navy">
            {stateInfo.name} Programs
          </h2>
          <div className="space-y-3">
            {stateGrants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} />
            ))}
          </div>
        </section>
      )}

      {/* Federal grants also available */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-navy">
          Federal Programs Available in {stateInfo.name}
        </h2>
        <div className="space-y-3">
          {federalGrants.map((grant) => (
            <GrantCard key={grant.id} grant={grant} />
          ))}
        </div>
      </section>

      {/* Cities */}
      {cities.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-navy">
            Cities in {stateInfo.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link
                key={city}
                href={`/grants/state/${stateParam}/${encodeURIComponent(city.toLowerCase())}`}
              >
                <Badge variant="outline" className="hover:bg-muted">
                  {city}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Other states */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-navy">
          Browse Other States
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {US_STATES.filter((s) => s.code !== stateCode)
            .slice(0, 12)
            .map((s) => (
              <Link key={s.code} href={`/grants/state/${s.code.toLowerCase()}`}>
                <Badge variant="secondary" className="hover:bg-muted">
                  {s.name}
                </Badge>
              </Link>
            ))}
          <Link href="/grants">
            <Badge variant="outline" className="text-ev-green hover:bg-ev-green/5">
              All States
            </Badge>
          </Link>
        </div>
      </section>
    </div>
  );
}
