import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGrantBySlug, getRelatedGrants } from "@/lib/db/queries";
import { GrantHeader } from "@/components/grants/grant-header";
import { EligibilityMatrix } from "@/components/grants/eligibility-matrix";
import { FinancialBreakdown } from "@/components/grants/financial-breakdown";
import { LeadCaptureForm } from "@/components/grants/lead-capture-form";
import { RelatedGrants } from "@/components/grants/related-grants";
import { GrantJsonLd } from "@/components/grants/grant-jsonld";
import { formatCurrencyRange } from "@/lib/utils/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const grant = await getGrantBySlug(slug);
  if (!grant) return { title: "Grant Not Found" };

  const amount = formatCurrencyRange(grant.amountMin, grant.amountMax);

  return {
    title: grant.title,
    description: `${grant.title} — ${amount}. ${grant.description.slice(0, 140)}`,
    openGraph: {
      title: `${grant.title} | FleetChargeGrants.com`,
      description: grant.description.slice(0, 200),
    },
  };
}

export default async function GrantDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const grant = await getGrantBySlug(slug);
  if (!grant) notFound();

  const relatedGrants = await getRelatedGrants(grant.id);

  return (
    <>
      <GrantJsonLd grant={grant} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:flex lg:gap-8">
          {/* Main content */}
          <div className="min-w-0 flex-1 space-y-6">
            <GrantHeader grant={grant} />
            <EligibilityMatrix grant={grant} />
            <FinancialBreakdown grant={grant} />
          </div>

          {/* Sidebar */}
          <aside className="mt-8 w-full shrink-0 space-y-6 lg:mt-0 lg:w-80">
            <LeadCaptureForm grantId={grant.id} grantTitle={grant.title} />
            <RelatedGrants grants={relatedGrants} />
          </aside>
        </div>
      </div>
    </>
  );
}
