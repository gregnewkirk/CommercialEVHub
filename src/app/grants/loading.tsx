export default function GrantsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search bar skeleton */}
      <div className="mb-6 h-10 w-full max-w-lg animate-pulse rounded-xl bg-muted" />

      <div className="flex gap-8">
        {/* Filter sidebar skeleton */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <div className="mb-2 h-3 w-20 animate-pulse rounded bg-muted" />
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-7 w-16 animate-pulse rounded-md bg-muted" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Grant list skeleton */}
        <div className="min-w-0 flex-1 space-y-3">
          <div className="mb-4 h-4 w-40 animate-pulse rounded bg-muted" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-white p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
                  </div>
                  <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-6 w-24 animate-pulse rounded bg-muted" />
              </div>
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted" />
              <div className="mt-3 flex gap-3">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                <div className="h-4 w-12 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
