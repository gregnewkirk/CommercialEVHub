import type { Grant } from "@/lib/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GrantAmount } from "@/components/ui/grant-amount";
import { getIncentiveLabel } from "@/lib/utils/constants";

interface FinancialBreakdownProps {
  grant: Grant;
}

export function FinancialBreakdown({ grant }: FinancialBreakdownProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Funding Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Award Amount
          </p>
          <GrantAmount min={grant.amountMin} max={grant.amountMax} className="text-2xl" />
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Incentive Type
          </p>
          <Badge variant="outline" className="text-sm">
            {getIncentiveLabel(grant.incentiveType)}
          </Badge>
        </div>

        {grant.utility && (
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Utility Provider
            </p>
            <p className="text-sm font-medium">{grant.utility}</p>
          </div>
        )}

        {/* Description */}
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Program Description
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {grant.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
