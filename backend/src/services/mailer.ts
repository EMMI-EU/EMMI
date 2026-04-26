import nodemailer from "nodemailer";
import { env } from "../config/env.js";

type RepairStatus = "pending" | "in_progress" | "completed" | "rejected";

const STATUS_LABELS: Record<RepairStatus, string> = {
  pending: "Received & Pending Review",
  in_progress: "Currently Being Repaired",
  completed: "Repair Completed ✅",
  rejected: "Unable to Repair",
};

function createTransporter() {
  if (!env.ZOHO_EMAIL || !env.ZOHO_PASSWORD) {
    console.warn("⚠️  ZOHO_EMAIL / ZOHO_PASSWORD not set — emails disabled");
    return null;
  }
  return nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true,
    auth: { user: env.ZOHO_EMAIL, pass: env.ZOHO_PASSWORD },
  });
}

const transporter = createTransporter();

async function send(options: nodemailer.SendMailOptions) {
  if (!transporter) return;
  try {
    await transporter.sendMail(options);
  } catch (err) {
    console.error("[Mailer] Failed to send email:", err);
  }
}

function baseLayout(title: string, content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <!-- Header -->
      <tr><td style="background:#0f172a;padding:28px 32px;border-radius:8px 8px 0 0;">
        <p style="margin:0;color:#fff;font-size:20px;font-weight:bold;">EMMI Europe Tech</p>
        <p style="margin:4px 0 0;color:#94a3b8;font-size:13px;">Premium Device Repair</p>
      </td></tr>
      <!-- Body -->
      <tr><td style="background:#ffffff;padding:32px;border-radius:0 0 8px 8px;">
        <h2 style="margin:0 0 20px;color:#0f172a;font-size:18px;">${title}</h2>
        ${content}
      </td></tr>
      <!-- Footer -->
      <tr><td style="padding:16px 0;text-align:center;">
        <p style="margin:0;color:#94a3b8;font-size:12px;">
          EMMI Europe Tech · contact@emmi-eu.com · 
          <a href="https://emmi-eu.com" style="color:#94a3b8;">emmi-eu.com</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

// ─── 1. Admin: New Booking ────────────────────────────────────────────────────
export async function notifyAdminNewBooking(repair: {
  id: number;
  trackingToken: string;
  name: string;
  email: string;
  phone: string;
  device: string;
  issue: string;
  serviceType: string;
  country: string;
}) {
  const content = `
    <p style="color:#374151;margin:0 0 20px;">A new repair request was submitted.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${[
        ["Internal ID", `#${repair.id}`],
        ["Tracking Token", repair.trackingToken],
        ["Customer", repair.name],
        ["Email", repair.email],
        ["Phone", repair.phone],
        ["Country", repair.country],
        ["Device", repair.device],
        ["Service", repair.serviceType === "home" ? "On-site Home Repair" : "Mail-in Service"],
        ["Issue", repair.issue],
      ]
        .map(
          ([label, value]) => `
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:10px 0;color:#6b7280;font-size:14px;width:40%;font-weight:600;">${label}</td>
          <td style="padding:10px 0;color:#111827;font-size:14px;">${value}</td>
        </tr>`
        )
        .join("")}
    </table>
    <div style="margin-top:24px;">
      <a href="https://emmi-eu.com/admin" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-size:14px;font-weight:bold;">
        Open Admin Dashboard →
      </a>
    </div>`;

  await send({
    from: `"EMMI Europe Tech" <${env.ZOHO_EMAIL}>`,
    to: env.ZOHO_EMAIL,
    subject: `🔧 New Repair Request #${repair.id} — ${repair.name}`,
    html: baseLayout("New Repair Request Received", content),
  });
}

