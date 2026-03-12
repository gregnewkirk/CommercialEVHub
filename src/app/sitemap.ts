import type { MetadataRoute } from "next";
import { MOCK_GRANTS, MOCK_INSTALLERS } from "@/lib/mock-data";
import { US_STATES } from "@/lib/utils/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fleetchargegrants.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/grants`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/installers`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Grant detail pages
  const grantPages: MetadataRoute.Sitemap = MOCK_GRANTS.map((grant) => ({
    url: `${SITE_URL}/grants/${grant.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // State hub pages
  const statePages: MetadataRoute.Sitemap = US_STATES.map((state) => ({
    url: `${SITE_URL}/grants/state/${state.code.toLowerCase()}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // City hub pages (from grants with cities)
  const citySet = new Set<string>();
  const cityPages: MetadataRoute.Sitemap = [];
  for (const grant of MOCK_GRANTS) {
    if (grant.city && grant.state) {
      const key = `${grant.state}-${grant.city}`;
      if (!citySet.has(key)) {
        citySet.add(key);
        cityPages.push({
          url: `${SITE_URL}/grants/state/${grant.state.toLowerCase()}/${encodeURIComponent(grant.city.toLowerCase().replace(/\s+/g, "-"))}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  }

  // Installer profile pages
  const installerPages: MetadataRoute.Sitemap = MOCK_INSTALLERS.map(
    (installer) => ({
      url: `${SITE_URL}/installers/${installer.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  return [
    ...staticPages,
    ...grantPages,
    ...statePages,
    ...cityPages,
    ...installerPages,
  ];
}
