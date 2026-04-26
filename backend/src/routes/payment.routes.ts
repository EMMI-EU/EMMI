import { Router } from "express";
import * as paymentController from "../controllers/payment.controller.js";

const router = Router();

// Stripe routes
router.post("/stripe", paymentController.createStripePayment);

// PayPal routes
router.post("/paypal/create-order", paymentController.createPayPalOrder);
router.post("/paypal/capture-order", paymentController.capturePayPalOrder);

// Status route
router.get("/:trackingToken/status", paymentController.getPaymentStatus);

export default router;
