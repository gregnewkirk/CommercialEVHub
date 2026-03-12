"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  size?: "lg" | "md";
  defaultValue?: string;
  className?: string;
}

export function SearchBar({ size = "md", defaultValue = "", className }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/grants?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/grants");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full items-center rounded-xl border bg-white shadow-sm transition-shadow focus-within:shadow-md",
        size === "lg"
          ? "max-w-2xl border-white/20 px-4 py-3"
          : "max-w-lg border-border px-3 py-1.5",
        className
      )}
    >
      <MapPin className={cn("shrink-0 text-ev-green", size === "lg" ? "size-5" : "size-4")} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your zip code, city, or state..."
        className={cn(
          "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
          size === "lg" ? "mx-3 text-base" : "mx-2 text-sm"
        )}
      />
      <button
        type="submit"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg bg-ev-green text-white transition-colors hover:bg-ev-green/90",
          size === "lg" ? "size-10" : "size-7"
        )}
      >
        <Search className={size === "lg" ? "size-5" : "size-3.5"} />
        <span className="sr-only">Search grants</span>
      </button>
    </form>
  );
}
