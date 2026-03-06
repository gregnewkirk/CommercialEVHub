import type { Metadata } from "next";
import { Outfit, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "CommercialEVHub | The Definitive Commercial EV Charging Directory",
  description:
    "The B2B directory for commercial EV charging infrastructure. Find verified contractors, hardware OEMs, and calculate ROI for your fleet or facility charging deployment.",
  keywords: [
    "commercial EV charging",
    "EV charging contractors",
    "EV charging directory",
    "commercial charging infrastructure",
    "fleet charging",
    "EV hardware OEMs",
    "charging station installation",
    "B2B EV charging",
  ],
  openGraph: {
    title: "CommercialEVHub | The Definitive Commercial EV Charging Directory",
    description:
      "The B2B directory for commercial EV charging infrastructure. Find verified contractors, hardware OEMs, and calculate ROI for your charging deployment.",
    url: "https://commercialevhub.com",
    siteName: "CommercialEVHub",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CommercialEVHub | Commercial EV Charging Directory",
    description:
      "The B2B directory for commercial EV charging infrastructure.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://commercialevhub.com"),
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CommercialEVHub",
  url: "https://commercialevhub.com",
  description:
    "The definitive B2B directory for commercial EV charging infrastructure. Connecting facility managers with verified contractors and hardware OEMs.",
  foundingDate: "2025",
  sameAs: [
    "https://linkedin.com/company/commercialevhub",
    "https://x.com/commercialevhub",
    "https://github.com/commercialevhub",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "hello@commercialevhub.com",
    availableLanguage: "English",
  },
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  knowsAbout: [
    "Commercial EV Charging",
    "Electric Vehicle Infrastructure",
    "Fleet Charging Solutions",
    "EV Charging Hardware",
    "Charging Station Installation",
  ],
};

// Static JSON-LD string from hardcoded data only - safe for dangerouslySetInnerHTML
const organizationJsonLdString = JSON.stringify(organizationJsonLd);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: organizationJsonLdString,
          }}
        />
      </head>
      <body
        className={`${outfit.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
