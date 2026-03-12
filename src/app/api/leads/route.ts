import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/db/queries";

interface LeadRequest {
  grantId?: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  zipCode: string;
  hardwareType?: string;
  fleetSize?: number;
  numPorts?: number;
  sourcePage?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  // Allow digits, spaces, dashes, parens, plus sign — at least 10 digits
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10;
}

function validateZip(zip: string): boolean {
  return /^\d{5}$/.test(zip);
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadRequest = await request.json();

    // Validate required fields
    const errors: string[] = [];
    if (!body.companyName?.trim()) errors.push("Company name is required");
    if (!body.contactName?.trim()) errors.push("Contact name is required");
    if (!body.email?.trim()) errors.push("Email is required");
    else if (!validateEmail(body.email)) errors.push("Invalid email format");
    if (!body.phone?.trim()) errors.push("Phone is required");
    else if (!validatePhone(body.phone)) errors.push("Invalid phone format");
    if (!body.zipCode?.trim()) errors.push("Zip code is required");
    else if (!validateZip(body.zipCode)) errors.push("Invalid zip code");

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    const lead = await createLead({
      grantId: body.grantId,
      companyName: body.companyName.trim(),
      contactName: body.contactName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      zipCode: body.zipCode.trim(),
      hardwareType: body.hardwareType,
      fleetSize: body.fleetSize,
      numPorts: body.numPorts,
      sourcePage: body.sourcePage,
    });

    return NextResponse.json({
      success: true,
      message: "Lead submitted successfully",
      leadId: lead.id,
    });
  } catch (err) {
    console.error("Lead submission error:", err);
    return NextResponse.json(
      { error: "Failed to submit lead. Please try again." },
      { status: 500 }
    );
  }
}
