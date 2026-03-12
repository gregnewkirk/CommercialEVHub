import { formatCurrencyRange } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface GrantAmountProps {
  min?: number | null;
  max?: number | null;
  className?: string;
}

export function GrantAmount({ min, max, className }: GrantAmountProps) {
  const display = formatCurrencyRange(min, max);

  return (
    <span className={cn("font-mono text-lg font-bold tracking-tight text-navy", className)}>
      {display}
    </span>
  );
}
