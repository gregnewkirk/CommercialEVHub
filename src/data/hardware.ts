export interface HardwareOEM {
  slug: string;
  name: string;
  tagline: string;
  headquarters: string;
  founded: number;
  category: 'dcfc' | 'level2' | 'both';
  products: Product[];
  certifications: {
    epriListed: boolean;
    ocppVersion: string;
    energyStar: boolean;
    ulListed: boolean;
    nrtlCertified: boolean;
  };
  connectorTypes: string[];
  powerRange: string;
  description: string;
  website: string;
  logo: string;
  tier: 'standard' | 'verified' | 'enterprise';
  kybVerified: boolean;
}

export interface Product {
  name: string;
  type: 'Level 2' | 'DCFC';
  powerOutput: string;
  connectors: string[];
  networkCapable: boolean;
  ocppCompliant: boolean;
  priceRange: string;
}

export const hardwareOEMs: HardwareOEM[] = [
  {
    slug: "abb-e-mobility",
    name: "ABB E-mobility",
    tagline: "Global Leader in DC Fast Charging Technology",
    headquarters: "Zurich, Switzerland",
    founded: 1988,
    category: "dcfc",
    products: [
      {
        name: "Terra 184",
        type: "DCFC",
        powerOutput: "180 kW",
        connectors: ["CCS", "CHAdeMO"],
        networkCapable: true,
        ocppCompliant: true,
        priceRange: "$45,000 - $65,000",
      },
      {
        name: "Terra 360",
        type: "DCFC",
        powerOutput: "360 kW",
        connectors: ["CCS", "NACS"],
        networkCapable: true,
        ocppCompliant: true,
        priceRange: "$120,000 - $150,000",
      },
    ],
    certifications: {
      epriListed: true,
      ocppVersion: "OCPP 2.0.1",
      energyStar: true,
      ulListed: true,
      nrtlCertified: true,
    },
    connectorTypes: ["CCS", "CHAdeMO", "NACS"],
    powerRange: "180 kW - 360 kW",
    description: "ABB E-mobility is the world's leading provider of DC fast charging solutions for electric vehicles. With installations in over 85 countries, ABB delivers the highest reliability and broadest product portfolio in the commercial DCFC market.",
    website: "https://new.abb.com/ev-charging",
    logo: "/logos/abb.svg",
    tier: "enterprise",
    kybVerified: true,
  },
  {
    slug: "chargepoint",
    name: "ChargePoint",
    tagline: "The World's Largest EV Charging Network",
    headquarters: "Campbell, CA",
    founded: 2007,
    category: "both",
    products: [
      {
        name: "CP6000",
        type: "Level 2",
        powerOutput: "11.5 kW",
        connectors: ["J1772"],
        networkCapable: true,
        ocppCompliant: true,
        priceRange: "$4,500 - $7,000",
      },
      {
        name: "Express Plus",
        type: "DCFC",
        powerOutput: "Up to 500 kW",
        connectors: ["CCS", "NACS"],
        networkCapable: true,
        ocppCompliant: true,
        priceRange: "$100,000 - $180,000",
      },
    ],
    certifications: {
      epriListed: true,
      ocppVersion: "OCPP 1.6J / 2.0",
      energyStar: true,
      ulListed: true,
      nrtlCertified: true,
    },
    connectorTypes: ["J1772", "CCS", "NACS"],
    powerRange: "11.5 kW - 500 kW",
    description: "ChargePoint operates the world's largest EV charging network with a comprehensive portfolio spanning Level 2 workplace solutions to ultra-fast DC highway chargers. Their cloud-based platform provides fleet management, billing, and load management capabilities.",
    website: "https://chargepoint.com",
    logo: "/logos/chargepoint.svg",
    tier: "enterprise",
    kybVerified: true,
  },
  {
    slug: "siemens-emobility",
    name: "Siemens eMobility",
    tagline: "Industrial-Grade Charging Infrastructure",
    headquarters: "Munich, Germany",
    founded: 1847,
    category: "both",
    products: [
      {
        name: "VersiCharge",
        type: "Level 2",
        powerOutput: "Up to 19.2 kW",
        connectors: ["J1772"],
        networkCapable: true,
        ocppCompliant: true,
        priceRange: "$3,500 - $5,500",
      },
      {
        name: "SICHARGE D",
        type: "DCFC",
        powerOutput: "Up to 300 kW",
        connectors: ["CCS", "NACS"],
        networkCapable: true,
        ocppCompliant: true,
        priceRange: "$80,000 - $130,000",
      },
    ],
    certifications: {
      epriListed: true,
      ocppVersion: "OCPP 2.0.1",
      energyStar: true,
      ulListed: true,
      nrtlCertified: true,
    },
    connectorTypes: ["J1772", "CCS", "NACS"],
    powerRange: "19.2 kW - 300 kW",
    description: "Siemens eMobility brings over 175 years of electrical engineering expertise to the EV charging market. Their industrial-grade solutions are built for the most demanding commercial environments, from factory floors to highway corridors.",
    website: "https://siemens.com/emobility",
    logo: "/logos/siemens.svg",
    tier: "enterprise",
    kybVerified: true,
  },
  {
    slug: "btc-power",
    name: "BTC POWER",
    tagline: "Reliable DC Fast Charging Made in America",
    headquarters: "Santa Ana, CA",
    founded: 2004,
    category: "dcfc",
    products: [
      {
        name: "Gen 4 DCFC 180kW",
        type: "DCFC",
        powerOutput: "180 kW",
        connectors: ["CCS", "CHAdeMO"],
        networkCapable: true,
        ocppCompliant: true,
        priceRange: "$40,000 - $55,000",
      },
      {
        name: "Gen 4 DCFC 360kW",
        type: "DCFC",
        powerOutput: "360 kW",
        connectors: ["CCS", "NACS"],
        networkCapable: true,
        ocppCompliant: true,
        priceRange: "$90,000 - $120,000",
      },
    ],
    certifications: {
      epriListed: true,
      ocppVersion: "OCPP 1.6J",
      energyStar: true,
      ulListed: true,
      nrtlCertified: true,
    },
    connectorTypes: ["CCS", "CHAdeMO", "NACS"],
    powerRange: "60 kW - 360 kW",
    description: "BTC POWER is a leading American manufacturer of DC fast charging equipment, listed on EPRI's Trusted EV Charger list. Their California-made chargers power major networks and qualify for Buy America provisions in federal funding programs.",
    website: "https://btcpower.com",
    logo: "/logos/btcpower.svg",
    tier: "verified",
    kybVerified: true,
  },
  {
    slug: "enel-x-way",
    name: "Enel X Way",
    tagline: "Smart Charging for a Sustainable Future",
    headquarters: "Rome, Italy (NA HQ: Los Angeles, CA)",
    founded: 2017,
    category: "both",
    products: [
      {
        name: "JuiceBox Pro",
        type: "Level 2",
        powerOutput: "Up to 9.6 kW",
        connectors: ["J1772"],
        networkCapable: true,
        ocppCompliant: true,
        priceRange: "$2,500 - $4,000",
      },
      {
        name: "JuicePump",
        type: "DCFC",
        powerOutput: "Up to 200 kW",
        connectors: ["CCS", "CHAdeMO"],
        networkCapable: true,
        ocppCompliant: true,
        priceRange: "$50,000 - $80,000",
      },
    ],
    certifications: {
      epriListed: true,
      ocppVersion: "OCPP 1.6J / 2.0",
      energyStar: true,
      ulListed: true,
      nrtlCertified: true,
    },
    connectorTypes: ["J1772", "CCS", "CHAdeMO"],
    powerRange: "9.6 kW - 200 kW",
    description: "Enel X Way brings global energy expertise to EV charging with smart, connected solutions. Their JuiceBox platform integrates seamlessly with utility demand response programs, enabling property owners to monetize grid services.",
    website: "https://enelxway.com",
    logo: "/logos/enelxway.svg",
    tier: "verified",
    kybVerified: true,
  },
  {
    slug: "blink-charging",
    name: "Blink Charging",
    tagline: "Nationwide EV Charging Solutions",
    headquarters: "Miami Beach, FL",
    founded: 2009,
    category: "both",
    products: [
      {
        name: "Series 8",
        type: "Level 2",
        powerOutput: "Up to 19.2 kW",
        connectors: ["J1772"],
        networkCapable: true,
        ocppCompliant: true,
        priceRange: "$3,500 - $6,000",
      },
      {
        name: "Series 9",
        type: "DCFC",
        powerOutput: "Up to 180 kW",
        connectors: ["CCS"],
        networkCapable: true,
        ocppCompliant: true,
        priceRange: "$45,000 - $70,000",
      },
    ],
    certifications: {
      epriListed: false,
      ocppVersion: "OCPP 1.6J",
      energyStar: false,
      ulListed: true,
      nrtlCertified: true,
    },
    connectorTypes: ["J1772", "CCS"],
    powerRange: "7.7 kW - 180 kW",
    description: "Blink Charging provides a comprehensive suite of EV charging hardware and software solutions. Their owner/operator model and revenue-sharing programs make commercial EV deployment accessible for property owners of all sizes.",
    website: "https://blinkcharging.com",
    logo: "/logos/blink.svg",
    tier: "standard",
    kybVerified: true,
  },
  {
    slug: "tritium",
    name: "Tritium DCFC",
    tagline: "Compact, Modular DC Fast Charging",
    headquarters: "Brisbane, Australia (NA: Los Angeles)",
    founded: 2001,
    category: "dcfc",
    products: [
      {
        name: "RTM75",
        type: "DCFC",
        powerOutput: "75 kW",
        connectors: ["CCS"],
        networkCapable: true,
        ocppCompliant: true,
        priceRange: "$35,000 - $45,000",
      },
      {
        name: "PKM150",
        type: "DCFC",
        powerOutput: "150 kW",
        connectors: ["CCS", "NACS"],
        networkCapable: true,
        ocppCompliant: true,
        priceRange: "$55,000 - $75,000",
      },
    ],
    certifications: {
      epriListed: true,
      ocppVersion: "OCPP 2.0.1",
      energyStar: true,
      ulListed: true,
      nrtlCertified: true,
    },
    connectorTypes: ["CCS", "NACS"],
    powerRange: "75 kW - 150 kW",
    description: "Tritium designs and manufactures the world's most compact and reliable DC fast chargers. Their modular, liquid-cooled architecture enables easy maintenance and scalability, making them ideal for space-constrained commercial sites.",
    website: "https://tritiumcharging.com",
    logo: "/logos/tritium.svg",
    tier: "verified",
    kybVerified: true,
  },
  {
    slug: "autel-energy",
    name: "Autel Energy",
    tagline: "Next-Generation Commercial Charging Hardware",
    headquarters: "New York, NY",
    founded: 2004,
    category: "both",
    products: [
      {
        name: "MaxiCharger AC Elite",
        type: "Level 2",
        powerOutput: "Up to 19.2 kW",
        connectors: ["J1772", "NACS"],
        networkCapable: true,
        ocppCompliant: true,
        priceRange: "$3,000 - $5,000",
      },
      {
        name: "MaxiCharger DC Compact",
        type: "DCFC",
        powerOutput: "Up to 240 kW",
        connectors: ["CCS", "NACS"],
        networkCapable: true,
        ocppCompliant: true,
        priceRange: "$55,000 - $85,000",
      },
    ],
    certifications: {
      epriListed: false,
      ocppVersion: "OCPP 1.6J",
      energyStar: false,
      ulListed: true,
      nrtlCertified: true,
    },
    connectorTypes: ["J1772", "CCS", "NACS"],
    powerRange: "9.6 kW - 240 kW",
    description: "Autel Energy leverages 20 years of automotive diagnostics expertise to deliver reliable, cost-effective EV charging solutions. Their integrated NACS support and competitive pricing make them a strong choice for commercial deployments.",
    website: "https://autelenergy.com",
    logo: "/logos/autel.svg",
    tier: "standard",
    kybVerified: true,
  },
];
