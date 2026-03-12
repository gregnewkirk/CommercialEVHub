import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { daysUntilDeadline } from "@/lib/utils/format";

interface StatusBadgeProps {
  status: "active" | "upcoming" | "archived" | "exhausted";
  deadline?: string | null;
  className?: string;
}

const statusConfig = {
  active: { label: "Active", className: "bg-emerald-500/10 text-emerald-700 border-emerald-200" },
  upcoming: { label: "Upcoming", className: "bg-blue-500/10 text-blue-700 border-blue-200" },
  archived: { label: "Archived", className: "bg-gray-500/10 text-gray-600 border-gray-200" },
  exhausted: { label: "Exhausted", className: "bg-red-500/10 text-red-700 border-red-200" },
} as const;

export function StatusBadge({ status, deadline, className }: StatusBadgeProps) {
  const days = deadline ? daysUntilDeadline(deadline) : null;
  const closingSoon = status === "active" && days !== null && days > 0 && days <= 30;

  if (closingSoon) {
    return (
      <Badge
        variant="outline"
        className={cn("bg-amber-500/10 text-amber-700 border-amber-200", className)}
      >
        Closing in {days}d
      </Badge>
    );
  }

  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
