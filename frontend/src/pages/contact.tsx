import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PageHead from "@/components/PageHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Phone, Mail, Clock, CheckCircle2, Shield } from "lucide-react";
import { contactApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

export default function Contact() {
  const { toast } = useToast();
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, t("contact.form.name") + " is required"),
    email: z.string().email("Valid email is required"),
    subject: z.string().min(3, t("contact.form.subject") + " is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    website: z.string().max(0).optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await contactApi.submit(values);
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send message. Please try again.";
      toast({ variant: "destructive", title: "Error", description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHead title="Contact — EMMI Europe Tech" description="Contactez EMMI Europe Tech pour une réparation à Annecy ou un envoi postal depuis toute l'Europe. Email: contact@emmi-eu.com. Réponse rapide garantie." canonical="/contact" />

      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">{t("contact.title")}</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">{t("contact.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-20 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Info */}
          <div>
            <h2 className="text-3xl font-serif font-bold mb-8">{t("contact.get_in_touch")}</h2>
            <div className="space-y-8">
              {[
                {
                  icon: <Phone className="w-6 h-6" />,
                  title: t("contact.phone"),
                  content: (
                    <>
                      <p className="text-muted-foreground mb-3">+39 379 273 0062</p>
                      <a href="https://wa.me/393792730062" target="_blank" rel="noreferrer">
                        <Button variant="outline" className="rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm">
                          {t("contact.whatsapp")}
                        </Button>
                      </a>
                    </>
                  ),
                },
                {
                  icon: <Mail className="w-6 h-6" />,
                  title: t("contact.email"),
                  content: (
                    <>
                      <p className="text-muted-foreground mb-3">contact@emmi-eu.com</p>
                      <a href="mailto:contact@emmi-eu.com">
                        <Button variant="outline" className="rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm">
                          {t("contact.send_email")}
                        </Button>
                      </a>
                    </>
                  ),
                },
                {
                  icon: <MapPin className="w-6 h-6" />,
                  title: t("contact.areas"),
                  content: (
                    <div className="space-y-2">
                      <p className="text-muted-foreground">{t("contact.areas.france")}</p>
                      <p className="text-sm text-muted-foreground italic mt-2">{t("contact.areas.mailin")}</p>
                    </div>
                  ),
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: t("contact.hours"),
                  content: (
                    <>
                      <p className="text-muted-foreground">{t("contact.hours.weekdays")}</p>
                      <p className="text-muted-foreground">{t("contact.hours.saturday")}</p>
                    </>
                  ),
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: "Informations légales",
                  content: (
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm">Auto-entrepreneur</p>
                      <p className="text-muted-foreground text-sm">SIRET : en cours d&apos;enregistrement</p>
                      <p className="text-muted-foreground text-sm">Annecy, Haute-Savoie — France</p>
                    </div>
                  ),
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="bg-secondary p-4 rounded-full text-primary shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-card border p-8 shadow-sm">
            <h2 className="text-2xl font-serif font-bold mb-6">{t("contact.form.title")}</h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
                <h3 className="text-xl font-serif font-bold">{t("contact.form.success.title")}</h3>
                <p className="text-muted-foreground">{t("contact.form.success.desc")}</p>
                <Button variant="outline" className="rounded-none mt-2" onClick={() => { setSubmitted(false); form.reset(); }}>
                  {t("contact.form.success.again")}
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.form.name")}</FormLabel>
                      <FormControl><Input placeholder={t("contact.form.name.placeholder")} className="rounded-none h-12" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.form.email")}</FormLabel>
                      <FormControl><Input type="email" placeholder="your@email.com" className="rounded-none h-12" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.form.subject")}</FormLabel>
                      <FormControl><Input placeholder={t("contact.form.subject.placeholder")} className="rounded-none h-12" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.form.message")}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t("contact.form.message.placeholder")} className="rounded-none min-h-[130px] resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...form.register("website")} />
                  <Button type="submit" className="w-full rounded-none h-12 text-base" disabled={submitting}>
                    {submitting ? t("contact.form.sending") : t("contact.form.send")}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
