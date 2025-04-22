"use client"

import React from 'react';
import Image from 'next/image';

export default function MentionsLegalesPage() {
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
          <h1 className="font-didot text-5xl sm:text-6xl text-[#e8dcc5] mb-4">Mentions Légales</h1>
          <div className="w-24 h-[1px] bg-[#e8dcc5]/50 mx-auto"></div>
        </div>

        <div className="prose prose-lg prose-invert max-w-none mb-16">
          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">Informations légales</h2>
            <p>Raison sociale : RESTAURANT TIKI AU BORD DE L'EAU</p>
            <p>Forme juridique : Société à responsabilité limitée (SARL)</p>
            <p>Capital social : 1 000 000 €</p>
            <p>Siège social : Chemin du Pontet, 69150 Décines-Charpieu</p>
            <p>SIRET : 12345678900012</p>
            <p>TVA Intracommunautaire : FR 12 123456789</p>
            <p>Téléphone : 04 78 49 02 39</p>
            <p>Email : contact@tikilyon.fr</p>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">Directeur de la publication</h2>
            <p>M. Greg Maire, en qualité de gérant.</p>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">Hébergement</h2>
            <p>Le site www.tikilyon.fr est hébergé par :</p>
            <p>Vercel Inc.</p>
            <p>340 S Lemon Ave #4133</p>
            <p>Walnut, CA 91789</p>
            <p>États-Unis</p>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">Propriété intellectuelle</h2>
            <p>L'ensemble des éléments constituant le site www.tikilyon.fr (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, logos, marques, etc.) ainsi que le site lui-même, sont la propriété exclusive de RESTAURANT TIKI AU BORD DE L'EAU ou de ses partenaires.</p>
            <p>Toute représentation, reproduction, adaptation, exploitation partielle ou totale des contenus, marques et services proposés par le site, par quelque procédé que ce soit, sans l'autorisation préalable, expresse et écrite de l'exploitant du site, est strictement interdite et serait susceptible de constituer une contrefaçon au sens des articles L.335-2 et suivants du Code de la propriété intellectuelle.</p>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">Crédits</h2>
            <p>Conception et développement : Agence de développement web "WebDesign Lyon"</p>
            <p>Photographies : Studio Imagin'Art</p>
            <p>Illustrations : Marine Durand</p>
          </section>
        </div>
      </div>
    </div>
  );
} 