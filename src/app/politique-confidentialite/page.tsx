"use client"

import React from 'react';
import Image from 'next/image';

export default function PolitiqueConfidentialitePage() {
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
          <h1 className="font-didot text-5xl sm:text-6xl text-[#e8dcc5] mb-4">Politique de Confidentialité</h1>
          <div className="w-24 h-[1px] bg-[#e8dcc5]/50 mx-auto"></div>
        </div>

        <div className="prose prose-lg prose-invert max-w-none mb-16">
          <section className="mb-10">
            <p className="italic text-gray-400 mb-8">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <p className="mb-6">
              Au Restaurant TIKI AU BORD DE L'EAU, nous accordons une importance particulière à la protection de votre vie privée. 
              Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos informations personnelles 
              lorsque vous utilisez notre site web et nos services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">1. Informations que nous collectons</h2>
            
            <h3 className="font-didot text-xl text-[#e8dcc5]/80 mb-3 mt-6">1.1 Informations que vous nous fournissez</h3>
            <p>Lorsque vous effectuez une réservation, nous collectons les informations suivantes :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Date et heure de réservation</li>
              <li>Nombre de convives</li>
              <li>Demandes spéciales éventuelles</li>
            </ul>
            
            <h3 className="font-didot text-xl text-[#e8dcc5]/80 mb-3 mt-6">1.2 Informations collectées automatiquement</h3>
            <p>Lorsque vous visitez notre site, nous pouvons collecter automatiquement certaines informations, notamment :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Adresse IP</li>
              <li>Type de navigateur</li>
              <li>Pages visitées</li>
              <li>Durée de la visite</li>
              <li>Système d'exploitation</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">2. Utilisation de vos informations</h2>
            <p>Nous utilisons vos informations personnelles pour :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Gérer vos réservations et vous envoyer des confirmations</li>
              <li>Vous contacter en cas de modifications ou d'annulations</li>
              <li>Améliorer nos services et votre expérience utilisateur</li>
              <li>Vous envoyer des informations sur nos offres spéciales et événements (avec votre consentement)</li>
              <li>Assurer la sécurité de notre site et détecter d'éventuelles fraudes</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">3. Partage de vos informations</h2>
            <p>Nous ne vendons ni ne louons vos informations personnelles à des tiers. Nous pouvons partager vos informations dans les cas suivants :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Avec des prestataires de services qui nous aident à gérer notre site et nos réservations</li>
              <li>Si la loi l'exige ou dans le cadre d'une procédure judiciaire</li>
              <li>Pour protéger nos droits, notre propriété ou notre sécurité, ou ceux de nos utilisateurs</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">4. Conservation des données</h2>
            <p>Nous conservons vos données personnelles aussi longtemps que nécessaire pour les finalités décrites dans cette politique, sauf si une période de conservation plus longue est requise par la loi.</p>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">5. Vos droits</h2>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Droit d'accès à vos données personnelles</li>
              <li>Droit de rectification de vos données</li>
              <li>Droit à l'effacement de vos données</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition au traitement</li>
            </ul>
            <p>Pour exercer ces droits, veuillez nous contacter à l'adresse : contact@tikilyon.fr</p>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">6. Modifications de notre politique de confidentialité</h2>
            <p>Nous pouvons modifier cette politique de confidentialité à tout moment. La version actualisée sera publiée sur cette page avec la date de dernière mise à jour.</p>
          </section>

          <section>
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">7. Contact</h2>
            <p>Pour toute question concernant notre politique de confidentialité, veuillez nous contacter à :</p>
            <p>Email : contact@tikilyon.fr</p>
            <p>Adresse : Chemin du Pontet, 69150 Décines-Charpieu</p>
            <p>Téléphone : 04 78 49 02 39</p>
          </section>
        </div>
      </div>
    </div>
  );
} 