"use client"

import React, { useState } from 'react';
import Carte from '@/components/menu/Carte';
import Menus from '@/components/menu/Menus';
import Wine from '@/components/menu/Wines';
import Image from 'next/image';
import AdminPanel from '@/components/utils/PanelAdmin';

export default function CartePage() {
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
            <div className="w-[150px] sm:w-[250px] md:w-[400px] relative">
              <Image
                src="/decorations/leavesleft.webp"
                alt="Décoration gauche"
                fill
                className="object-cover opacity-20"
                priority
              />
              {/* Dégradé de transition */}
              <div className="absolute inset-y-0 right-0 w-12 sm:w-24 md:w-32 bg-gradient-to-r from-transparent to-[#141414]" />
            </div>

            {/* Zone centrale avec background très sombre */}
            <div className="flex-grow bg-[#141414]">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8" />
            </div>

            {/* Feuilles droites avec une zone de transition */}
            <div className="w-[150px] sm:w-[250px] md:w-[400px] relative">
              <Image
                src="/decorations/leavesright.webp"
                alt="Décoration droite"
                fill
                className="object-cover opacity-20"
                priority
              />
              {/* Dégradé de transition */}
              <div className="absolute inset-y-0 left-0 w-12 sm:w-24 md:w-32 bg-gradient-to-l from-transparent to-[#141414]" />
            </div>
          </div>

          {/* Zone de contenu superposée */}
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
            {/* En-tête */}
            <div className="text-center mb-10 sm:mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">Notre Carte & Menus</h1>
              <div className="w-16 sm:w-24 h-1 bg-[#C4B5A2] mx-auto mb-3 sm:mb-4"></div>
            </div>

            {/* Section Carte */}
            <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-4 sm:p-6 md:p-8 border border-[#C4B5A2]/20 shadow-xl mb-10 sm:mb-16">
              <Carte />
            </div>

            {/* Séparateur décoratif */}
            <div className="flex items-center justify-center my-10 sm:my-16">
              <div className="flex-grow h-px bg-[#C4B5A2]/20"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#C4B5A2] mx-3 sm:mx-4"></div>
              <div className="flex-grow h-px bg-[#C4B5A2]/20"></div>
            </div>

            {/* Section Menus */}
            <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-4 sm:p-6 md:p-8 border border-[#C4B5A2]/20 shadow-xl mb-10 sm:mb-16">
              <Menus />
            </div>

            {/* Séparateur décoratif */}
            <div className="flex items-center justify-center my-10 sm:my-16">
              <div className="flex-grow h-px bg-[#C4B5A2]/20"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#C4B5A2] mx-3 sm:mx-4"></div>
              <div className="flex-grow h-px bg-[#C4B5A2]/20"></div>
            </div>

            {/* Section Vins */}
            <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-4 sm:p-6 md:p-8 border border-[#C4B5A2]/20 shadow-xl mb-10 sm:mb-16">
              <Wine />
            </div>

            {/* Note de bas de page */}
            <div className="mt-10 sm:mt-16 text-center text-gray-400 text-xs sm:text-sm border-t border-[#C4B5A2]/20 pt-6 sm:pt-8">
              <p>Les prix peuvent être modifiés sans préavis. Tous nos plats sont préparés sur place.</p>
              <p className="mt-2">Pour toute allergie ou régime spécial, veuillez nous consulter.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}