"use client";

import { useEffect, useRef, useState } from "react";
import { DollarSign, FileText, MapPin } from "lucide-react";

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  format?: (n: number) => string;
}

function StatItem({ icon, value, prefix = "", suffix = "", label, format }: StatItemProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const duration = 1500;

          function animate(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          }
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  const formatted = format ? format(display) : display.toLocaleString();

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 px-4 py-6">
      <div className="flex size-10 items-center justify-center rounded-lg bg-ev-green/10 text-ev-green">
        {icon}
      </div>
      <div className="font-mono text-3xl font-bold tracking-tight text-navy sm:text-4xl">
        {prefix}{formatted}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

interface StatsCounterProps {
  totalFunding: number;
  grantCount: number;
}

export function StatsCounter({ totalFunding, grantCount }: StatsCounterProps) {
  return (
    <section className="border-y bg-white py-4">
      <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <StatItem
          icon={<DollarSign className="size-5" />}
          value={totalFunding}
          prefix="$"
          suffix="B+"
          label="Active Funding Tracked"
          format={(n) => (n / 1_000_000_000).toFixed(1)}
        />
        <StatItem
          icon={<FileText className="size-5" />}
          value={grantCount}
          suffix="+"
          label="Grant Programs"
        />
        <StatItem
          icon={<MapPin className="size-5" />}
          value={50}
          label="States Covered"
        />
      </div>
    </section>
  );
}
