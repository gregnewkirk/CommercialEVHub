import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadsTable } from "@/components/portal/leads-table";

export const metadata: Metadata = {
  title: "My Leads",
};

// Mock data — replace with DB query when Supabase is connected
const MOCK_LEADS = [
  {
    id: "1",
    companyName: "Metro Transit Authority",
    contactName: "Sarah Chen",
    email: "sarah@metrotransit.gov",
    phone: "(212) 555-0100",
    zipCode: "10001",
    hardwareType: "dcfc",
    grantTitle: "NEVI Formula Program",
    status: "contacted",
    createdAt: "2026-03-05",
  },
  {
    id: "2",
    companyName: "Green Fleet Logistics",
    contactName: "Marcus Johnson",
    email: "marcus@greenfleet.com",
    phone: "(310) 555-0200",
    zipCode: "90210",
    hardwareType: "level_2",
    grantTitle: "CA Clean Vehicle Rebate",
    status: "viewed",
    createdAt: "2026-03-04",
  },
  {
    id: "3",
    companyName: "Pacific School District",
    contactName: "Lisa Park",
    email: "lpark@pacificsd.edu",
    phone: "(415) 555-0300",
    zipCode: "94102",
    hardwareType: "level_2",
    grantTitle: "EPA Clean School Bus",
    status: "sent",
    createdAt: "2026-03-02",
  },
  {
    id: "4",
    companyName: "Sunrise Delivery Co.",
    contactName: "Tom Rivera",
    email: "tom@sunrisedelivery.com",
    phone: "(718) 555-0400",
    zipCode: "11201",
    hardwareType: "dcfc",
    grantTitle: null,
    status: "won",
    createdAt: "2026-02-28",
  },
  {
    id: "5",
    companyName: "County Fleet Services",
    contactName: "Janet Williams",
    email: "jwilliams@county.gov",
    phone: "(832) 555-0500",
    zipCode: "77001",
    hardwareType: "level_2",
    grantTitle: "TX TERP Clean Fleet",
    status: "lost",
    createdAt: "2026-02-20",
  },
];

export default function PortalLeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">My Leads</h1>
        <p className="text-sm text-muted-foreground">
          Manage and track fleet operator leads distributed to your account.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            All Leads ({MOCK_LEADS.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeadsTable leads={MOCK_LEADS} />
        </CardContent>
      </Card>
    </div>
  );
}
