"use client";

import type { ROIOutput } from "@/lib/calculator/compute-roi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { TrendingUp, Clock, DollarSign, ArrowDown } from "lucide-react";

interface CalculatorResultsProps {
  result: ROIOutput;
  compact?: boolean;
}

function ResultTile({
  label,
  value,
  icon,
  highlight,
  className,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  highlight?: "green" | "amber" | "red";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        highlight === "green" && "border-emerald-200 bg-emerald-50",
        highlight === "amber" && "border-amber-200 bg-amber-50",
        highlight === "red" && "border-red-200 bg-red-50",
        !highlight && "bg-white",
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <div
        className={cn(
          "mt-1 font-mono text-lg font-bold",
          highlight === "green" && "text-emerald-700",
          highlight === "amber" && "text-amber-700",
          highlight === "red" && "text-red-700",
          !highlight && "text-navy"
        )}
      >
        {value}
      </div>
    </div>
  );
}

function fmt(n: number) {
  return formatCurrency(Math.round(n * 100));
}

export function CalculatorResults({ result, compact }: CalculatorResultsProps) {
  const roiHighlight: "green" | "amber" | "red" =
    result.roiPercent >= 100 ? "green" : result.roiPercent >= 0 ? "amber" : "red";
  const paybackHighlight: "green" | "amber" | "red" =
    result.paybackYears <= 3 ? "green" : result.paybackYears <= 7 ? "amber" : "red";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-2">
          <ResultTile
            label="5-Year ROI"
            value={`${result.roiPercent}%`}
            icon={<TrendingUp className="size-3" />}
            highlight={roiHighlight}
          />
          <ResultTile
            label="Payback Period"
            value={result.paybackYears === Infinity ? "N/A" : `${result.paybackYears} yrs`}
            icon={<Clock className="size-3" />}
            highlight={paybackHighlight}
          />
        </div>

        {/* Investment breakdown */}
        {!compact && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <ResultTile label="Gross CapEx" value={fmt(result.grossCapex)} />
              <ResultTile
                label="Grant Offset"
                value={`-${fmt(result.grantOffset)}`}
                icon={<ArrowDown className="size-3" />}
                highlight={result.grantOffset > 0 ? "green" : undefined}
              />
              <ResultTile
                label="30C Tax Credit"
                value={`-${fmt(result.taxCreditOffset)}`}
                icon={<ArrowDown className="size-3" />}
                highlight={result.taxCreditOffset > 0 ? "green" : undefined}
              />
              <ResultTile
                label="Net Investment"
                value={fmt(result.netInvestment)}
                icon={<DollarSign className="size-3" />}
              />
            </div>

            {/* Annual metrics */}
            <div className="grid grid-cols-3 gap-2">
              <ResultTile label="Annual Revenue" value={fmt(result.annualRevenue)} highlight="green" />
              <ResultTile label="Annual OpEx" value={fmt(result.annualOpex)} />
              <ResultTile
                label="Annual Profit"
                value={fmt(result.annualProfit)}
                highlight={result.annualProfit > 0 ? "green" : "red"}
              />
            </div>
          </>
        )}

        <p className="text-[10px] text-muted-foreground">
          Estimates are for planning purposes only. Actual costs and returns will vary
          based on location, usage patterns, and utility rates.
        </p>
      </CardContent>
    </Card>
  );
}
