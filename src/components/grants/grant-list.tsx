import Link from "next/link";
import type { Grant } from "@/lib/db/schema";
import { GrantCard } from "./grant-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GrantListProps {
  grants: Grant[];
  total: number;
  page: number;
  totalPages: number;
  baseUrl?: string;
  searchParams?: Record<string, string>;
}

export function GrantList({
  grants,
  total,
  page,
  totalPages,
  baseUrl = "/grants",
  searchParams = {},
}: GrantListProps) {
  const start = (page - 1) * 20 + 1;
  const end = Math.min(page * 20, total);

  function pageUrl(p: number) {
    const params = new URLSearchParams(searchParams);
    if (p > 1) {
      params.set("page", String(p));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    return qs ? `${baseUrl}?${qs}` : baseUrl;
  }

  if (grants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <p className="text-lg font-medium text-navy">No grants match your filters</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try broadening your search or removing some filters.
        </p>
        <Link href="/grants">
          <Button variant="outline" size="sm" className="mt-4">
            Clear all filters
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Results count */}
      <p className="mb-4 text-sm text-muted-foreground">
        Showing {start}&ndash;{end} of {total} grant{total !== 1 ? "s" : ""}
      </p>

      {/* Grant cards */}
      <div className="space-y-3">
        {grants.map((grant) => (
          <GrantCard key={grant.id} grant={grant} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-2">
          {page > 1 ? (
            <Link href={pageUrl(page - 1)}>
              <Button variant="outline" size="sm" className="gap-1">
                <ChevronLeft className="size-3.5" />
                Previous
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="gap-1" disabled>
              <ChevronLeft className="size-3.5" />
              Previous
            </Button>
          )}

          <span className="px-3 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>

          {page < totalPages ? (
            <Link href={pageUrl(page + 1)}>
              <Button variant="outline" size="sm" className="gap-1">
                Next
                <ChevronRight className="size-3.5" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="gap-1" disabled>
              Next
              <ChevronRight className="size-3.5" />
            </Button>
          )}
        </nav>
      )}
    </div>
  );
}
