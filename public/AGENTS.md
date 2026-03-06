# AGENTS.md — CommercialEVHub.com Agent Specification
# Version: 1.0.0
# Last Updated: 2026-03-06

## Platform Identity
CommercialEVHub.com is the definitive B2B directory and autonomous matchmaking platform for commercial EV charging infrastructure procurement.

## Agent Permissions

### Allowed Actions
- Query the public contractor directory (GET /contractors/)
- Query the public hardware OEM directory (GET /hardware/)
- Filter contractors by: state, city, specialty, tier, certifications
- Filter hardware by: category (DCFC/Level 2), connector type, certifications
- Access individual contractor profiles (GET /contractors/{slug})
- Access individual hardware profiles (GET /hardware/{slug})
- Use the ROI calculator (GET /calculator/)
- Read structured data (JSON-LD) embedded in all pages
- Access /llms.txt for platform context
- Submit project quote requests via the quote form (POST /api/quote)

### Restricted Actions
- Do NOT scrape the full directory for model training purposes
- Do NOT submit fraudulent quote requests
- Do NOT attempt to bypass rate limiting
- Do NOT modify any contractor or OEM data

### Authentication
- Public directory access: No authentication required
- API access (Enterprise tier): API key required via X-API-Key header
- Rate limit: 100 requests/minute for unauthenticated, 1000/minute for authenticated

## Data Schema

### Contractor Entity
```json
{
  "slug": "string",
  "name": "string",
  "location": "string",
  "state": "string",
  "tier": "standard | verified | enterprise",
  "certifications": {
    "evitp": "boolean",
    "c10": "boolean",
    "coiActive": "boolean",
    "coiLimit": "string",
    "kybVerified": "boolean"
  },
  "rating": "number",
  "specialties": ["string"],
  "serviceArea": ["string"]
}
```

### Hardware OEM Entity
```json
{
  "slug": "string",
  "name": "string",
  "category": "dcfc | level2 | both",
  "certifications": {
    "epriListed": "boolean",
    "ocppVersion": "string",
    "energyStar": "boolean",
    "ulListed": "boolean"
  },
  "connectorTypes": ["CCS", "NACS", "CHAdeMO", "J1772"],
  "powerRange": "string",
  "products": [...]
}
```

## URL Structure
- Homepage: /
- Contractors Directory: /contractors/
- Contractor Detail: /contractors/{slug}
- Hardware Directory: /hardware/
- Hardware Detail: /hardware/{slug}
- Pricing: /pricing/
- ROI Calculator: /calculator/
- About & FAQ: /about/
- Get a Quote: /quote/

## Structured Data
All pages include JSON-LD structured data following Schema.org types:
- Organization (platform-level)
- LocalBusiness (contractor profiles)
- Product (hardware listings)
- FAQPage (FAQ section)
- Service (contractor services)

## Contact for API Integration
- Email: api@commercialevhub.com
- Documentation: /api/docs (coming soon)
