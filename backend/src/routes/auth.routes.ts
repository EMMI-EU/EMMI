import { Router } from "express";
import { login, logout, me } from "../controllers/auth.controller.js";
import { requireAdmin } from "../middleware/auth.js";
import rateLimit from "express-rate-limit";

export const authRouter = Router();

// ─── Rate limiter: strict per-IP login throttle ───────────────────────────────
// 5 attempts per 15 min window — blocks brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // ↓ from 10 → 5 for stricter protection
  message: { error: "Too Many Requests", message: "Too many login attempts. Please wait 15 minutes before trying again." },
  standardHeaders: true,     // Sends RateLimit-* headers (RFC 6585)
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed attempts
});

authRouter.post("/login", loginLimiter, login);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAdmin, me);
