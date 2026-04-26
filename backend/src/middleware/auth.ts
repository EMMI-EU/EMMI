import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthPayload {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AuthPayload;
    }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.["emmi_auth"];

  if (!token) {
    res.status(401).json({ error: "Unauthorized", message: "Authentication required" });
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    if (payload.role !== "admin") {
      res.status(403).json({ error: "Forbidden", message: "Insufficient permissions" });
      return;
    }
    req.admin = payload;
    next();
  } catch {
    res.clearCookie("emmi_auth", { path: "/" });
    res.status(401).json({ error: "Unauthorized", message: "Invalid or expired session" });
  }
}
