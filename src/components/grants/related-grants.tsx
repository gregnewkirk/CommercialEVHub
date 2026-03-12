import Link from "next/link";
import type { Grant } from "@/lib/db/schema";
import { StatusBadge } from "@/components/ui/status-badge";
import { GrantAmount } from "@/components/ui/grant-amount";

interface RelatedGrantsProps {
  grants: Grant[];
}

export function RelatedGrants({ grants }: RelatedGrantsProps) {
  if (grants.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Related Programs
      </h3>
      <div className="space-y-2">
        {grants.map((grant) => (
          <Link
            key={grant.id}
            href={`/grants/${grant.slug}`}
            className="block rounded-lg border bg-white p-3 transition-all hover:border-ev-green/30 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium leading-snug text-navy line-clamp-2">
                {grant.title}
              </h4>
              <StatusBadge status={grant.status} deadline={grant.deadline} />
            </div>
            <div className="mt-1.5">
              <GrantAmount min={grant.amountMin} max={grant.amountMax} className="text-sm" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
