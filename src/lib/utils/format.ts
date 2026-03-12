export function formatCurrency(cents: number | null | undefined): string {
  if (cents == null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatCurrencyRange(
  min: number | null | undefined,
  max: number | null | undefined
): string {
  if (min == null && max == null) return "Varies";
  if (min != null && max != null && min === max) return formatCurrency(min);
  if (min != null && max != null)
    return `${formatCurrency(min)} – ${formatCurrency(max)}`;
  if (max != null) return `Up to ${formatCurrency(max)}`;
  return `From ${formatCurrency(min)}`;
}

export function formatDate(date: string | Date | null): string {
  if (!date) return "Rolling / Ongoing";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function daysUntilDeadline(
  deadline: string | Date | null
): number | null {
  if (!deadline) return null;
  const d = new Date(deadline);
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatCompactCurrency(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1_000_000_000) {
    return `$${(dollars / 1_000_000_000).toFixed(1)}B`;
  }
  if (dollars >= 1_000_000) {
    return `$${(dollars / 1_000_000).toFixed(1)}M`;
  }
  if (dollars >= 1_000) {
    return `$${(dollars / 1_000).toFixed(0)}K`;
  }
  return formatCurrency(cents);
}
