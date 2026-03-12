const signals = [
  "NEVI Program",
  "U.S. DOT",
  "DOE AFDC",
  "IRA 30C",
  "EPA Clean School Bus",
  "DSIRE Database",
];

export function TrustSignals() {
  return (
    <section className="border-t bg-slate-100 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Data sourced from official government programs
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {signals.map((signal) => (
            <span
              key={signal}
              className="text-sm font-semibold tracking-wide text-slate-400"
            >
              {signal}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
