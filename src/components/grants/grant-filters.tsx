"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  JURISDICTIONS,
  ELIGIBLE_ENTITIES,
  HARDWARE_TYPES,
  INCENTIVE_TYPES,
} from "@/lib/utils/constants";

interface FilterGroupProps {
  title: string;
  paramKey: string;
  options: readonly { readonly value: string; readonly label: string }[];
  currentValue?: string;
  onSelect: (key: string, value: string | null) => void;
}

function FilterGroup({ title, paramKey, options, currentValue, onSelect }: FilterGroupProps) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = currentValue === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(paramKey, active ? null : opt.value)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                active
                  ? "border-ev-green bg-ev-green/10 text-ev-green"
                  : "border-border bg-white text-muted-foreground hover:border-navy/20 hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface GrantFiltersProps {
  className?: string;
}

export function GrantFilters({ className }: GrantFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFilters = {
    jurisdiction: searchParams.get("jurisdiction") ?? undefined,
    entityType: searchParams.get("entityType") ?? undefined,
    hardwareType: searchParams.get("hardwareType") ?? undefined,
    incentiveType: searchParams.get("incentiveType") ?? undefined,
    justice40: searchParams.get("justice40") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  };

  const activeFilterCount = Object.values(currentFilters).filter(Boolean).length;

  const handleSelect = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // Reset pagination on filter change
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearAll = useCallback(() => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const filterContent = (
    <div className={cn("space-y-5", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-navy">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" />
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      <FilterGroup
        title="Jurisdiction"
        paramKey="jurisdiction"
        options={JURISDICTIONS}
        currentValue={currentFilters.jurisdiction}
        onSelect={handleSelect}
      />

      <FilterGroup
        title="Entity Type"
        paramKey="entityType"
        options={ELIGIBLE_ENTITIES}
        currentValue={currentFilters.entityType}
        onSelect={handleSelect}
      />

      <FilterGroup
        title="Hardware"
        paramKey="hardwareType"
        options={HARDWARE_TYPES}
        currentValue={currentFilters.hardwareType}
        onSelect={handleSelect}
      />

      <FilterGroup
        title="Incentive Type"
        paramKey="incentiveType"
        options={INCENTIVE_TYPES}
        currentValue={currentFilters.incentiveType}
        onSelect={handleSelect}
      />

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Status
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {[
            { value: "active", label: "Active" },
            { value: "upcoming", label: "Upcoming" },
            { value: "all", label: "All" },
          ].map((opt) => {
            const active =
              (currentFilters.status ?? "active") === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() =>
                  handleSelect("status", active ? null : opt.value)
                }
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                  active
                    ? "border-ev-green bg-ev-green/10 text-ev-green"
                    : "border-border bg-white text-muted-foreground hover:border-navy/20 hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Justice40 toggle */}
      <div>
        <button
          onClick={() =>
            handleSelect("justice40", currentFilters.justice40 ? null : "true")
          }
          className={cn(
            "flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
            currentFilters.justice40
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-border bg-white text-muted-foreground hover:border-navy/20"
          )}
        >
          <span className="size-3 rounded-sm border" />
          Justice40 Eligible
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">{filterContent}</aside>

      {/* Mobile sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="outline" size="sm" className="gap-1.5" />
            }
          >
            <SlidersHorizontal className="size-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-1 size-5 p-0 text-[10px]">
                {activeFilterCount}
              </Badge>
            )}
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter Grants</SheetTitle>
            </SheetHeader>
            <div className="p-4">{filterContent}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
