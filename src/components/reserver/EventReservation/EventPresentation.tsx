"use client"

import React from 'react';
import { Cake, Heart, Gift, Users } from 'lucide-react';
import Image from 'next/image';

export default function EventPresentation() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border border-[#C4B5A2]/20 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Nos services d'événementiel</h2>
        <p className="text-gray-300 mb-6">
          Le Tiki au Bord de l'Eau vous ouvre ses portes pour vos événements privés et célébrations. Notre équipe expérimentée s'occupe de tout pour rendre votre journée unique.
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Cake className="w-6 h-6 text-[#C4B5A2] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">Anniversaires</h3>
              <p className="text-gray-400 text-sm">Gâteaux personnalisés, décorations thématiques et menu spécial</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Heart className="w-6 h-6 text-[#C4B5A2] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">Mariages</h3>
              <p className="text-gray-400 text-sm">Cadre idyllique en bord de lac, espace privatisable jusqu'à 120 personnes</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Gift className="w-6 h-6 text-[#C4B5A2] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">Baptêmes & Communions</h3>
              <p className="text-gray-400 text-sm">Formules tout compris et menus adaptés aux enfants</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-[#C4B5A2] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">Événements d'entreprise</h3>
              <p className="text-gray-400 text-sm">Séminaires, team buildings et repas d'affaires</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden h-[400px]">
        <Image 
          src="/image1.png"
          alt="Événements spéciaux"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <p className="text-lg font-medium">Des moments inoubliables dans un cadre exceptionnel</p>
        </div>
      </div>
    </div>
  );
} 