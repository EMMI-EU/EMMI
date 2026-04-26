import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import PageHead from "@/components/PageHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, ArrowRight, Copy, Check } from "lucide-react";
import { repairsApi } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

export default function Booking() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useI18n();
  const [trackingToken, setTrackingToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, t("booking.validation.name")),
    email: z.string().email(t("booking.validation.email")),
    phone: z.string().min(5, t("booking.validation.phone")),
    device: z.enum(["phone", "computer", "tablet", "coffee_machine", "washing_machine"], {
      errorMap: () => ({ message: t("booking.validation.device") }),
    }),
    issue: z.string().min(10, t("booking.validation.issue")),
    serviceType: z.enum(["home", "mail"]),
    country: z.string().min(2, t("booking.validation.country")),
    website: z.string().max(0).optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", email: "", phone: "",
      device: "phone", issue: "",
      serviceType: "mail", country: "", website: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const result = await repairsApi.create(values);
      setTrackingToken(result.trackingToken);
      toast({ title: t("booking.success.title"), description: t("booking.success.desc") });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("booking.error.generic");
      toast({ variant: "destructive", title: t("booking.error.title"), description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const copyToken = () => {
    if (!trackingToken) return;
    navigator.clipboard.writeText(trackingToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (trackingToken) {
    const handleDownloadReceipt = () => {
      // Store receipt data for the receipt page
      const receiptData = {
        trackingToken,
        name: form.getValues("name"),
        email: form.getValues("email"),
        phone: form.getValues("phone"),
        device: form.getValues("device"),
        issue: form.getValues("issue"),
        serviceType: form.getValues("serviceType"),
        country: form.getValues("country"),
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(`receipt_${trackingToken}`, JSON.stringify(receiptData));
      setLocation(`/receipt?token=${trackingToken}`);
    };

    const handleProceedToPayment = () => {
      // Store payment data
      const paymentData = {
        trackingToken,
        repairCost: 45, // Default cost
        shippingCost: 15, // Default shipping
        total: 60, // Total
        device: form.getValues("device"),
        name: form.getValues("name"),
        email: form.getValues("email"),
      };
      localStorage.setItem(`payment_${trackingToken}`, JSON.stringify(paymentData));
      setLocation(`/payment?token=${trackingToken}`);
    };

    return (
      <>
        <PageHead title={t("booking.confirmed.title")} description={t("booking.confirmed.desc")} canonical="/booking" />
        <div className="container mx-auto px-4 py-24 max-w-2xl">
          <div className="bg-card border p-10 flex flex-col items-center text-center shadow-sm">
            <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
            <h1 className="text-3xl font-serif font-bold mb-3">{t("booking.confirmed.heading")}</h1>
            <p className="text-muted-foreground mb-8 max-w-md">{t("booking.confirmed.body")}</p>

            <div className="w-full bg-muted border rounded-lg p-4 mb-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("booking.confirmed.token_label")}</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono break-all text-left bg-background border rounded px-3 py-2">
                  {trackingToken}
                </code>
                <Button size="icon" variant="outline" onClick={copyToken} className="shrink-0">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* New Options */}
            <div className="w-full space-y-3 mb-6">
              <Button onClick={handleDownloadReceipt} className="w-full rounded-none h-12" variant="outline">
                📋 Download Receipt & QR Code
              </Button>
              <Button onClick={handleProceedToPayment} className="w-full rounded-none h-12">
                💳 Pay for Repair Service
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button onClick={() => setLocation(`/track?token=${trackingToken}`)} className="flex-1 rounded-none">
                {t("booking.confirmed.track")}
              </Button>
              <Button variant="outline" onClick={() => setLocation("/")} className="flex-1 rounded-none">
                {t("booking.confirmed.home")}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead title={t("booking.page.title")} description={t("booking.page.desc")} canonical="/booking" />

      <div className="bg-secondary/30 pt-16 pb-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">{t("booking.heading")}</h1>
          <p className="text-muted-foreground">{t("booking.subheading")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-card border shadow-sm p-6 md:p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              {/* Personal Info */}
              <div className="space-y-5">
                <h3 className="text-xl font-serif font-bold border-b pb-2">{t("booking.step1")}</h3>
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("booking.field.name")} *</FormLabel>
                    <FormControl><Input placeholder="Jean Dupont" className="rounded-none h-12" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("booking.field.email")} *</FormLabel>
                      <FormControl><Input type="email" placeholder="jean@example.com" className="rounded-none h-12" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("booking.field.phone")} *</FormLabel>
                      <FormControl><Input placeholder="+33 6 12 34 56 78" className="rounded-none h-12" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="country" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("booking.field.country")} *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-none h-12"><SelectValue placeholder={t("booking.field.country.placeholder")} /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="France">🇫🇷 France</SelectItem>
                        <SelectItem value="Germany">🇩🇪 Germany</SelectItem>
                        <SelectItem value="Italy">🇮🇹 Italy</SelectItem>
                        <SelectItem value="Spain">🇪🇸 Spain</SelectItem>
                        <SelectItem value="Belgium">🇧🇪 Belgium</SelectItem>
                        <SelectItem value="Netherlands">🇳🇱 Netherlands</SelectItem>
                        <SelectItem value="Switzerland">🇨🇭 Switzerland</SelectItem>
                        <SelectItem value="Austria">🇦🇹 Austria</SelectItem>
                        <SelectItem value="Portugal">🇵🇹 Portugal</SelectItem>
                        <SelectItem value="Luxembourg">🇱🇺 Luxembourg</SelectItem>
                        <SelectItem value="Sweden">🇸🇪 Sweden</SelectItem>
                        <SelectItem value="Denmark">🇩🇰 Denmark</SelectItem>
                        <SelectItem value="Norway">🇳🇴 Norway</SelectItem>
                        <SelectItem value="Finland">🇫🇮 Finland</SelectItem>
                        <SelectItem value="Poland">🇵🇱 Poland</SelectItem>
                        <SelectItem value="Czech Republic">🇨🇿 Czech Republic</SelectItem>
                        <SelectItem value="Hungary">🇭🇺 Hungary</SelectItem>
                        <SelectItem value="Romania">🇷🇴 Romania</SelectItem>
                        <SelectItem value="Greece">🇬🇷 Greece</SelectItem>
                        <SelectItem value="Other">🌍 {t("booking.country.other")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Device & Issue */}
              <div className="space-y-5 pt-2">
                <h3 className="text-xl font-serif font-bold border-b pb-2">{t("booking.step2")}</h3>
                <FormField control={form.control} name="device" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("booking.field.device")} *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-none h-12"><SelectValue placeholder={t("booking.field.device.placeholder")} /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="phone">{t("booking.device.phone")}</SelectItem>
                        <SelectItem value="computer">{t("booking.device.computer")}</SelectItem>
                        <SelectItem value="tablet">{t("booking.device.tablet")}</SelectItem>
                        <SelectItem value="coffee_machine">{t("booking.device.coffee")}</SelectItem>
                        <SelectItem value="washing_machine">{t("booking.device.washing")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="issue" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("booking.field.issue")} *</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t("booking.field.issue.placeholder")} className="min-h-[120px] rounded-none resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Service Type */}
              <div className="space-y-5 pt-2">
                <h3 className="text-xl font-serif font-bold border-b pb-2">{t("booking.step3")}</h3>
                <FormField control={form.control} name="serviceType" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-secondary/20">
                          <FormControl><RadioGroupItem value="mail" /></FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer font-bold">{t("booking.service.mail.title")}</FormLabel>
                            <p className="text-sm text-muted-foreground">{t("booking.service.mail.desc")}</p>
                          </div>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-secondary/20">
                          <FormControl><RadioGroupItem value="home" /></FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer font-bold">{t("booking.service.home.title")}</FormLabel>
                            <p className="text-sm text-muted-foreground">{t("booking.service.home.desc")}</p>
                          </div>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...form.register("website")} />

              <div className="pt-4">
                <Button type="submit" className="w-full h-14 text-base rounded-none" disabled={submitting}>
                  {submitting ? t("booking.submitting") : (<>{t("booking.submit")} <ArrowRight className="w-5 h-5 ml-2" /></>)}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  {t("booking.legal.prefix")}{" "}
                  <a href="/privacy" className="underline">{t("booking.legal.privacy")}</a> {t("booking.legal.and")}{" "}
                  <a href="/terms" className="underline">{t("booking.legal.terms")}</a>.
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
