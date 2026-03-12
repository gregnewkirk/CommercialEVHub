import type { Grant } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Zap, Shield } from "lucide-react";
import { getEntityLabel, getHardwareLabel, getJurisdictionLabel } from "@/lib/utils/constants";

interface EligibilityMatrixProps {
  grant: Grant;
}

export function EligibilityMatrix({ grant }: EligibilityMatrixProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Eligibility</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Eligible Entities */}
        {grant.eligibleEntities.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Eligible Applicants
            </p>
            <ul className="space-y-1.5">
              {grant.eligibleEntities.map((entity) => (
                <li key={entity} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="size-3.5 shrink-0 text-ev-green" />
                  {getEntityLabel(entity)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hardware Types */}
        {grant.eligibleHardware.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Eligible Hardware
            </p>
            <div className="flex flex-wrap gap-1.5">
              {grant.eligibleHardware.map((hw) => (
                <Badge key={hw} variant="secondary" className="gap-1">
                  <Zap className="size-3" />
                  {getHardwareLabel(hw)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Jurisdiction */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Jurisdiction:
          </span>
          <Badge variant="outline">{getJurisdictionLabel(grant.jurisdiction)}</Badge>
        </div>

        {/* Justice40 */}
        {grant.justice40 && (
          <div className="flex items-center gap-2 rounded-md bg-emerald-50 p-2.5">
            <Shield className="size-4 text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-emerald-800">Justice40 Eligible</p>
              <p className="text-xs text-emerald-600">
                This program prioritizes disadvantaged communities under the Justice40 initiative.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
