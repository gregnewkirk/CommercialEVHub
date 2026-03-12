import Link from "next/link";
import type { Grant } from "@/lib/db/schema";
import { StatusBadge } from "@/components/ui/status-badge";
import { GrantAmount } from "@/components/ui/grant-amount";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building2 } from "lucide-react";
import { formatDate, daysUntilDeadline } from "@/lib/utils/format";
import { getJurisdictionLabel, getHardwareLabel } from "@/lib/utils/constants";

interface GrantCardProps {
  grant: Grant;
}

export function GrantCard({ grant }: GrantCardProps) {
  const days = grant.deadline ? daysUntilDeadline(grant.deadline) : null;

  return (
    <Link
      href={`/grants/${grant.slug}`}
      className="group block rounded-lg border bg-white p-5 transition-all hover:border-ev-green/30 hover:shadow-md"
    >
      {/* Top row: funder + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {grant.funder}
            </span>
            <StatusBadge status={grant.status} deadline={grant.deadline} />
          </div>

          {/* Title */}
          <h3 className="mt-1.5 text-base font-semibold leading-snug text-navy group-hover:text-ev-green">
            {grant.title}
          </h3>
        </div>

        {/* Amount */}
        <div className="shrink-0 text-right">
          <GrantAmount min={grant.amountMin} max={grant.amountMax} className="text-base sm:text-lg" />
        </div>
      </div>

      {/* Description */}
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
        {grant.description}
      </p>

      {/* Bottom row: metadata */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {grant.deadline && (
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {formatDate(grant.deadline)}
            {days !== null && days > 0 && days <= 60 && (
              <span className="font-medium text-amber-600">
                ({days}d left)
              </span>
            )}
          </span>
        )}

        <span className="flex items-center gap-1">
          <Building2 className="size-3" />
          {getJurisdictionLabel(grant.jurisdiction)}
        </span>

        {grant.state && (
          <span className="flex items-center gap-1">
            <MapPin className="size-3" />
            {grant.state}
          </span>
        )}

        {grant.eligibleHardware.slice(0, 2).map((hw) => (
          <Badge key={hw} variant="secondary" className="text-[10px]">
            {getHardwareLabel(hw)}
          </Badge>
        ))}

        {grant.justice40 && (
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700">
            Justice40
          </Badge>
        )}
      </div>
    </Link>
  );
}
