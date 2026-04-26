import PageHead from "@/components/PageHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { Smartphone, Laptop, Tablet, Coffee, Droplets, MapPin, Truck, ArrowRight } from "lucide-react";
import phoneImg from "@/assets/service-phone.webp";
import computerImg from "@/assets/service-laptop.webp";
import tabletImg from "@/assets/service-tablet.webp";
import coffeeImg from "@/assets/service-coffee.webp";
import washingImg from "@/assets/service-washing.webp";

export default function Services() {
  const { t } = useI18n();

  const categories = [
    {
      id: "phone",
      title: t("services.phone.title"),
      icon: <Smartphone className="w-8 h-8" />,
      image: phoneImg,
      description: t("services.phone.desc"),
      features: [t("services.phone.f1"), t("services.phone.f2"), t("services.phone.f3"), t("services.phone.f4")],
    },
    {
      id: "computer",
      title: t("services.computer.title"),
      icon: <Laptop className="w-8 h-8" />,
      image: computerImg,
      description: t("services.computer.desc"),
      features: [t("services.computer.f1"), t("services.computer.f2"), t("services.computer.f3"), t("services.computer.f4")],
    },
    {
      id: "tablet",
      title: t("services.tablet.title"),
      icon: <Tablet className="w-8 h-8" />,
      image: tabletImg,
      description: t("services.tablet.desc"),
      features: [t("services.tablet.f1"), t("services.tablet.f2"), t("services.tablet.f3"), t("services.tablet.f4")],
    },
    {
      id: "coffee",
      title: t("services.coffee.title"),
      icon: <Coffee className="w-8 h-8" />,
      image: coffeeImg,
      description: t("services.coffee.desc"),
      features: [t("services.coffee.f1"), t("services.coffee.f2"), t("services.coffee.f3"), t("services.coffee.f4")],
    },
    {
      id: "washing",
      title: t("services.washing.title"),
      icon: <Droplets className="w-8 h-8" />,
      image: washingImg,
      description: t("services.washing.desc"),
      features: [t("services.washing.f1"), t("services.washing.f2"), t("services.washing.f3"), t("services.washing.f4")],
    },
  ];

  return (
    <>
      <PageHead title="Services de Réparation — EMMI Europe Tech" description="Réparation de smartphones (iPhone, Samsung...), ordinateurs, tablettes, machines à café et lave-linge. Pièces d'origine, garantie incluse. Annecy, France & service postal Europe." />

      <div className="bg-secondary/30 pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-6">{t("services.title")}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{t("services.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-20">
        <div className="space-y-24">
          {categories.map((category, index) => (
            <div key={category.id} className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}>
              <div className="w-full lg:w-1/2">
                <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                  <img src={category.image} alt={category.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="flex items-center space-x-4 text-primary">
                  {category.icon}
                  <h2 className="text-3xl font-serif font-bold">{category.title}</h2>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">{category.description}</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                  {category.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <ArrowRight className="w-5 h-5 text-primary shrink-0 mr-2 mt-0.5" />
                      <span className="font-medium text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 flex gap-4">
                  <Link href={`/booking?device=${category.id}`}>
                    <Button className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                      {t("services.book")}
                    </Button>
                  </Link>
                  <a href={`https://wa.me/393792730062?text=Hello,%20I%20need%20help%20repairing%20my%20${category.title.toLowerCase()}.`} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="rounded-none">{t("services.whatsapp")}</Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Types */}
      <div className="bg-primary text-primary-foreground py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">{t("services.how.title")}</h2>
            <p className="text-primary-foreground/70 text-lg">{t("services.how.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-primary-foreground/5 border border-primary-foreground/10 p-10">
              <MapPin className="w-12 h-12 mb-6 text-white" />
              <h3 className="text-2xl font-serif font-bold mb-4">{t("services.home.title")}</h3>
              <p className="text-primary-foreground/70 mb-6 leading-relaxed">{t("services.home.desc")}</p>
              <ul className="space-y-2 text-sm text-primary-foreground/80 mb-8">
                <li>• {t("services.home.1")}</li>
                <li>• {t("services.home.2")}</li>
                <li>• {t("services.home.3")}</li>
                <li>• {t("services.home.4")}</li>
              </ul>
            </div>
            <div className="bg-primary-foreground/5 border border-primary-foreground/10 p-10">
              <Truck className="w-12 h-12 mb-6 text-white" />
              <h3 className="text-2xl font-serif font-bold mb-4">{t("services.mail.title")}</h3>
              <p className="text-primary-foreground/70 mb-6 leading-relaxed">{t("services.mail.desc")}</p>
              <ul className="space-y-2 text-sm text-primary-foreground/80 mb-8">
                <li>• {t("services.mail.1")}</li>
                <li>• {t("services.mail.2")}</li>
                <li>• {t("services.mail.3")}</li>
                <li>• {t("services.mail.4")}</li>
              </ul>
            </div>
          </div>
          <div className="mt-16 text-center">
            <Link href="/booking">
              <Button size="lg" className="rounded-none bg-white text-primary hover:bg-gray-100 px-10 h-14 text-base">
                {t("services.start")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* Mail-in Step-by-Step Guide */}
      <div className="bg-secondary/30 py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-3">{t("services.mailin.label")}</h2>
            <h3 className="text-4xl font-serif font-bold text-primary mb-4">{t("services.mailin.title")}</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("services.mailin.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", icon: "📋", titleKey: "services.mailin.step1.title", descKey: "services.mailin.step1.desc" },
              { step: "02", icon: "📦", titleKey: "services.mailin.step2.title", descKey: "services.mailin.step2.desc" },
              { step: "03", icon: "🚚", titleKey: "services.mailin.step3.title", descKey: "services.mailin.step3.desc" },
              { step: "04", icon: "✅", titleKey: "services.mailin.step4.title", descKey: "services.mailin.step4.desc" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-start">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-serif font-light text-muted-foreground/40">{item.step}</span>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">{t(item.titleKey)}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 bg-amber-50 border border-amber-200 rounded-none p-6 text-sm text-amber-900">
            <strong className="block mb-1">{t("services.mailin.warning.title")}</strong>
            {t("services.mailin.warning.body")}
          </div>
        </div>
      </div>
    </>
  );
}
