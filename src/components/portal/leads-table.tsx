"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  zipCode: string;
  hardwareType: string | null;
  grantTitle: string | null;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["sent", "viewed", "contacted", "won", "lost"] as const;

const STATUS_COLORS: Record<string, string> = {
  sent: "bg-gray-100 text-gray-700",
  viewed: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(leads.map((l) => [l.id, l.status]))
  );

  async function updateStatus(leadId: string, newStatus: string) {
    setStatuses((prev) => ({ ...prev, [leadId]: newStatus }));

    // In production, call API to update:
    // await fetch(`/api/portal/leads/${leadId}`, {
    //   method: "PATCH",
    //   body: JSON.stringify({ status: newStatus }),
    // });
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No leads yet.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Leads from fleet operators will appear here when they request quotes.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs font-medium uppercase text-muted-foreground">
            <th className="pb-3 pr-4">Date</th>
            <th className="pb-3 pr-4">Company</th>
            <th className="hidden pb-3 pr-4 md:table-cell">Contact</th>
            <th className="hidden pb-3 pr-4 lg:table-cell">Zip</th>
            <th className="hidden pb-3 pr-4 lg:table-cell">Hardware</th>
            <th className="hidden pb-3 pr-4 md:table-cell">Grant</th>
            <th className="pb-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-muted/50">
              <td className="py-3 pr-4 text-muted-foreground">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 pr-4">
                <div>
                  <p className="font-medium text-navy">{lead.companyName}</p>
                  <p className="text-xs text-muted-foreground md:hidden">
                    {lead.contactName}
                  </p>
                </div>
              </td>
              <td className="hidden py-3 pr-4 md:table-cell">
                <div>
                  <p>{lead.contactName}</p>
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                </div>
              </td>
              <td className="hidden py-3 pr-4 lg:table-cell">
                {lead.zipCode}
              </td>
              <td className="hidden py-3 pr-4 lg:table-cell">
                {lead.hardwareType && (
                  <Badge variant="outline" className="text-xs">
                    {lead.hardwareType === "dcfc" ? "DCFC" : "Level 2"}
                  </Badge>
                )}
              </td>
              <td className="hidden py-3 pr-4 md:table-cell text-xs text-muted-foreground">
                {lead.grantTitle ?? "—"}
              </td>
              <td className="py-3">
                <select
                  value={statuses[lead.id]}
                  onChange={(e) => updateStatus(lead.id, e.target.value)}
                  className={`rounded-md border-0 px-2 py-1 text-xs font-medium ${STATUS_COLORS[statuses[lead.id]] ?? ""}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
