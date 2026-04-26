import { Router } from "express";
import rateLimit from "express-rate-limit";
import { submitContact } from "../controllers/contact.controller.js";

export const contactRouter = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: "Too Many Requests", message: "Too many contact submissions. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

contactRouter.post("/", contactLimiter, submitContact);
