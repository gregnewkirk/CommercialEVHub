import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getInstallerBySlug } from "@/lib/db/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Star,
  Zap,
} from "lucide-react";
import { getHardwareLabel, getStateByCode } from "@/lib/utils/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const installer = await getInstallerBySlug(slug);
  if (!installer) return { title: "Installer Not Found" };

  return {
    title: `${installer.companyName} — Certified EV Charger Installer`,
    description: installer.description.slice(0, 160),
  };
}

// JSON-LD component using our own trusted database data
// JSON.stringify safely encodes all values, preventing injection
function InstallerJsonLd({ installer }: { installer: { companyName: string; description: string; phone: string; email: string; website: string | null } }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: installer.companyName,
    description: installer.description,
    telephone: installer.phone,
    email: installer.email,
    ...(installer.website && { url: installer.website }),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function InstallerProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const installer = await getInstallerBySlug(slug);
  if (!installer) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/installers" className="hover:text-foreground">
          Installers
        </Link>
        <ChevronRight className="size-3" />
        <span className="font-medium text-foreground">{installer.companyName}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-navy/5">
          <Building2 className="size-8 text-navy/50" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-navy">{installer.companyName}</h1>
            {installer.verified && (
              <CheckCircle2 className="size-5 text-ev-green" />
            )}
            {installer.tier === "premium" && (
              <Badge className="gap-1 bg-amber-100 text-amber-700 border-amber-200">
                <Star className="size-3" />
                Premium Partner
              </Badge>
            )}
          </div>
          <p className="mt-2 text-muted-foreground">{installer.description}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Contact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="size-4 text-muted-foreground" />
              <span>{installer.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="size-4 text-muted-foreground" />
              <span>{installer.email}</span>
            </div>
            {installer.website && (
              <a
                href={installer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-ev-green hover:underline"
              >
                <Globe className="size-4" />
                Visit Website
                <ExternalLink className="size-3" />
              </a>
            )}
          </CardContent>
        </Card>

        {/* Service Areas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-4" />
              Service Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {installer.serviceAreas.map((area: string) => {
                const state = getStateByCode(area);
                return (
                  <Badge key={area} variant="secondary">
                    {state ? state.name : area}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Hardware Specialties */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="size-4" />
              Hardware Specialties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {installer.hardwareTypes.map((hw: string) => (
                <Badge key={hw} variant="outline" className="gap-1">
                  <Zap className="size-3 text-ev-green" />
                  {getHardwareLabel(hw)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Request Quote CTA */}
        <Card className="border-ev-green/20 bg-ev-green/5">
          <CardContent className="py-6 text-center">
            <h3 className="text-lg font-semibold text-navy">Need a Quote?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Contact {installer.companyName} directly for a project estimate.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <a
                href={`tel:${installer.phone.replace(/\D/g, "")}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-ev-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ev-green/90"
              >
                <Phone className="size-3.5" />
                Call Now
              </a>
              <a
                href={`mailto:${installer.email}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-navy/20 bg-white px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-muted"
              >
                <Mail className="size-3.5" />
                Email
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <InstallerJsonLd installer={installer} />
    </div>
  );
}
