"use client"

import React, { useState } from 'react';
import Carte from '@/components/Carte';
import Menu from '@/components/Menu';
import Wine from '@/components/Wines';
import Image from 'next/image';
import AdminPanel from '@/components/PanelAdmin';

export default function MenuPage() {
  const isAdmin = true;

  return (
    <div className="flex flex-col min-h-screen bg-[#141414] text-white relative">
      {/* Background de base sombre */}
      <div className="fixed inset-0 bg-black/40" />

      {/* Contenu principal */}
      <main className="flex-grow relative">
        <div className="relative h-full">
          {/* Conteneur des feuilles et du contenu central */}
          <div className="absolute inset-0 flex">
            {/* Feuilles gauches avec une zone de transition */}
            <div className="w-[400px] relative">
              <Image
                src="/decorations/leavesleft.webp"
                alt="Décoration gauche"
                fill
                className="object-cover opacity-20"
                priority
              />
              {/* Dégradé de transition */}
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#141414]" />
            </div>

            {/* Zone centrale avec background très sombre */}
            <div className="flex-grow bg-[#141414]">
              <div className="max-w-6xl mx-auto px-8" />
            </div>

            {/* Feuilles droites avec une zone de transition */}
            <div className="w-[400px] relative">
              <Image
                src="/decorations/leavesright.webp"
                alt="Décoration droite"
                fill
                className="object-cover opacity-20"
                priority
              />
              {/* Dégradé de transition */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-l from-transparent to-[#141414]" />
            </div>
          </div>

          {/* Zone de contenu superposée */}
          <div className="relative max-w-6xl mx-auto px-8 py-8">
            {/* En-tête */}
            <div className="text-center mb-16">
              <h1 className="text-6xl font-bold mb-4">Notre Carte & Menus</h1>
              <div className="w-24 h-1 bg-[#C4B5A2] mx-auto mb-4"></div>
            </div>

            {/* Section Carte */}
            <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border border-[#C4B5A2]/20 shadow-xl mb-16">
              <Carte />
            </div>

            {/* Séparateur décoratif */}
            <div className="flex items-center justify-center my-16">
              <div className="flex-grow h-px bg-[#C4B5A2]/20"></div>
              <div className="w-3 h-3 rounded-full bg-[#C4B5A2] mx-4"></div>
              <div className="flex-grow h-px bg-[#C4B5A2]/20"></div>
            </div>

            {/* Section Menu */}
            <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border border-[#C4B5A2]/20 shadow-xl mb-16">
              <Menu />
            </div>

            {/* Séparateur décoratif */}
            <div className="flex items-center justify-center my-16">
              <div className="flex-grow h-px bg-[#C4B5A2]/20"></div>
              <div className="w-3 h-3 rounded-full bg-[#C4B5A2] mx-4"></div>
              <div className="flex-grow h-px bg-[#C4B5A2]/20"></div>
            </div>

            {/* Section Vins */}
            <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border border-[#C4B5A2]/20 shadow-xl mb-16">
              <Wine />
            </div>

            {/* Note de bas de page */}

            <div className="mt-16 text-center text-gray-400 text-sm border-t border-[#C4B5A2]/20 pt-8">
              <p>Les prix peuvent être modifiés sans préavis. Tous nos plats sont préparés sur place.</p>
              <p className="mt-2">Pour toute allergie ou régime spécial, veuillez nous consulter.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}