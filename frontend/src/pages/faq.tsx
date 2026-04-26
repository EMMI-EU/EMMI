import PageHead from "@/components/PageHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  const { t } = useI18n();

  const faqs = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
    { question: t("faq.q7"), answer: t("faq.a7") },
    { question: t("faq.q8"), answer: t("faq.a8") },
  ];

  return (
    <>
      <PageHead title="FAQ — Questions Fréquentes | EMMI Europe Tech" description="Toutes vos questions sur nos services de réparation : délais, garantie, service postal, pièces détachées, tarifs. Réponses claires et transparentes." />

      <div className="bg-secondary/30 pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-6">{t("faq.title")}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{t("faq.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-20 max-w-4xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-border py-2">
              <AccordionTrigger className="text-left font-serif text-xl hover:no-underline hover:text-primary transition-colors data-[state=open]:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-4 pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-20 bg-primary/5 border border-primary/10 p-10 text-center">
          <h3 className="text-2xl font-serif font-bold mb-4">{t("faq.still")}</h3>
          <p className="text-muted-foreground mb-8">{t("faq.still.desc")}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button className="rounded-none px-8">{t("faq.contact")}</Button>
            </Link>
            <a href="https://wa.me/393792730062" target="_blank" rel="noreferrer">
              <Button variant="outline" className="rounded-none border-primary text-primary">{t("faq.whatsapp")}</Button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
