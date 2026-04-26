import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import PageHead from "@/components/PageHead";
import { ArrowRight, CheckCircle2, Shield, Wrench, Clock, Smartphone, Laptop, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero.webp";
import phoneImg from "@/assets/service-phone.webp";
import computerImg from "@/assets/service-laptop.webp";
import coffeeImg from "@/assets/service-coffee.webp";

export default function Home() {
  const { t } = useI18n();

  const services = [
    { title: t("home.services.phone.title"), icon: <Smartphone className="w-6 h-6" />, image: phoneImg, desc: t("home.services.phone.desc") },
    { title: t("home.services.computer.title"), icon: <Laptop className="w-6 h-6" />, image: computerImg, desc: t("home.services.computer.desc") },
    { title: t("home.services.appliances.title"), icon: <Coffee className="w-6 h-6" />, image: coffeeImg, desc: t("home.services.appliances.desc") },
  ];

  const features = [
    { icon: <Shield />, title: t("home.features.warranty.title"), desc: t("home.features.warranty.desc") },
    { icon: <Wrench />, title: t("home.features.experts.title"), desc: t("home.features.experts.desc") },
    { icon: <Clock />, title: t("home.features.fast.title"), desc: t("home.features.fast.desc") },
    { icon: <CheckCircle2 />, title: t("home.features.parts.title"), desc: t("home.features.parts.desc") },
  ];

  const steps = [
    { step: "01", title: t("home.process.1.title"), desc: t("home.process.1.desc") },
    { step: "02", title: t("home.process.2.title"), desc: t("home.process.2.desc") },
    { step: "03", title: t("home.process.3.title"), desc: t("home.process.3.desc") },
    { step: "04", title: t("home.process.4.title"), desc: t("home.process.4.desc") },
  ];

  return (
    <>
      <PageHead title="EMMI Europe Tech — Réparation Smartphone, Ordinateur & Électroménager" description="Réparation professionnelle de smartphones, ordinateurs, tablettes et électroménager à Annecy, France. Service postal disponible dans toute l'Europe. Expert certifié M. TRABELSI." canonical="/" />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="Premium tech repair" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-primary/70 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 pt-20 pb-10 max-w-7xl">
          <div className="max-w-2xl text-primary-foreground">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                {t("hero.badge")}
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">{t("hero.title")}</h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 leading-relaxed font-light">{t("hero.subtitle")}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/booking">
                  <Button size="lg" className="rounded-none bg-white text-primary hover:bg-gray-100 h-14 px-8 text-base">
                    {t("cta.book")} <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/track">
                  <Button size="lg" variant="outline" className="rounded-none border-primary-foreground/20 bg-primary/20 backdrop-blur-sm hover:bg-primary/40 h-14 px-8 text-base text-primary-foreground">
                    {t("cta.track")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary py-12 border-b">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="flex items-start space-x-4">
                <div className="bg-primary/5 p-3 rounded-lg text-primary shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-3">{t("home.services.label")}</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold">{t("home.services.title")}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} className="group cursor-pointer">
                <div className="relative h-80 mb-6 overflow-hidden bg-muted">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="flex items-center space-x-3 mb-3 text-primary">{s.icon}<h4 className="text-2xl font-serif font-semibold">{s.title}</h4></div>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link href="/services">
              <Button variant="outline" className="rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 h-12 text-xs font-bold uppercase tracking-widest">
                {t("home.services.viewall")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold tracking-widest uppercase text-primary-foreground/60 mb-3">{t("home.process.label")}</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold mb-8">{t("home.process.title")}</h3>
              <div className="space-y-8">
                {steps.map((item, i) => (
                  <div key={i} className="flex space-x-6">
                    <div className="text-2xl font-serif font-light text-primary-foreground/30">{item.step}</div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                      <p className="text-primary-foreground/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="aspect-[4/5] bg-primary-foreground/5 p-8 border border-primary-foreground/10 flex flex-col justify-between">
              <div>
                <h4 className="text-2xl font-serif font-medium mb-4">{t("home.process.cta.title")}</h4>
                <p className="text-primary-foreground/70 mb-8 leading-relaxed">{t("home.process.cta.desc")}</p>
              </div>
              <div className="space-y-4">
                <Link href="/booking" className="block">
                  <Button className="w-full rounded-none bg-white text-primary hover:bg-gray-100 h-14 text-base">{t("home.process.cta.book")}</Button>
                </Link>
                <a href="https://wa.me/393792730062" target="_blank" rel="noreferrer" className="block">
                  <Button variant="outline" className="w-full rounded-none border-primary-foreground/20 bg-transparent hover:bg-primary-foreground/10 h-14 text-base text-primary-foreground">
                    {t("home.process.cta.whatsapp")}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-3">{t("home.testimonials.label")}</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold">{t("home.testimonials.title")}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: t("home.testimonials.1.name"), location: t("home.testimonials.1.location"), text: t("home.testimonials.1.text") },
              { name: t("home.testimonials.2.name"), location: t("home.testimonials.2.location"), text: t("home.testimonials.2.text") },
              { name: t("home.testimonials.3.name"), location: t("home.testimonials.3.location"), text: t("home.testimonials.3.text") },
            ].map((review, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="bg-secondary/40 border border-border p-8 flex flex-col">
                <div className="flex text-yellow-400 mb-4 text-lg">★★★★★</div>
                <p className="text-muted-foreground leading-relaxed flex-1 italic">"{review.text}"</p>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
