"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";

interface LeadCaptureFormProps {
  grantId: string;
  grantTitle: string;
}

export function LeadCaptureForm({ grantId, grantTitle }: LeadCaptureFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const data = {
      grantId,
      companyName: form.get("companyName") as string,
      contactName: form.get("contactName") as string,
      email: form.get("email") as string,
      phone: form.get("phone") as string,
      zipCode: form.get("zipCode") as string,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to submit. Please try again.");
      }

      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An error occurred.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Card className="border-ev-green/30 bg-ev-green/5">
        <CardContent className="flex flex-col items-center py-8 text-center">
          <CheckCircle2 className="size-10 text-ev-green" />
          <h3 className="mt-3 text-lg font-semibold text-navy">Thank You!</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Up to 3 certified installers in your area will contact you within 24 hours.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Get Expert Help</CardTitle>
        <p className="text-sm text-muted-foreground">
          Need help applying for the {grantTitle}? Connect with a certified local installer.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="companyName" className="mb-1 block text-xs font-medium">
              Company Name *
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              required
              className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-ev-green focus:ring-1 focus:ring-ev-green/30"
              placeholder="Acme Fleet Services"
            />
          </div>

          <div>
            <label htmlFor="contactName" className="mb-1 block text-xs font-medium">
              Contact Name *
            </label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              required
              className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-ev-green focus:ring-1 focus:ring-ev-green/30"
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-ev-green focus:ring-1 focus:ring-ev-green/30"
              placeholder="jane@acmefleet.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-xs font-medium">
              Phone *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-ev-green focus:ring-1 focus:ring-ev-green/30"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="zipCode" className="mb-1 block text-xs font-medium">
              Zip Code *
            </label>
            <input
              id="zipCode"
              name="zipCode"
              type="text"
              required
              pattern="[0-9]{5}"
              className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-ev-green focus:ring-1 focus:ring-ev-green/30"
              placeholder="90210"
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}

          <Button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-ev-green text-white hover:bg-ev-green/90"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Connect with Installers"
            )}
          </Button>

          <p className="text-center text-[10px] text-muted-foreground">
            By submitting, you agree to be contacted by up to 3 certified installers.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