// ─── 2. Customer: Booking Confirmation ───────────────────────────────────────
export async function sendBookingConfirmation(repair: {
  id: number;
  trackingToken: string;
  name: string;
  email: string;
  device: string;
  serviceType: string;
}) {
  const content = `
    <p style="color:#374151;margin:0 0 16px;">Dear <strong>${repair.name}</strong>,</p>
    <p style="color:#374151;margin:0 0 20px;">
      Thank you for choosing EMMI Europe Tech. Your repair request has been received 
      and our team will contact you within 24 hours.
    </p>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:20px 0;">
      <p style="margin:0 0 10px;"><strong>Your Tracking Token:</strong></p>
      <code style="background:#0f172a;color:#a5f3fc;padding:10px 16px;border-radius:6px;font-size:16px;display:block;word-break:break-all;">${repair.trackingToken}</code>
      <p style="margin:12px 0 0;font-size:13px;color:#6b7280;">Save this token — you'll need it to track your repair status.</p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:8px 0;color:#6b7280;font-size:14px;width:40%;">Device</td>
        <td style="padding:8px 0;color:#111827;font-size:14px;">${repair.device}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#6b7280;font-size:14px;">Service</td>
        <td style="padding:8px 0;color:#111827;font-size:14px;">${repair.serviceType === "home" ? "On-site Home Repair" : "Mail-in Service"}</td>
      </tr>
    </table>
    <a href="https://emmi-eu.com/track?token=${repair.trackingToken}" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-size:14px;font-weight:bold;">
      Track My Repair →
    </a>
    <p style="margin:24px 0 0;color:#6b7280;font-size:13px;">
      Questions? Chat with us on 
      <a href="https://wa.me/393792730062" style="color:#0f172a;">WhatsApp</a> 
      or reply to this email.
    </p>`;

  await send({
    from: `"EMMI Europe Tech" <${env.ZOHO_EMAIL}>`,
    to: repair.email,
    subject: `✅ Repair Request Confirmed — Track with your token`,
    html: baseLayout("Your Repair Request is Confirmed", content),
  });
}

// ─── 3. Customer: Status Update ──────────────────────────────────────────────
export async function sendStatusUpdate(repair: {
  trackingToken: string;
  name: string;
  email: string;
  device: string;
  status: RepairStatus;
}) {
  const label = STATUS_LABELS[repair.status] ?? repair.status;
  const isCompleted = repair.status === "completed";
  const isRejected = repair.status === "rejected";

  const content = `
    <p style="color:#374151;margin:0 0 16px;">Dear <strong>${repair.name}</strong>,</p>
    <p style="color:#374151;margin:0 0 20px;">
      There's an update on your <strong>${repair.device}</strong> repair.
    </p>
    <div style="background:${isCompleted ? "#f0fdf4" : isRejected ? "#fef2f2" : "#f0f9ff"};border:1px solid ${isCompleted ? "#86efac" : isRejected ? "#fca5a5" : "#7dd3fc"};border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
      <p style="margin:0;font-size:18px;font-weight:bold;color:${isCompleted ? "#16a34a" : isRejected ? "#dc2626" : "#0369a1"};">
        ${label}
      </p>
    </div>
    ${isRejected ? '<p style="color:#374151;margin:0 0 16px;">Unfortunately we were unable to complete the repair. Our team will contact you shortly to discuss your options.</p>' : ""}
    ${isCompleted ? '<p style="color:#374151;margin:0 0 16px;">Your device is ready! Our team will arrange the next steps for delivery or pickup.</p>' : ""}
    <a href="https://emmi-eu.com/track?token=${repair.trackingToken}" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-size:14px;font-weight:bold;">
      View Full Status →
    </a>`;

  await send({
    from: `"EMMI Europe Tech" <${env.ZOHO_EMAIL}>`,
    to: repair.email,
    subject: `🔄 Repair Update: ${label} — EMMI Europe Tech`,
    html: baseLayout("Repair Status Update", content),
  });
}

// ─── 4. Contact form ─────────────────────────────────────────────────────────
export async function sendContactNotification(contact: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const content = `
    <p style="color:#374151;margin:0 0 20px;">New contact form submission.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${[
        ["From", contact.name],
        ["Email", contact.email],
        ["Subject", contact.subject],
      ]
        .map(
          ([label, value]) => `
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:10px 0;color:#6b7280;font-size:14px;width:30%;font-weight:600;">${label}</td>
          <td style="padding:10px 0;color:#111827;font-size:14px;">${value}</td>
        </tr>`
        )
        .join("")}
    </table>
    <div style="margin-top:20px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;">
      <p style="margin:0 0 8px;font-weight:600;color:#374151;">Message:</p>
      <p style="margin:0;color:#374151;white-space:pre-wrap;">${contact.message}</p>
    </div>
    <div style="margin-top:20px;">
      <a href="mailto:${contact.email}" style="display:inline-block;background:#0f172a;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;font-size:14px;">
        Reply to ${contact.name} →
      </a>
    </div>`;

  await send({
    from: `"EMMI Europe Tech" <${env.ZOHO_EMAIL}>`,
    to: env.ZOHO_EMAIL,
    subject: `📩 Contact: ${contact.subject} — ${contact.name}`,
    html: baseLayout("New Contact Form Message", content),
  });
}
