import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { env, isProd } from "./config/env.js";
import { authRouter } from "./routes/auth.routes.js";
import { repairsRouter } from "./routes/repairs.routes.js";
import { contactRouter } from "./routes/contact.routes.js";
import paymentsRouter from "./routes/payment.routes.js";

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
// Enable only when the app runs behind a trusted reverse proxy (Render/Cloudflare/Nginx).
if (env.TRUST_PROXY) {
  app.set("trust proxy", 1);
}

// Security headers. CSP is configured to keep the local app protected while still
// allowing Stripe/PayPal and Google Fonts when the payment page is used.
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: isProd
      ? {
          useDefaults: true,
          directives: {
            "default-src": ["'self'"],
            "script-src": [
              "'self'",
              "'unsafe-inline'",
              "https://js.stripe.com",
              "https://www.paypal.com",
              "https://www.paypalobjects.com",
            ],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
            "img-src": ["'self'", "data:", "blob:", "https:"],
            "frame-src": ["'self'", "https://js.stripe.com", "https://hooks.stripe.com", "https://www.paypal.com"],
            "connect-src": [
              "'self'",
              "https://api.stripe.com",
              "https://www.paypal.com",
              "https://www.sandbox.paypal.com",
            ],
          },
        }
      : false,
  })
);

// Global API rate limit — broad protection against DDoS/scraping.
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Too Many Requests", message: "Too many requests from this IP. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", globalApiLimiter);

// CORS. Supports one or more comma-separated origins. Same-origin requests work without CORS.
const allowedOrigins = env.ALLOWED_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept", "X-Requested-With"],
  })
);

// Body parsing & cookies.
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// API routes.
app.use("/api/auth", authRouter);
app.use("/api/repairs", repairsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/payments", paymentsRouter);

app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok", env: env.NODE_ENV });
});

// Serve the built React app when frontend/dist exists. This is required for a
// single Render Web Service deployment.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, "../../frontend/dist");

app.use(express.static(frontendDist));

app.get(/^(?!\/api\/).*/, (_req, res, next) => {
  res.sendFile(path.join(frontendDist, "index.html"), (err) => {
    if (err) next();
  });
});

// API 404.
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not Found", message: "Endpoint does not exist" });
});

// Global error handler.
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[Error]", err);
  res.status(500).json({ error: "Internal Server Error", message: isProd ? "Something went wrong" : err.message });
});

export default app;
