"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, X } from "lucide-react";
import { US_STATES, HARDWARE_TYPES } from "@/lib/utils/constants";

interface InstallerProfile {
  companyName: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  serviceAreas: string[];
  hardwareTypes: string[];
}

export function ProfileForm({
  initialData,
}: {
  initialData: InstallerProfile;
}) {
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateField(field: keyof InstallerProfile, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function toggleServiceArea(code: string) {
    setForm((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(code)
        ? prev.serviceAreas.filter((s) => s !== code)
        : [...prev.serviceAreas, code],
    }));
    setSaved(false);
  }

  function toggleHardware(type: string) {
    setForm((prev) => ({
      ...prev,
      hardwareTypes: prev.hardwareTypes.includes(type)
        ? prev.hardwareTypes.filter((h) => h !== type)
        : [...prev.hardwareTypes, type],
    }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);

    // In production, save to DB via API:
    // await fetch("/api/portal/profile", {
    //   method: "PUT",
    //   body: JSON.stringify(form),
    // });

    // Simulate save delay
    await new Promise((r) => setTimeout(r, 500));

    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase text-muted-foreground">
          Basic Information
        </h2>

        <div>
          <label htmlFor="companyName" className="mb-1 block text-sm font-medium">
            Company Name
          </label>
          <Input
            id="companyName"
            value={form.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ev-green/50"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium">
              Phone
            </label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="website" className="mb-1 block text-sm font-medium">
            Website
          </label>
          <Input
            id="website"
            value={form.website}
            onChange={(e) => updateField("website", e.target.value)}
            placeholder="https://"
          />
        </div>
      </section>

      {/* Service Areas */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase text-muted-foreground">
          Service Areas
        </h2>
        <p className="text-xs text-muted-foreground">
          Select all states where you provide installation services.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {US_STATES.map((state) => {
            const isSelected = form.serviceAreas.includes(state.code);
            return (
              <button
                key={state.code}
                type="button"
                onClick={() => toggleServiceArea(state.code)}
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${
                  isSelected
                    ? "border-ev-green bg-ev-green/10 text-ev-green"
                    : "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {state.code}
                {isSelected && <X className="size-3" />}
              </button>
            );
          })}
        </div>
        {form.serviceAreas.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {form.serviceAreas.length} state{form.serviceAreas.length > 1 ? "s" : ""} selected
          </p>
        )}
      </section>

      {/* Hardware Types */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase text-muted-foreground">
          Hardware Specialties
        </h2>
        <div className="flex flex-wrap gap-2">
          {HARDWARE_TYPES.map((hw) => {
            const isSelected = form.hardwareTypes.includes(hw.value);
            return (
              <Badge
                key={hw.value}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer ${
                  isSelected
                    ? "bg-ev-green hover:bg-ev-green/90"
                    : "hover:bg-muted"
                }`}
                onClick={() => toggleHardware(hw.value)}
              >
                {hw.label}
              </Badge>
            );
          })}
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-3 border-t pt-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-ev-green hover:bg-ev-green/90"
        >
          {saving ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Save className="mr-2 size-4" />
          )}
          Save Profile
        </Button>
        {saved && (
          <span className="text-sm text-ev-green">Profile saved!</span>
        )}
      </div>
    </div>
  );
}
