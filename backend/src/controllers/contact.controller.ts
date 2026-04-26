import type { Request, Response } from "express";
import { db } from "../lib/db.js";
import { contactsTable } from "../lib/schema.js";
import { ContactSchema } from "../lib/validation.js";
import { sendContactNotification } from "../services/mailer.js";

export async function submitContact(req: Request, res: Response) {
  const parsed = ContactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation error",
      message: parsed.error.issues.map((i) => i.message).join("; "),
    });
    return;
  }

  const data = parsed.data;

  await db.insert(contactsTable).values(data);
  void sendContactNotification(data);

  res.json({ success: true, message: "Message received. We'll get back to you within 24 hours." });
}
