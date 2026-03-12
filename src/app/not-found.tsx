import Link from "next/link";
import { SearchBar } from "@/components/layout/search-bar";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted">
        <FileQuestion className="size-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold text-navy">Page Not Found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved. Try searching for grants instead.
      </p>

      <div className="mt-6 w-full max-w-md">
        <SearchBar size="md" />
      </div>

      <div className="mt-6 flex gap-4 text-sm">
        <Link href="/grants" className="text-ev-green hover:underline">
          Browse Grants
        </Link>
        <Link href="/calculator" className="text-ev-green hover:underline">
          ROI Calculator
        </Link>
        <Link href="/installers" className="text-ev-green hover:underline">
          Find Installers
        </Link>
      </div>
    </div>
  );
}
