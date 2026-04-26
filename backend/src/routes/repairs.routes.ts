import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAdmin } from "../middleware/auth.js";
import {
  trackRepair,
  createRepair,
  listRepairs,
  getStats,
  updateRepairStatus,
} from "../controllers/repairs.controller.js";

export const repairsRouter = Router();

const trackLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 30,
  message: { error: "Too Many Requests", message: "Too many tracking requests. Please wait." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Rate limiter: booking submissions — prevents spam/abuse ──────────────────
// 5 repair requests per hour per IP is more than enough for any real customer
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: "Too Many Requests", message: "Too many repair requests submitted. Please try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Rate limiter: contact form — prevents email flooding ─────────────────────
// Re-exported for use in contact routes via app.ts if needed
export const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: "Too Many Requests", message: "Too many messages sent. Please wait before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Public ───────────────────────────────────────────────────────────────────
repairsRouter.get("/track/:token", trackLimiter, trackRepair);
repairsRouter.post("/", bookingLimiter, createRepair);

// ─── Admin Protected ──────────────────────────────────────────────────────────
repairsRouter.get("/", requireAdmin, listRepairs);
repairsRouter.get("/stats", requireAdmin, getStats);
repairsRouter.patch("/:id/status", requireAdmin, updateRepairStatus);
