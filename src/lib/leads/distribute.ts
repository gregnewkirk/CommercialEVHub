// Lead distribution logic
// In production, this queries the DB for matching installers and sends emails

interface DistributionResult {
  leadId: string;
  installerCount: number;
  status: "distributed" | "no_match";
}

export async function distributeLead(leadId: string): Promise<DistributionResult> {
  // Production implementation:
  // 1. Fetch the lead record from DB
  // 2. Query installers where:
  //    - service_areas overlaps with lead's state (derived from zip)
  //    - hardware_types overlaps with lead's hardware_type (if specified)
  //    - verified = true
  // 3. If a premium installer covers that zip → select only them
  // 4. Otherwise → select up to 3 matching installers, premium first
  // 5. Create lead_distributions records
  // 6. Update lead status to "distributed"
  // 7. For each matched installer, send notification email

  // Stub for now
  console.log(`Distributing lead ${leadId} to matching installers`);

  return {
    leadId,
    installerCount: 0,
    status: "no_match",
  };
}
