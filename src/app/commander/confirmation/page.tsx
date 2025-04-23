"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';

export default function ConfirmationPage() {
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
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#e8dcc5] hover:text-white mb-8 group transition-colors"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-didot text-sm sm:text-base">Retour à l'accueil</span>
        </Link>

        <div className="bg-[#1a1a1a]/70 border border-[#333] rounded-lg p-8 sm:p-10 mx-auto max-w-2xl">
          <div className="flex items-center justify-center mb-6 text-[#4BB543]">
            <CheckCircle className="w-16 h-16" />
          </div>
          
          <h1 className="font-didot text-3xl sm:text-4xl text-center text-[#e8dcc5] mb-6">
            Commande confirmée !
          </h1>
          
          <p className="text-gray-300 text-center mb-8">
            Votre commande de fruits de mer a été envoyée avec succès. Nous vous confirmerons sa préparation par téléphone.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-gray-300 gap-3">
              <Calendar className="w-5 h-5 text-[#e8dcc5]" />
              <span>Votre commande sera prête à la date que vous avez sélectionnée</span>
            </div>
            <div className="flex items-center text-gray-300 gap-3">
              <Clock className="w-5 h-5 text-[#e8dcc5]" />
              <span>À l'heure précisée lors de votre commande</span>
            </div>
            <div className="flex items-center text-gray-300 gap-3">
              <MapPin className="w-5 h-5 text-[#e8dcc5]" />
              <span>À récupérer au restaurant Tiki au Bord de l'Eau</span>
            </div>
          </div>
          
          <div className="bg-[#16140e] p-4 rounded-lg text-sm text-gray-400 mb-8">
            <p>
              Pour toute modification ou annulation, merci de nous contacter directement par téléphone
              au <span className="text-[#e8dcc5]">04 81 91 51 67</span> au moins 24h à l'avance.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-[#333] hover:bg-[#444] rounded text-center text-white transition-colors"
            >
              Retour à l'accueil
            </Link>
            <Link
              href="/carte"
              className="px-6 py-3 bg-[#e8dcc5]/20 hover:bg-[#e8dcc5]/30 rounded text-center text-[#e8dcc5] transition-colors"
            >
              Voir la carte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 