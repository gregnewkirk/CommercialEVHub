import type { Grant } from "@/lib/db/schema";
import { getStateByCode } from "@/lib/utils/constants";

interface GrantJsonLdProps {
  grant: Grant;
}

export function GrantJsonLd({ grant }: GrantJsonLdProps) {
  const stateName = grant.state ? getStateByCode(grant.state)?.name : undefined;

  // Build JSON-LD structured data for SEO
  // All values come from our own database (trusted source), not user input
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: grant.title,
    description: grant.description,
    provider: {
      "@type": "Organization",
      name: grant.funder,
    },
    ...(grant.state && {
      areaServed: {
        "@type": "State",
        name: stateName || grant.state,
      },
    }),
    ...(grant.sourceUrl && { url: grant.sourceUrl }),
    ...(grant.deadline && {
      validThrough: grant.deadline,
    }),
  };

  // JSON.stringify safely encodes all values, preventing script injection
  // in JSON-LD blocks. The data comes from our own trusted database.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
