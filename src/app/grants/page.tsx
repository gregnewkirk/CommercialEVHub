import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchBar } from "@/components/layout/search-bar";
import { GrantFilters } from "@/components/grants/grant-filters";
import { GrantList } from "@/components/grants/grant-list";
import { getGrants } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "EV Charging Grants & Incentives",
  description:
    "Browse federal, state, and utility grants for EV fleet charging infrastructure. Filter by jurisdiction, entity type, hardware, and more.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function GrantsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Normalize params
  const filters = {
    search: typeof params.q === "string" ? params.q : undefined,
    jurisdiction: typeof params.jurisdiction === "string" ? params.jurisdiction : undefined,
    state: typeof params.state === "string" ? params.state : undefined,
    entityType: typeof params.entityType === "string" ? params.entityType : undefined,
    hardwareType: typeof params.hardwareType === "string" ? params.hardwareType : undefined,
    incentiveType: typeof params.incentiveType === "string" ? params.incentiveType : undefined,
    justice40: params.justice40 === "true" ? true : undefined,
    status: typeof params.status === "string" ? params.status : undefined,
    page: typeof params.page === "string" ? parseInt(params.page, 10) : 1,
    limit: 20,
  };

  const result = await getGrants(filters);

  // Build searchParams for pagination links
  const currentParams: Record<string, string> = {};
  for (const [key, val] of Object.entries(params)) {
    if (typeof val === "string" && key !== "page") {
      currentParams[key] = val;
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search bar */}
      <div className="mb-6">
        <SearchBar size="md" defaultValue={filters.search} className="mx-0" />
      </div>

      <div className="flex gap-8">
        {/* Filters (desktop sidebar + mobile sheet) */}
        <Suspense fallback={null}>
          <GrantFilters />
        </Suspense>

        {/* Grant list */}
        <div className="min-w-0 flex-1">
          <GrantList
            grants={result.grants}
            total={result.total}
            page={result.page}
            totalPages={result.totalPages}
            searchParams={currentParams}
          />
        </div>
      </div>
    </div>
  );
}
