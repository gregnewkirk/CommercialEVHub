// Email templates for lead notifications

interface LeadEmailData {
  installerName: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  zipCode: string;
  grantTitle?: string;
  hardwareType?: string;
  portalUrl: string;
}

export function buildLeadNotificationEmail(data: LeadEmailData) {
  const subject = `New Lead: ${data.companyName} in ${data.zipCode}${data.grantTitle ? ` — ${data.grantTitle}` : ""}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
  <div style="background: #0F2B46; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #22C55E; margin: 0; font-size: 18px;">FleetChargeGrants.com</h1>
    <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0; font-size: 14px;">New Lead Notification</p>
  </div>

  <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
    <p>Hi ${data.installerName},</p>

    <p>A new fleet operator is looking for EV charging installation services in your area.</p>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr><td style="padding: 8px 0; color: #6b7280; width: 140px;">Company</td><td style="padding: 8px 0; font-weight: 600;">${data.companyName}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b7280;">Contact</td><td style="padding: 8px 0;">${data.contactName}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0;">${data.email}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b7280;">Phone</td><td style="padding: 8px 0;">${data.phone}</td></tr>
      <tr><td style="padding: 8px 0; color: #6b7280;">Zip Code</td><td style="padding: 8px 0;">${data.zipCode}</td></tr>
      ${data.grantTitle ? `<tr><td style="padding: 8px 0; color: #6b7280;">Grant Interest</td><td style="padding: 8px 0;">${data.grantTitle}</td></tr>` : ""}
      ${data.hardwareType ? `<tr><td style="padding: 8px 0; color: #6b7280;">Hardware</td><td style="padding: 8px 0;">${data.hardwareType}</td></tr>` : ""}
    </table>

    <a href="${data.portalUrl}" style="display: inline-block; background: #22C55E; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">View in Portal</a>

    <p style="margin-top: 24px; font-size: 13px; color: #6b7280;">
      Please reach out to this lead within 24 hours for the best conversion rate.
    </p>
  </div>

  <p style="margin-top: 16px; font-size: 12px; color: #9ca3af; text-align: center;">
    &copy; FleetChargeGrants.com &mdash; You received this because you&apos;re a registered installer.
  </p>
</body>
</html>`;

  return { subject, html };
}
