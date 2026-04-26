import PageHead from "@/components/PageHead";
import { Link } from "wouter";

export default function Terms() {
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
        title="Mentions légales"
        description="Mentions légales — EMMI Europe Tech."
        canonical="/terms"
      />

      <div className="bg-secondary/30 pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-4">Mentions légales</h1>
          <p className="text-muted-foreground">Dernière mise à jour : {lastUpdated}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-20 max-w-3xl">
        <div className="prose prose-neutral max-w-none space-y-10 text-foreground/80 leading-relaxed">

          {/* Pre-registration notice */}
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <p className="text-amber-800 text-sm">
              <strong>Avis important :</strong> EMMI Europe Tech est en cours d'immatriculation en tant
              qu'auto-entrepreneur en France. Ce site web est exploité par un entrepreneur individuel
              pour tester la demande du marché européen avant l'immatriculation officielle. Aucun
              contrat commercial formel n'est conclu tant que notre équipe ne confirme pas expressément
              votre demande par e-mail ou WhatsApp.
            </p>
          </section>

          {/* Éditeur du site */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">1. Éditeur du site</h2>
            <div className="bg-secondary/50 border border-border p-6 space-y-1 text-sm">
              <p><strong>Nom commercial :</strong> EMMI Europe Tech</p>
              <p><strong>Exploitant :</strong> M. TRABELSI</p>
              <p><strong>Statut :</strong> Auto-entrepreneur (en cours d'immatriculation — France)</p>
              <p className="mt-2"><strong>E-mail :</strong>{" "}
                <a href="mailto:contact@emmi-eu.com" className="text-primary underline underline-offset-4">contact@emmi-eu.com</a>
              </p>
              <p><strong>WhatsApp :</strong> +39 379 273 0062</p>
              <p className="mt-2"><strong>Zone d'intervention :</strong> Annecy (France), envoi postal toute l'Europe</p>
              <p className="text-xs text-muted-foreground mt-3 italic">
                Le numéro SIRET sera publié ici dès l'immatriculation officielle auprès de l'URSSAF / Guichet Unique.
              </p>
            </div>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">2. Hébergement du site</h2>
            <p>
              Ce site est hébergé par un prestataire professionnel. Les coordonnées de l'hébergeur
              sont disponibles sur demande à l'adresse{" "}
              <a href="mailto:contact@emmi-eu.com" className="text-primary underline underline-offset-4">contact@emmi-eu.com</a>.
            </p>
          </section>

          {/* Nature du service */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">3. Nature du service</h2>
            <p>
              Pendant la phase de lancement, EMMI Europe Tech propose des services de réparation et de
              maintenance au cas par cas, de bonne foi. Soumettre une demande via ce site :
            </p>
            <ul className="mt-4 space-y-2 list-none pl-0">
              {[
                "Ne constitue PAS un contrat contraignant",
                "Ne garantit PAS la disponibilité du service ni un tarif fixe",
                "EST une expression d'intérêt que notre équipe examinera et confirmera par e-mail ou WhatsApp",
              ].map(bullet)}
            </ul>
            <p className="mt-4">
              Une prestation n'est confirmée que lorsque notre équipe l'accepte explicitement par écrit
              et que les deux parties s'accordent sur le périmètre et le prix.
            </p>
          </section>

          {/* Services proposés */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">4. Services proposés</h2>
            <p>Nous assurons la réparation et la maintenance de :</p>
            <ul className="mt-4 space-y-2 list-none pl-0">
              {[
                "Smartphones et téléphones mobiles (toutes marques, spécialité iPhone)",
                "Ordinateurs, laptops, tablettes et iPads",
                "Machines à café automatiques haut de gamme",
                "Machines à laver et appareils électroménagers",
              ].map(bullet)}
            </ul>
            <p className="mt-4">
              Les interventions se font à <strong>domicile</strong> (Annecy, Haute-Savoie et
              ou par <strong>envoi postal</strong> (toute l'Europe).
            </p>
          </section>

          {/* Tarifs et paiement */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">5. Tarifs et paiement</h2>
            <p>
              Chaque devis est établi individuellement après diagnostic de l'appareil et de la panne.
              Un devis définitif est communiqué avant tout début de réparation. Nous nous réservons
              le droit de réviser le devis si des problèmes supplémentaires sont découverts pendant
              le diagnostic.
            </p>
            <p className="mt-3">
              Les modes de règlement acceptés : virement bancaire, lien de paiement par carte, et
              espèces (interventions à domicile uniquement). Aucun paiement n'est prélevé
              automatiquement via ce site.
            </p>
          </section>

          {/* Garantie */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">6. Garantie</h2>
            <p>
              Toutes les réparations sont couvertes par une <strong>garantie de 12 mois</strong> sur
              les pièces et la main-d'œuvre à compter de la date de réalisation. Cette garantie
              couvre les défauts de la pièce remplacée et les pannes directement liées à notre
              intervention.
            </p>
            <p className="mt-3">Elle ne couvre <strong>pas</strong> :</p>
            <ul className="mt-3 space-y-2 list-none pl-0">
              {[
                "Les dommages accidentels survenus après la réparation (chute, liquide, fissure)",
                "Les dégâts causés par une réparation tierce après notre intervention",
                "L'usure normale",
                "Les problèmes préexistants non liés à la réparation effectuée",
              ].map(bullet)}
            </ul>
          </section>

          {/* Données de l'appareil */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">7. Données personnelles sur l'appareil</h2>
            <p>
              Il vous appartient de sauvegarder toutes vos données avant de confier votre appareil.
              EMMI Europe Tech décline toute responsabilité en cas de perte de données durant la
              réparation, même en cas de défaillance technique.
            </p>
            <p className="mt-3">
              En remettant votre appareil, vous confirmez en être le propriétaire légal ou agir avec
              l'autorisation du propriétaire. Nous n'accédons pas aux données personnelles stockées
              sur l'appareil au-delà de ce qui est strictement nécessaire à la réparation.
            </p>
          </section>

          {/* Envoi postal */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">8. Service par envoi postal</h2>
            <p>
              Vous êtes responsable de l'emballage sécurisé de votre appareil avant expédition.
              Nous ne sommes pas responsables des dommages survenant lors du transport aller.
              Nous renvoyons les appareils via un transporteur avec suivi et assurance.
            </p>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">9. Limitation de responsabilité</h2>
            <p>
              Dans les limites permises par la loi, EMMI Europe Tech ne saurait être tenu responsable
              des dommages indirects, accessoires ou consécutifs. Notre responsabilité totale pour
              toute réclamation ne peut excéder le montant convenu pour la réparation concernée.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">10. Droit applicable</h2>
            <p>
              Ces mentions légales et conditions sont régies par le droit français. Les droits
              impératifs de protection des consommateurs de votre pays de résidence s'appliquent
              toujours et ne sont pas écartés par ces conditions.
            </p>
          </section>

          {/* Mises à jour */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">11. Mises à jour</h2>
            <p>
              Ces mentions légales seront mises à jour lors de l'immatriculation officielle en tant
              qu'auto-entrepreneur et à chaque changement important. La date « Dernière mise à jour »
              indique la révision la plus récente.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">12. Contact</h2>
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
          <Link href="/privacy" className="text-primary underline underline-offset-4">← Politique de confidentialité</Link>
        </div>
      </div>
    </>
  );
}
