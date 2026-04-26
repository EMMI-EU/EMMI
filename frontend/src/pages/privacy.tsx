import PageHead from "@/components/PageHead";
import { Link } from "wouter";

export default function Privacy() {
  const lastUpdated = "April 2026";

  const bullet = (text: string, i: number) => (
    <li key={i} className="flex items-start">
      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 mr-3 shrink-0" />
      {text}
    </li>
  );

  return (
    <>
      <PageHead
        title="Politique de confidentialité"
        description="Politique de confidentialité — EMMI Europe Tech."
        canonical="/privacy"
      />

      <div className="bg-secondary/30 pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-4">Politique de confidentialité</h1>
          <p className="text-muted-foreground">Dernière mise à jour : {lastUpdated}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-20 max-w-3xl">
        <div className="prose prose-neutral max-w-none space-y-10 text-foreground/80 leading-relaxed">

          {/* Pre-registration notice */}
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <p className="text-amber-800 text-sm">
              <strong>Avis :</strong> EMMI Europe Tech est en cours d'immatriculation en tant
              qu'auto-entrepreneur en France. Ce site est exploité par un entrepreneur individuel
              à titre de phase de lancement. Aucun contrat commercial formel n'est conclu à ce
              stade. Toutes les demandes sont traitées de bonne foi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles collectées via ce site est :
            </p>
            <div className="mt-4 bg-secondary/50 border border-border p-5 text-sm space-y-1">
              <p><strong>M. TRABELSI</strong> — EMMI Europe Tech</p>
              <p>Auto-entrepreneur (immatriculation en cours — France)</p>
              <p className="mt-2">E-mail : <a href="mailto:contact@emmi-eu.com" className="text-primary underline underline-offset-4">contact@emmi-eu.com</a></p>
              <p>WhatsApp : +39 379 273 0062</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">2. Données collectées</h2>
            <p>Lorsque vous soumettez une demande de réparation ou un formulaire de contact, nous collectons :</p>
            <ul className="mt-4 space-y-2 list-none pl-0">
              {[
                "Nom et prénom",
                "Adresse e-mail",
                "Numéro de téléphone",
                "Pays de résidence",
                "Type d'appareil et description de la panne",
                "Type de service souhaité (intervention à domicile ou envoi postal)",
                "Adresse IP et informations navigateur (logs serveur, automatique)",
              ].map(bullet)}
            </ul>
            <p className="mt-4">
              Nous ne collectons <strong>pas</strong> de données bancaires ou de carte de paiement.
              Nous ne vendons ni ne partageons vos données avec des tiers à des fins commerciales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">3. Finalité du traitement</h2>
            <ul className="mt-2 space-y-2 list-none pl-0">
              {[
                "Traiter votre demande de réparation et vous contacter à ce sujet",
                "Répondre aux messages envoyés via le formulaire de contact",
                "Comprendre la demande du marché (données agrégées et anonymisées uniquement)",
                "Respecter les obligations légales applicables",
              ].map(bullet)}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">4. Base légale (RGPD)</h2>
            <ul className="mt-2 space-y-3 list-none pl-0">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 mr-3 shrink-0" />
                <span><strong>Mesures précontractuelles</strong> — pour répondre à votre demande de réparation (Art. 6(1)(b) RGPD).</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 mr-3 shrink-0" />
                <span><strong>Intérêt légitime</strong> — pour vous contacter concernant votre demande (Art. 6(1)(f) RGPD).</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 mr-3 shrink-0" />
                <span><strong>Consentement</strong> — lorsque vous soumettez volontairement vos données via nos formulaires (Art. 6(1)(a) RGPD).</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">5. Durée de conservation</h2>
            <p>
              Les demandes de réparation sont conservées pendant une durée maximale de{" "}
              <strong>12 mois</strong> à compter de la soumission. Vous pouvez demander la
              suppression de vos données à tout moment. Lors de l'immatriculation officielle,
              cette politique sera mise à jour pour tenir compte des obligations comptables légales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">6. Sécurité des données</h2>
            <p>
              Les données sont stockées dans une base de données sécurisée à accès restreint.
              L'authentification administrateur utilise des jetons JWT dans des cookies HttpOnly —
              non accessibles en JavaScript. Aucune donnée client sensible (e-mail, téléphone)
              n'est exposée dans les réponses publiques de l'API.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">7. Vos droits</h2>
            <p>
              Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits
              d'accès, de rectification, d'effacement, de limitation, de portabilité, d'opposition
              au traitement de vos données, et de retrait de votre consentement à tout moment.
            </p>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous à{" "}
              <a href="mailto:contact@emmi-eu.com" className="text-primary underline underline-offset-4">
                contact@emmi-eu.com
              </a>. Nous répondrons dans un délai de <strong>30 jours</strong>.
            </p>
            <p className="mt-3">
              En cas de litige, vous pouvez introduire une réclamation auprès de la{" "}
              <strong>CNIL</strong> (Commission nationale de l'informatique et des libertés) :
              {" "}<a href="https://www.cnil.fr" target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">www.cnil.fr</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">8. Cookies</h2>
            <p>
              Nous utilisons un unique cookie de session (<code>emmi_auth</code>) exclusivement pour
              l'accès au panneau d'administration. Il est HttpOnly et Secure — non accessible en
              JavaScript. Nous n'utilisons <strong>aucun</strong> cookie de traçage, publicitaire
              ou analytique.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">9. Services tiers</h2>
            <p>
              Les polices de caractères sont chargées depuis Google Fonts (Google peut voir votre
              adresse IP). Les liens WhatsApp ouvrent WhatsApp directement — la politique de
              confidentialité de WhatsApp s'applique à ces échanges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">10. Modifications</h2>
            <p>
              Cette politique sera mise à jour lors de l'immatriculation officielle en auto-entrepreneur
              et à chaque changement important. La date « Dernière mise à jour » reflète la révision
              la plus récente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">11. Contact</h2>
            <div className="mt-4 bg-secondary/50 border border-border p-6 space-y-1">
              <p className="font-semibold">EMMI Europe Tech — M. TRABELSI</p>
              <p className="text-sm text-amber-700 italic">Auto-entrepreneur — immatriculation en cours en France</p>
              <p className="text-muted-foreground mt-2">E-mail : <a href="mailto:contact@emmi-eu.com" className="text-primary underline underline-offset-4">contact@emmi-eu.com</a></p>
              <p className="text-muted-foreground">WhatsApp : +39 379 273 0062</p>
              <p className="text-muted-foreground">Opérations : Annecy, France</p>
            </div>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EMMI Europe Tech — M. TRABELSI. Tous droits réservés.</p>
          <Link href="/terms" className="text-primary underline underline-offset-4">Mentions légales →</Link>
        </div>
      </div>
    </>
  );
}
