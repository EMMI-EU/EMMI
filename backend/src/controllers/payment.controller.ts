import type { Request, Response } from "express";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "../lib/db.js";
import { paymentsTable, repairsTable } from "../lib/schema.js";
import { env, isProd } from "../config/env.js";

function getStripeClient() {
  if (!env.STRIPE_SECRET_KEY) return null;
  return new Stripe(env.STRIPE_SECRET_KEY);
}

function getPayPalBaseUrl() {
  return env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

async function getPayPalAccessToken() {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) return null;

  const credentials = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`PayPal authentication failed: HTTP ${response.status}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("PayPal did not return an access token");
  return data.access_token;
}

function parsePositiveAmount(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

// ─── Stripe Payment ───────────────────────────────────────────────────────────
export async function createStripePayment(req: Request, res: Response) {
  try {
    const stripe = getStripeClient();
    if (!stripe) {
      res.status(503).json({ error: "Stripe not configured", message: "Stripe is not configured on the server" });
      return;
    }

    const { trackingToken, amount, paymentMethodId, description } = req.body;
    const amountInCents = parsePositiveAmount(amount);

    if (!trackingToken || !amountInCents || !paymentMethodId) {
      res.status(400).json({
        error: "Missing required fields",
        message: "trackingToken, amount, and paymentMethodId are required",
      });
      return;
    }

    const [repair] = await db
      .select()
      .from(repairsTable)
      .where(eq(repairsTable.trackingToken, trackingToken));

    if (!repair) {
      res.status(404).json({ error: "Not Found", message: "Repair not found" });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountInCents),
      currency: "eur",
      payment_method: paymentMethodId,
      confirm: true,
      description: description || `Repair for ${repair.device}`,
      metadata: {
        trackingToken,
        repairId: String(repair.id),
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    await db.insert(paymentsTable).values({
      repairId: repair.id,
      trackingToken,
      method: "stripe",
      amount: String(amountInCents / 100),
      status: paymentIntent.status === "succeeded" ? "completed" : "pending",
      transactionId: paymentIntent.id,
      metadata: JSON.stringify({ paymentIntentId: paymentIntent.id, status: paymentIntent.status }),
    });

    if (paymentIntent.status === "succeeded") {
      await db
        .update(repairsTable)
        .set({ status: "in_progress", updatedAt: new Date() })
        .where(eq(repairsTable.id, repair.id));
    }

    res.json({ success: true, paymentId: paymentIntent.id, status: paymentIntent.status });
  } catch (error) {
    console.error("[Stripe Payment Error]", error);
    res.status(500).json({
      error: "Payment processing failed",
      message: isProd ? "An error occurred during payment processing" : error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// ─── PayPal Create Order ───────────────────────────────────────────────────────
export async function createPayPalOrder(req: Request, res: Response) {
  try {
    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      res.status(503).json({ error: "PayPal not configured", message: "PayPal is not configured on the server" });
      return;
    }

    const { trackingToken, amount, description } = req.body;
    const amountInEuros = parsePositiveAmount(amount);

    if (!trackingToken || !amountInEuros) {
      res.status(400).json({ error: "Missing required fields", message: "trackingToken and amount are required" });
      return;
    }

    const [repair] = await db
      .select()
      .from(repairsTable)
      .where(eq(repairsTable.trackingToken, trackingToken));

    if (!repair) {
      res.status(404).json({ error: "Not Found", message: "Repair not found" });
      return;
    }

    const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: trackingToken,
            description: description || `Repair service for ${repair.device}`,
            amount: {
              currency_code: "EUR",
              value: amountInEuros.toFixed(2),
            },
          },
        ],
      }),
    });

    const order = (await response.json()) as { id?: string; status?: string; message?: string };
    if (!response.ok || !order.id) {
      throw new Error(order.message || `PayPal order creation failed: HTTP ${response.status}`);
    }

    await db.insert(paymentsTable).values({
      repairId: repair.id,
      trackingToken,
      method: "paypal",
      amount: amountInEuros.toFixed(2),
      status: "pending",
      transactionId: order.id,
      metadata: JSON.stringify({ orderStatus: order.status ?? "CREATED" }),
    });

    res.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("[PayPal Order Error]", error);
    res.status(500).json({
      error: "Order creation failed",
      message: isProd ? "An error occurred" : error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// ─── PayPal Capture Order ──────────────────────────────────────────────────────
export async function capturePayPalOrder(req: Request, res: Response) {
  try {
    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      res.status(503).json({ error: "PayPal not configured", message: "PayPal is not configured on the server" });
      return;
    }

    const { orderId, trackingToken } = req.body;
    if (!orderId || !trackingToken) {
      res.status(400).json({ error: "Missing required fields", message: "orderId and trackingToken are required" });
      return;
    }

    const [payment] = await db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.transactionId, orderId));

    if (!payment) {
      res.status(404).json({ error: "Not Found", message: "Payment not found" });
      return;
    }

    const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const capture = (await response.json()) as { id?: string; status?: string; message?: string };
    if (!response.ok) {
      throw new Error(capture.message || `PayPal capture failed: HTTP ${response.status}`);
    }

    const completed = capture.status === "COMPLETED";
    await db
      .update(paymentsTable)
      .set({ status: completed ? "completed" : "pending", updatedAt: new Date(), metadata: JSON.stringify(capture) })
      .where(eq(paymentsTable.id, payment.id));

    if (completed) {
      const [repair] = await db
        .select()
        .from(repairsTable)
        .where(eq(repairsTable.trackingToken, trackingToken));

      if (repair) {
        await db
          .update(repairsTable)
          .set({ status: "in_progress", updatedAt: new Date() })
          .where(eq(repairsTable.id, repair.id));
      }
    }

    res.json({ success: true, paymentId: orderId, status: capture.status ?? "captured" });
  } catch (error) {
    console.error("[PayPal Capture Error]", error);
    res.status(500).json({
      error: "Payment capture failed",
      message: isProd ? "An error occurred" : error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// ─── Get Payment Status ────────────────────────────────────────────────────────
export async function getPaymentStatus(req: Request, res: Response) {
  try {
    const { trackingToken } = req.params;
    if (!trackingToken) {
      res.status(400).json({ error: "Missing tracking token" });
      return;
    }

    const [payment] = await db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.trackingToken, trackingToken));

    if (!payment) {
      res.status(404).json({ error: "Not Found", message: "Payment not found" });
      return;
    }

    res.json({
      trackingToken,
      method: payment.method,
      amount: payment.amount,
      status: payment.status,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    });
  } catch (error) {
    console.error("[Get Payment Status Error]", error);
    res.status(500).json({
      error: "Failed to get payment status",
      message: isProd ? "An error occurred" : error instanceof Error ? error.message : "Unknown error",
    });
  }
}
