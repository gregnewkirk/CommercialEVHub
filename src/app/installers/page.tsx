import type { Metadata } from "next";
import { getInstallers } from "@/lib/db/queries";
import { InstallerCard } from "@/components/installers/installer-card";

export const metadata: Metadata = {
  title: "Certified EV Charger Installers",
  description:
    "Find certified commercial EV charging station installers in your area. Connect with verified contractors for Level 2 and DC fast charger installations.",
};

export default async function InstallersPage() {
  const installers = await getInstallers();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
          Certified EV Charger Installers
        </h1>
        <p className="mt-2 text-muted-foreground">
          Connect with verified commercial EVSE contractors who specialize in fleet
          charging infrastructure and grant compliance.
        </p>
      </div>

      <div className="space-y-3">
        {installers.map((installer) => (
          <InstallerCard key={installer.id} installer={installer} />
        ))}
      </div>
    </div>
  );
}
