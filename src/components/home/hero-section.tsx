import { SearchBar } from "@/components/layout/search-bar";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-navy py-20 sm:py-28">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          Unlock Billions in Commercial{" "}
          <span className="text-ev-green">EV Charging Funding</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/60 sm:mt-6 sm:text-lg">
          Search federal, state, and utility grants for your fleet charging
          infrastructure. Calculate your ROI. Connect with certified installers.
        </p>

        <div className="mt-8 flex justify-center sm:mt-10">
          <SearchBar size="lg" />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/40 sm:text-sm">
          <span>500+ Grant Programs</span>
          <span className="hidden sm:inline">&middot;</span>
          <span>All 50 States</span>
          <span className="hidden sm:inline">&middot;</span>
          <span>Updated Weekly</span>
        </div>
      </div>
    </section>
  );
}
