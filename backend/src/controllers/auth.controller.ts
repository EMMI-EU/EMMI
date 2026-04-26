import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../lib/db.js";
import { adminsTable, auditLogsTable } from "../lib/schema.js";
import { env, isProd } from "../config/env.js";
import { LoginSchema } from "../lib/validation.js";

const COOKIE_NAME = "emmi_auth";
const TOKEN_TTL = "2h";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "strict" as const,
  maxAge: 2 * 60 * 60 * 1000,
  path: "/",
};

// ─── Helper: Log audit event ───────────────────────────────────────────────
async function logAuditEvent(
  adminId: number | null,
  action: string,
  req: Request,
  details?: string
) {
  try {
    await db.insert(auditLogsTable).values({
      adminId: adminId || null,
      action,
      ipAddress: getClientIp(req),
      userAgent: req.get("user-agent") || null,
      details: details || null,
    });
  } catch (err) {
    console.error("[Audit Log Error]", err);
  }
}

// ─── Helper: Get real client IP ────────────────────────────────────────────
function getClientIp(req: Request): string {
  if (env.TRUST_PROXY) {
    const forwarded = req.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

// ─── Login endpoint ────────────────────────────────────────────────────────
export async function login(req: Request, res: Response) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    await logAuditEvent(null, "LOGIN_FAILED_VALIDATION", req);
    res.status(400).json({ 
      error: "Validation error", 
      message: parsed.error.issues[0]?.message 
    });
    return;
  }

  const { email, password } = parsed.data;

  try {
    // Find user by email
    const [admin] = await db
      .select()
      .from(adminsTable)
      .where(eq(adminsTable.email, email));

    if (!admin) {
      // Constant-time-ish delay to mitigate brute-force timing attacks
      await new Promise((r) => setTimeout(r, 300));
      await logAuditEvent(null, "LOGIN_FAILED_USER_NOT_FOUND", req, email);
      res.status(401).json({ 
        error: "Unauthorized", 
        message: "Invalid email or password" 
      });
      return;
    }

    // Check if account is active
    if (admin.isActive !== "true") {
      await logAuditEvent(admin.id, "LOGIN_FAILED_ACCOUNT_DISABLED", req);
      res.status(403).json({ 
        error: "Forbidden", 
        message: "This account has been disabled" 
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      await new Promise((r) => setTimeout(r, 300));
      await logAuditEvent(admin.id, "LOGIN_FAILED_WRONG_PASSWORD", req);
      res.status(401).json({ 
        error: "Unauthorized", 
        message: "Invalid email or password" 
      });
      return;
    }

    // Create JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      env.JWT_SECRET,
      { expiresIn: TOKEN_TTL }
    );

    // Set cookie
    res.cookie(COOKIE_NAME, token, cookieOptions);

    // Log successful login
    await logAuditEvent(admin.id, "LOGIN_SUCCESS", req);

    res.json({ 
      success: true, 
      message: "Logged in successfully",
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      }
    });

  } catch (err) {
    console.error("[Login Error]", err);
    await logAuditEvent(null, "LOGIN_ERROR", req, String(err));
    res.status(500).json({ 
      error: "Server Error", 
      message: isProd ? "Something went wrong" : String(err) 
    });
  }
}

// ─── Logout endpoint ───────────────────────────────────────────────────────
export async function logout(req: Request, res: Response) {
  const adminId = req.admin?.id;
  res.clearCookie(COOKIE_NAME, { path: "/", secure: isProd, sameSite: "strict" });
  
  if (adminId) {
    await logAuditEvent(adminId, "LOGOUT", req);
  }
  
  res.json({ success: true, message: "Logged out" });
}

// ─── Get current user ──────────────────────────────────────────────────────
export function me(req: Request, res: Response) {
  if (!req.admin) {
    res.json({ role: null, user: null });
    return;
  }

  res.json({ 
    role: req.admin.role,
    user: {
      id: req.admin.id,
      email: req.admin.email,
      role: req.admin.role,
    }
  });
}
