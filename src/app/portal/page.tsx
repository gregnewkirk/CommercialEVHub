import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, TrendingUp, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

// Mock data — replace with real DB queries when Supabase is connected
const MOCK_STATS = {
  totalLeads: 24,
  leadsThisMonth: 7,
  viewedLeads: 18,
};

const MOCK_RECENT_LEADS = [
  {
    id: "1",
    companyName: "Metro Transit Authority",
    contactName: "Sarah Chen",
    zipCode: "10001",
    createdAt: "2026-03-05",
    hardwareType: "dcfc",
  },
  {
    id: "2",
    companyName: "Green Fleet Logistics",
    contactName: "Marcus Johnson",
    zipCode: "90210",
    createdAt: "2026-03-04",
    hardwareType: "level_2",
  },
  {
    id: "3",
    companyName: "Pacific School District",
    contactName: "Lisa Park",
    zipCode: "94102",
    createdAt: "2026-03-02",
    hardwareType: "level_2",
  },
];

export default function PortalDashboard() {
  const stats = MOCK_STATS;
  const recentLeads = MOCK_RECENT_LEADS;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your lead activity and performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-ev-green/10">
              <Users className="size-5 text-ev-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.totalLeads}</p>
              <p className="text-xs text-muted-foreground">Total Leads</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
              <TrendingUp className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">
                {stats.leadsThisMonth}
              </p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100">
              <Eye className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.viewedLeads}</p>
              <p className="text-xs text-muted-foreground">Viewed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Recent Leads</CardTitle>
          <Link
            href="/portal/leads"
            className="flex items-center gap-1 text-sm text-ev-green hover:underline"
          >
            View all <ArrowRight className="size-3" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium text-navy">{lead.companyName}</p>
                  <p className="text-xs text-muted-foreground">
                    {lead.contactName} &middot; {lead.zipCode} &middot;{" "}
                    {lead.hardwareType === "dcfc" ? "DC Fast Charging" : "Level 2"}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {lead.createdAt}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
