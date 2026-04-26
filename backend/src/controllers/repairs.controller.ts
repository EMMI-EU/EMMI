import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../lib/db.js";
import { repairsTable, type RepairStatus } from "../lib/schema.js";
import { CreateRepairSchema, UpdateStatusSchema } from "../lib/validation.js";
import {
  notifyAdminNewBooking,
  sendBookingConfirmation,
  sendStatusUpdate,
} from "../services/mailer.js";

// ─── Public: Track by token ───────────────────────────────────────────────────
export async function trackRepair(req: Request, res: Response) {
  const { token } = req.params;

  if (!token || typeof token !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) {
    res.status(400).json({ error: "Bad Request", message: "Valid tracking token is required" });
    return;
  }

  const [repair] = await db
    .select()
    .from(repairsTable)
    .where(eq(repairsTable.trackingToken, token))
    .limit(1);

  if (!repair) {
    res.status(404).json({ error: "Not Found", message: "No repair found for this tracking token" });
    return;
  }

  // ONLY return safe public fields — NEVER expose email/phone/name
  res.json({
    status: repair.status,
    device: repair.device,
    serviceType: repair.serviceType,
    createdAt: repair.createdAt.toISOString(),
    updatedAt: repair.updatedAt.toISOString(),
  });
}

// ─── Public: Create repair booking ───────────────────────────────────────────
export async function createRepair(req: Request, res: Response) {
  const parsed = CreateRepairSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation error",
      message: parsed.error.issues.map((i) => i.message).join("; "),
    });
    return;
  }

  const data = parsed.data;

  const [repair] = await db
    .insert(repairsTable)
    .values({
      name: data.name,
      email: data.email,
      phone: data.phone,
      device: data.device,
      issue: data.issue,
      serviceType: data.serviceType,
      country: data.country,
      status: "pending",
    })
    .returning();

  if (!repair) {
    res.status(500).json({ error: "Server Error", message: "Failed to create repair request" });
    return;
  }

  // Fire emails asynchronously — don't block the response
  void notifyAdminNewBooking(repair);
  void sendBookingConfirmation(repair);

  res.status(201).json({
    trackingToken: repair.trackingToken,
    message: "Repair request created. Check your email for the tracking token.",
  });
}

// ─── Admin: List all repairs ──────────────────────────────────────────────────
export async function listRepairs(req: Request, res: Response) {
  const { status, page = "1", limit = "25" } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 25));
  const offset = (pageNum - 1) * limitNum;

  let query = db.select().from(repairsTable).$dynamic();

  if (status && ["pending", "in_progress", "completed", "rejected"].includes(status)) {
    query = query.where(eq(repairsTable.status, status as RepairStatus));
  }

  const repairs = await query
    .orderBy(repairsTable.createdAt)
    .limit(limitNum)
    .offset(offset);

  res.json({
    data: repairs.map((r) => ({
      id: r.id,
      trackingToken: r.trackingToken,
      name: r.name,
      email: r.email,
      phone: r.phone,
      device: r.device,
      issue: r.issue,
      serviceType: r.serviceType,
      country: r.country,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
    page: pageNum,
    limit: limitNum,
  });
}

// ─── Admin: Get repair stats ──────────────────────────────────────────────────
export async function getStats(_req: Request, res: Response) {
  const all = await db.select().from(repairsTable);

  res.json({
    total: all.length,
    pending: all.filter((r) => r.status === "pending").length,
    in_progress: all.filter((r) => r.status === "in_progress").length,
    completed: all.filter((r) => r.status === "completed").length,
    rejected: all.filter((r) => r.status === "rejected").length,
    homeService: all.filter((r) => r.serviceType === "home").length,
    mailService: all.filter((r) => r.serviceType === "mail").length,
  });
}

// ─── Admin: Update repair status ─────────────────────────────────────────────
export async function updateRepairStatus(req: Request, res: Response) {
  const idStr = req.params["id"];
  const id = parseInt(idStr ?? "", 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Bad Request", message: "Invalid repair ID" });
    return;
  }

  const parsed = UpdateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation error",
      message: parsed.error.issues[0]?.message,
    });
    return;
  }

  const [repair] = await db
    .update(repairsTable)
    .set({ status: parsed.data.status, updatedAt: new Date() })
    .where(eq(repairsTable.id, id))
    .returning();

  if (!repair) {
    res.status(404).json({ error: "Not Found", message: "Repair request not found" });
    return;
  }

  // Notify customer of status change
  void sendStatusUpdate({
    trackingToken: repair.trackingToken,
    name: repair.name,
    email: repair.email,
    device: repair.device,
    status: repair.status,
  });

  res.json({
    id: repair.id,
    status: repair.status,
    updatedAt: repair.updatedAt.toISOString(),
  });
}
