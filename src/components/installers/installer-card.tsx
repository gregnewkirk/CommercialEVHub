import Link from "next/link";
import type { Installer } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle2, MapPin, Star, Zap } from "lucide-react";
import { getHardwareLabel } from "@/lib/utils/constants";

interface InstallerCardProps {
  installer: Installer;
}

export function InstallerCard({ installer }: InstallerCardProps) {
  return (
    <div className="rounded-lg border bg-white p-5 transition-all hover:shadow-md">
      <div className="flex items-start gap-4">
        {/* Logo placeholder */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-navy/5">
          <Building2 className="size-6 text-navy/50" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-navy">
              {installer.companyName}
            </h3>
            {installer.verified && (
              <CheckCircle2 className="size-4 shrink-0 text-ev-green" />
            )}
            {installer.tier === "premium" && (
              <Badge className="gap-1 bg-amber-100 text-amber-700 border-amber-200">
                <Star className="size-3" />
                Premium
              </Badge>
            )}
          </div>

          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {installer.description}
          </p>

          {/* Service areas */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <MapPin className="size-3 text-muted-foreground" />
            {installer.serviceAreas.slice(0, 5).map((area) => (
              <Badge key={area} variant="secondary" className="text-[10px]">
                {area}
              </Badge>
            ))}
            {installer.serviceAreas.length > 5 && (
              <span className="text-xs text-muted-foreground">
                +{installer.serviceAreas.length - 5} more
              </span>
            )}
          </div>

          {/* Hardware types */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Zap className="size-3 text-muted-foreground" />
            {installer.hardwareTypes.map((hw) => (
              <Badge key={hw} variant="outline" className="text-[10px]">
                {getHardwareLabel(hw)}
              </Badge>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link href={`/installers/${installer.slug}`} className="shrink-0">
          <Button variant="outline" size="sm" className="border-ev-green/50 text-ev-green hover:bg-ev-green/10">
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
