"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-red-50">
        <AlertTriangle className="size-8 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-navy">Something Went Wrong</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        An unexpected error occurred. Please try again or contact support if the
        problem persists.
      </p>
      {error.digest && (
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          Error ID: {error.digest}
        </p>
      )}
      <Button
        onClick={reset}
        className="mt-6 gap-2 bg-ev-green hover:bg-ev-green/90"
      >
        <RefreshCw className="size-4" />
        Try Again
      </Button>
    </div>
  );
}
