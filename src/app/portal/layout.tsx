import type { Metadata } from "next";
import { PortalNav } from "@/components/portal/portal-nav";
import { Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: {
    template: "%s — Installer Portal",
    default: "Installer Portal",
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-navy/5">
            <Building2 className="size-5 text-navy" />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy">Installer Portal</p>
          </div>
        </div>
        <PortalNav />
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
