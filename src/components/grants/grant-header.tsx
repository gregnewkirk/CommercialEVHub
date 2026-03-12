import type { Grant } from "@/lib/db/schema";
import { StatusBadge } from "@/components/ui/status-badge";
import { GrantAmount } from "@/components/ui/grant-amount";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, MapPin, Building2 } from "lucide-react";
import { formatDate, daysUntilDeadline } from "@/lib/utils/format";
import { getJurisdictionLabel } from "@/lib/utils/constants";

interface GrantHeaderProps {
  grant: Grant;
}

export function GrantHeader({ grant }: GrantHeaderProps) {
  const days = grant.deadline ? daysUntilDeadline(grant.deadline) : null;

  return (
    <div>
      {/* Breadcrumb-style metadata */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary">{getJurisdictionLabel(grant.jurisdiction)}</Badge>
        {grant.state && (
          <span className="flex items-center gap-1">
            <MapPin className="size-3" />
            {grant.state}
          </span>
        )}
        <StatusBadge status={grant.status} deadline={grant.deadline} />
      </div>

      {/* Title */}
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
        {grant.title}
      </h1>

      {/* Funder */}
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Building2 className="size-3.5" />
        {grant.funder}
      </p>

      {/* Key stats row */}
      <div className="mt-4 flex flex-wrap items-center gap-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Funding Amount
          </p>
          <GrantAmount min={grant.amountMin} max={grant.amountMax} className="text-xl" />
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Deadline
          </p>
          <p className="font-mono text-lg font-bold text-navy">
            {grant.deadline ? (
              <>
                {formatDate(grant.deadline)}
                {days !== null && days > 0 && (
                  <span className="ml-2 text-sm font-medium text-amber-600">
                    ({days} days remaining)
                  </span>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">Rolling / Ongoing</span>
            )}
          </p>
        </div>
      </div>

      {/* Source link */}
      {grant.sourceUrl && (
        <a
          href={grant.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ev-green hover:underline"
        >
          View official program page
          <ExternalLink className="size-3" />
        </a>
      )}
    </div>
  );
}
