import PageHead from "@/components/PageHead";
import heroImg from "@/assets/hero.webp";
import trabelsiImg from "@/assets/trabelsi.webp";
import { Globe2, Target, Award, Wrench, Cpu, Coffee } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function About() {
  const { t } = useI18n();

  const journey = [
    { years: t("about.journey.1.years"), role: t("about.journey.1.role"), place: t("about.journey.1.place"), desc: t("about.journey.1.desc") },
    { years: t("about.journey.2.years"), role: t("about.journey.2.role"), place: t("about.journey.2.place"), desc: t("about.journey.2.desc") },
    { years: t("about.journey.3.years"), role: t("about.journey.3.role"), place: t("about.journey.3.place"), desc: t("about.journey.3.desc") },
    { years: t("about.journey.4.years"), role: t("about.journey.4.role"), place: t("about.journey.4.place"), desc: t("about.journey.4.desc") },
    { years: t("about.journey.5.years"), role: t("about.journey.5.role"), place: t("about.journey.5.place"), desc: t("about.journey.5.desc") },
  ];

  return (
    <>
      <PageHead title="À Propos — EMMI Europe Tech" description="Découvrez l'histoire de M. TRABELSI, fondateur d'EMMI Europe Tech. Plus de 10 ans d'expérience en réparation IT, smartphones et électroménager. Basé à Annecy, France." />

      {/* Hero */}
      <div className="relative h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="M. TRABELSI — EMMI Europe Tech" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-primary/75 mix-blend-multiply"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">{t("about.title")}</h1>
          <p className="text-xl text-white/80 font-light leading-relaxed">{t("about.subtitle")}</p>
        </div>
      </div>

      {/* Story */}
      <div className="py-24 container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground">{t("about.person.label")}</h2>
            <h3 className="text-4xl font-serif font-bold leading-tight text-primary">M. TRABELSI</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("about.person.p1")}</p>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("about.person.p2")}</p>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("about.person.p3")}</p>
          </div>
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img src={trabelsiImg} alt="M. TRABELSI — EMMI Europe Tech" className="w-full h-full object-cover object-top" />
            <div className="absolute bottom-0 left-0 right-0 bg-primary/90 backdrop-blur-sm px-6 py-4">
              <p className="text-primary-foreground font-serif font-bold text-lg">M. TRABELSI</p>
              <p className="text-primary-foreground/70 text-sm">Founder & Lead Technician — EMMI Europe Tech</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-secondary/50 py-16 border-y border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0"><Wrench className="w-6 h-6" /></div>
              <div>
                <strong className="block text-foreground text-lg mb-1">{t("about.skills.phone")}</strong>
                <span className="text-muted-foreground text-sm">{t("about.skills.phone.desc")}</span>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0"><Cpu className="w-6 h-6" /></div>
              <div>
                <strong className="block text-foreground text-lg mb-1">{t("about.skills.computer")}</strong>
                <span className="text-muted-foreground text-sm">{t("about.skills.computer.desc")}</span>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0"><Coffee className="w-6 h-6" /></div>
              <div>
                <strong className="block text-foreground text-lg mb-1">{t("about.skills.appliances")}</strong>
                <span className="text-muted-foreground text-sm">{t("about.skills.appliances.desc")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Journey */}
      <div className="bg-secondary/30 py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <h2 className="text-4xl font-serif font-bold text-center mb-16 text-primary">{t("about.journey.title")}</h2>
          <div className="space-y-10 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-border">
            {journey.map((item, i) => (
              <div key={i} className="pl-14 relative">
                <div className="absolute left-3.5 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background -translate-x-1/2" />
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{item.years}</p>
                <h3 className="text-lg font-semibold text-foreground">{item.role}</h3>
                <p className="text-sm text-primary font-medium mb-2">{item.place}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-primary text-primary-foreground py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">{t("about.values.title")}</h2>
            <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">{t("about.values.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-primary-foreground/20 p-8 text-center">
              <Target className="w-10 h-10 mx-auto mb-4 opacity-80" />
              <h3 className="text-xl font-serif font-bold mb-3">{t("about.values.precision")}</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">{t("about.values.precision.desc")}</p>
            </div>
            <div className="border border-primary-foreground/20 p-8 text-center bg-primary-foreground/5">
              <Award className="w-10 h-10 mx-auto mb-4 opacity-80" />
              <h3 className="text-xl font-serif font-bold mb-3">{t("about.values.quality")}</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">{t("about.values.quality.desc")}</p>
            </div>
            <div className="border border-primary-foreground/20 p-8 text-center">
              <Globe2 className="w-10 h-10 mx-auto mb-4 opacity-80" />
              <h3 className="text-xl font-serif font-bold mb-3">{t("about.values.transparency")}</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">{t("about.values.transparency.desc")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Where */}
      <div className="py-24 container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4 text-primary">{t("about.where.title")}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("about.where.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="border border-border p-8 text-center">
            <div className="text-4xl mb-4">🇫🇷</div>
            <h3 className="text-2xl font-serif font-bold mb-2">Annecy, France</h3>
            <p className="text-muted-foreground/70 uppercase tracking-wider text-sm font-bold mb-4">{t("about.where.france.role")}</p>
            <p className="text-muted-foreground leading-relaxed text-sm">{t("about.where.france.desc")}</p>
          </div>
          <div className="border border-border p-8 text-center">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-2xl font-serif font-bold mb-2">Pan-European</h3>
            <p className="text-muted-foreground/70 uppercase tracking-wider text-sm font-bold mb-4">{t("about.where.mailin.role")}</p>
            <p className="text-muted-foreground leading-relaxed text-sm">{t("about.where.mailin.desc")}</p>
          </div>
        </div>
        <p className="text-center text-muted-foreground mt-10 text-sm">{t("about.where.mailin")}</p>
      </div>
    </>
  );
}
