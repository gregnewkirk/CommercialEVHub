import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/portal/profile-form";

export const metadata: Metadata = {
  title: "My Profile",
};

// Mock profile — replace with DB lookup by auth user when Supabase connected
const MOCK_PROFILE = {
  companyName: "GreenCharge Solutions",
  description:
    "Full-service EV charging installation for commercial fleets, transit agencies, and municipalities. EVITP-certified with 200+ Level 2 and DCFC installations completed.",
  phone: "(415) 555-0123",
  email: "partners@greenchargesolutions.com",
  website: "https://greenchargesolutions.com",
  serviceAreas: ["CA", "NV", "OR", "WA"],
  hardwareTypes: ["level_2", "dcfc"],
};

export default function PortalProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your company information visible to fleet operators.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Company Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm initialData={MOCK_PROFILE} />
        </CardContent>
      </Card>
    </div>
  );
}
