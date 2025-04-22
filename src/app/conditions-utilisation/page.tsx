"use client"

import React from 'react';
import Image from 'next/image';

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white relative pt-24 pb-16">
      {/* Background avec feuilles décoratives */}
      <div className="absolute inset-0 flex z-0 pointer-events-none overflow-hidden">
        <div className="w-[15%] sm:w-[20%] md:w-[25%] relative">
          <Image
            src="/decorations/leavesleft.webp"
            alt="Décoration gauche"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-[#0f0f0f]" />
        </div>

        <div className="flex-grow bg-[#0f0f0f]" />

        <div className="w-[15%] sm:w-[20%] md:w-[25%] relative">
          <Image
            src="/decorations/leavesright.webp"
            alt="Décoration droite"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-l from-transparent to-[#0f0f0f]" />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mt-40 mx-auto max-w-4xl px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <h1 className="font-didot text-5xl sm:text-6xl text-[#e8dcc5] mb-4">Conditions Générales d'Utilisation</h1>
          <div className="w-24 h-[1px] bg-[#e8dcc5]/50 mx-auto"></div>
        </div>

        <div className="prose prose-lg prose-invert max-w-none mb-16">
          <section className="mb-10">
            <p className="italic text-gray-400 mb-8">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <p className="mb-6">
              Bienvenue sur le site web du Restaurant TIKI AU BORD DE L'EAU. Les présentes conditions générales d'utilisation 
              régissent l'utilisation de notre site web accessible à l'adresse www.tikilyon.fr.
            </p>
            
            <p>
              En accédant à ce site web et en l'utilisant, vous acceptez d'être lié par les présentes conditions générales 
              d'utilisation. Si vous n'êtes pas d'accord avec ces conditions, veuillez ne pas utiliser ce site.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">1. Définitions</h2>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Site :</strong> désigne le site web accessible à l'adresse www.tikilyon.fr</li>
              <li><strong>TIKI AU BORD DE L'EAU :</strong> désigne la société exploitant le site</li>
              <li><strong>Utilisateur :</strong> désigne toute personne physique ou morale qui utilise le Site</li>
              <li><strong>Service :</strong> désigne l'ensemble des fonctionnalités proposées par le Site</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">2. Accès au site</h2>
            <p>
              L'accès au site est gratuit pour tout Utilisateur disposant d'un accès à Internet. Les frais d'accès 
              à Internet sont à la charge de l'Utilisateur. TIKI AU BORD DE L'EAU s'efforce de maintenir le Site 
              accessible 24 heures sur 24 et 7 jours sur 7, mais n'est tenu à aucune obligation de résultat.
            </p>
            <p className="mt-4">
              TIKI AU BORD DE L'EAU se réserve le droit de fermer temporairement ou définitivement l'accès au Site 
              ou à certaines de ses fonctionnalités sans préavis, notamment pour des raisons de maintenance ou en 
              cas de force majeure.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">3. Compte utilisateur</h2>
            <p>
              Certaines fonctionnalités du Site, notamment la réservation de table, sont accessibles uniquement aux Utilisateurs 
              ayant créé un compte. Pour créer un compte, l'Utilisateur doit fournir des informations exactes, complètes et à jour.
            </p>
            <p className="mt-4">
              L'Utilisateur est responsable de la préservation de la confidentialité de ses identifiants de connexion 
              et de toutes les activités effectuées à partir de son compte. L'Utilisateur s'engage à informer 
              immédiatement TIKI AU BORD DE L'EAU de toute utilisation non autorisée de son compte.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">4. Réservations</h2>
            <p>
              La réservation de table via notre Site est soumise à disponibilité. La confirmation de réservation 
              sera envoyée à l'adresse email ou au numéro de téléphone fourni lors de la réservation.
            </p>
            <p className="mt-4">
              TIKI AU BORD DE L'EAU se réserve le droit d'annuler ou de modifier une réservation dans des circonstances 
              exceptionnelles, en informant l'Utilisateur dans les meilleurs délais.
            </p>
            <p className="mt-4">
              L'Utilisateur peut annuler ou modifier sa réservation jusqu'à 24 heures avant l'heure prévue. Passé ce délai, 
              TIKI AU BORD DE L'EAU se réserve le droit de facturer des frais d'annulation.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">5. Propriété intellectuelle</h2>
            <p>
              L'ensemble des éléments constituant le Site (textes, graphismes, logiciels, photographies, images, 
              vidéos, sons, plans, logos, marques, etc.) est la propriété exclusive de TIKI AU BORD DE L'EAU ou 
              de ses partenaires. Ces éléments sont protégés par les lois relatives à la propriété intellectuelle.
            </p>
            <p className="mt-4">
              Toute reproduction, représentation, modification, publication, adaptation, exploitation de tout ou partie 
              des éléments du Site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite 
              préalable de TIKI AU BORD DE L'EAU.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">6. Limitation de responsabilité</h2>
            <p>
              TIKI AU BORD DE L'EAU s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le Site, 
              mais ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à la disposition des 
              Utilisateurs sur le Site.
            </p>
            <p className="mt-4">
              TIKI AU BORD DE L'EAU ne pourra être tenu responsable des dommages directs ou indirects résultant de l'utilisation 
              du Site, notamment en cas d'interruption ou d'indisponibilité du Site, de propagation de virus informatiques, 
              ou de tout autre événement échappant à son contrôle.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">7. Liens vers d'autres sites</h2>
            <p>
              Le Site peut contenir des liens vers d'autres sites web. TIKI AU BORD DE L'EAU n'exerce aucun contrôle sur 
              ces sites et n'assume aucune responsabilité quant à leur contenu. L'inclusion de liens vers ces sites ne 
              signifie pas que TIKI AU BORD DE L'EAU approuve leur contenu.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">8. Protection des données personnelles</h2>
            <p>
              TIKI AU BORD DE L'EAU s'engage à respecter la confidentialité des données personnelles communiquées par les 
              Utilisateurs du Site et à les traiter conformément au Règlement Général sur la Protection des Données (RGPD) 
              et à la loi Informatique et Libertés.
            </p>
            <p className="mt-4">
              Pour plus d'informations sur la façon dont nous collectons, utilisons et protégeons vos données personnelles, 
              veuillez consulter notre <a href="/politique-confidentialite" className="text-[#e8dcc5] hover:underline">Politique de Confidentialité</a>.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">9. Cookies</h2>
            <p>
              Le Site utilise des cookies pour améliorer l'expérience de navigation de l'Utilisateur. Pour plus d'informations 
              sur l'utilisation des cookies et sur la façon dont l'Utilisateur peut les gérer, veuillez consulter notre 
              <a href="/cookies" className="text-[#e8dcc5] hover:underline"> Politique de Gestion des Cookies</a>.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">10. Modification des conditions générales d'utilisation</h2>
            <p>
              TIKI AU BORD DE L'EAU se réserve le droit de modifier à tout moment les présentes conditions générales d'utilisation. 
              L'Utilisateur est invité à consulter régulièrement cette page pour prendre connaissance des modifications.
            </p>
            <p className="mt-4">
              L'utilisation continue du Site après la publication des modifications constitue l'acceptation de ces modifications.
            </p>
          </section>
          
          <section>
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">11. Droit applicable et juridiction compétente</h2>
            <p>
              Les présentes conditions générales d'utilisation sont régies par le droit français. En cas de litige, 
              les tribunaux français seront seuls compétents.
            </p>
            <p className="mt-4">
              Pour toute question relative aux présentes conditions générales d'utilisation, vous pouvez nous contacter 
              à l'adresse email suivante : contact@tikilyon.fr
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 