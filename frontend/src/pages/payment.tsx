import { useState } from "react";
import { useLocation, useSearchParams } from "wouter";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "react-paypal-js";
import PageHead from "@/components/PageHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Send, Lock, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

interface PaymentData {
  trackingToken: string;
  repairCost: number;
  shippingCost: number;
  total: number;
  device: string;
  name: string;
  email: string;
}

// Stripe Payment Component
function StripePaymentForm({
  paymentData,
  onSuccess,
}: {
  paymentData: PaymentData;
  onSuccess: (paymentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: paymentData.name,
          email: paymentData.email,
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: error.message || "An error occurred",
        });
        return;
      }

      // Process payment on backend
      const response = await fetch("/api/payments/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingToken: paymentData.trackingToken,
          amount: Math.round(paymentData.total * 100), // cents
          paymentMethodId: paymentMethod?.id,
          description: `Repair service for ${paymentData.device}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment processing failed");
      }

      const result = await response.json();
      toast({
        title: "Payment Successful",
        description: `Transaction ID: ${result.paymentId}`,
      });

      onSuccess(result.paymentId);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border p-4 rounded-md">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-none h-12"
      >
        {loading ? "Processing..." : `Pay €${paymentData.total.toFixed(2)}`}
      </Button>

      <div className="flex items-center gap-2 text-xs text-gray-600">
        <Lock className="w-3 h-3" />
        Your payment information is secure and encrypted
      </div>
    </form>
  );
}

// PayPal Payment Component
function PayPalPaymentForm({
  paymentData,
  onSuccess,
}: {
  paymentData: PaymentData;
  onSuccess: (paymentId: string) => void;
}) {
  const { toast } = useToast();

  const createOrder = async (data: any, actions: any) => {
    try {
      const response = await fetch("/api/payments/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingToken: paymentData.trackingToken,
          amount: paymentData.total.toFixed(2),
          description: `Repair service for ${paymentData.device}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create PayPal order");
      }

      const { orderId } = await response.json();
      return orderId;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      const response = await fetch("/api/payments/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: data.orderID,
          trackingToken: paymentData.trackingToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment capture failed");
      }

      const result = await response.json();
      toast({
        title: "Payment Successful",
        description: `Transaction ID: ${result.paymentId}`,
      });

      onSuccess(result.paymentId);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const onError = () => {
    toast({
      variant: "destructive",
      title: "Payment Failed",
      description: "An error occurred during payment processing",
    });
  };

  return (
    <div>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        style={{ layout: "vertical" }}
      />
    </div>
  );
}

// Main Payment Page
export default function Payment() {
  const [, setLocation] = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useI18n();
  const [paymentComplete, setPaymentComplete] = useState(false);

  const trackingToken = searchParams.token;

  if (!trackingToken) {
    return (
      <>
        <PageHead title="Payment" description="Complete your repair payment" />
        <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Payment Link</h1>
          <Button onClick={() => setLocation("/")} className="rounded-none">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </>
    );
  }

  // Get payment data from localStorage
  const paymentData: PaymentData = JSON.parse(
    localStorage.getItem(`payment_${trackingToken}`) || '{}'
  );

  if (!paymentData.trackingToken) {
    return (
      <>
        <PageHead title="Payment" description="Complete your repair payment" />
        <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
          <h1 className="text-2xl font-bold mb-4">Payment Session Expired</h1>
          <Button onClick={() => setLocation("/booking")} className="rounded-none">
            Create New Booking
          </Button>
        </div>
      </>
    );
  }

  if (paymentComplete) {
    return (
      <>
        <PageHead title="Payment Complete" description="Payment successful" />
        <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-green-700 mb-4">
              ✓ Payment Successful
            </h1>
            <p className="text-gray-600 mb-6">
              Your repair payment has been processed. We'll send you a confirmation
              email shortly.
            </p>
            <div className="bg-white border rounded p-4 mb-6">
              <p className="text-sm text-gray-600">Tracking Code</p>
              <p className="text-xl font-mono font-bold">{trackingToken}</p>
            </div>
            <div className="flex gap-3 flex-col sm:flex-row">
              <Button
                onClick={() => setLocation(`/track?token=${trackingToken}`)}
                className="flex-1 rounded-none"
              >
                Track Repair
              </Button>
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
                className="flex-1 rounded-none"
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead title="Payment" description="Complete your repair payment" />

      <div className="bg-secondary/30 pt-12 pb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-2">Repair Payment</h1>
          <p className="text-muted-foreground">
            Complete your payment securely using Stripe or PayPal
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Summary */}
          <div className="md:col-span-1">
            <div className="bg-card border p-6 sticky top-4">
              <h3 className="font-bold mb-4 border-b pb-2">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Device</span>
                  <span className="font-medium">{paymentData.device}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Repair Cost</span>
                  <span>€{paymentData.repairCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Shipping</span>
                  <span>€{paymentData.shippingCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>€{paymentData.total.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Track: {trackingToken.substring(0, 8)}...
              </p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="bg-card border p-8">
              <Tabs defaultValue="stripe" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-none mb-8">
                  <TabsTrigger value="stripe" className="rounded-none">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Credit Card
                  </TabsTrigger>
                  <TabsTrigger value="paypal" className="rounded-none">
                    <Send className="w-4 h-4 mr-2" />
                    PayPal
                  </TabsTrigger>
                </TabsList>

                {/* Stripe Tab */}
                <TabsContent value="stripe">
                  {STRIPE_PUBLIC_KEY ? (
                    <Elements stripe={stripePromise}>
                      <StripePaymentForm
                        paymentData={paymentData}
                        onSuccess={() => setPaymentComplete(true)}
                      />
                    </Elements>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm">
                      ⚠️ Stripe is not configured. Please contact support.
                    </div>
                  )}
                </TabsContent>

                {/* PayPal Tab */}
                <TabsContent value="paypal">
                  {PAYPAL_CLIENT_ID ? (
                    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "EUR", intent: "capture" }}>
                      <PayPalPaymentForm
                        paymentData={paymentData}
                        onSuccess={() => setPaymentComplete(true)}
                      />
                    </PayPalScriptProvider>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm">
                      ⚠️ PayPal is not configured. Please contact support.
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-6 border-t text-xs text-gray-500 space-y-1">
                <p>✓ Secure and encrypted payment processing</p>
                <p>✓ Your payment information is never stored</p>
                <p>✓ Compliant with PCI DSS standards</p>
              </div>
            </div>

            <div className="mt-4">
              <Button
                onClick={() => setLocation("/booking")}
                variant="outline"
                className="w-full rounded-none"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Booking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
