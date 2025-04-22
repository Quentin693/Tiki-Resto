"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Calendar, ArrowLeft } from 'lucide-react';

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
      <div className="container mt-40 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#1a1a1a]/70 border border-[#333] rounded-lg p-6 sm:p-10 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="font-didot text-3xl sm:text-4xl text-[#e8dcc5] mb-4">Commande Confirmée</h1>
            <div className="w-16 h-[1px] bg-[#e8dcc5]/50 mx-auto mb-4"></div>
            <p className="text-gray-300">
              Merci pour votre commande. Nous vous confirmons sa réception.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-[#111]/70 p-4 sm:p-6 rounded-lg border border-[#333]">
              <h2 className="font-didot text-xl text-[#e8dcc5] mb-4">Informations importantes</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#e8dcc5] text-lg">•</span>
                  <span>Votre commande sera prête à la date et l'heure que vous avez indiquées.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#e8dcc5] text-lg">•</span>
                  <span>Un email récapitulatif vous a été envoyé (si vous avez fourni une adresse email).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#e8dcc5] text-lg">•</span>
                  <span>Vous pouvez modifier ou annuler votre commande jusqu'à 24h avant la date prévue en nous contactant par téléphone.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#e8dcc5] text-lg">•</span>
                  <span>N'oubliez pas de vous munir d'une pièce d'identité lors du retrait.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 sm:p-6 rounded-lg border border-[#e8dcc5]/30 bg-[#e8dcc5]/5">
              <div className="flex items-center text-[#e8dcc5] gap-2 mb-3">
                <Calendar className="w-5 h-5" />
                <h3 className="font-medium">Pour le jour de votre retrait</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Présentez-vous à l'accueil du restaurant à l'heure indiquée. Notre équipe vérifiera votre commande avec vous avant de vous la remettre.
              </p>
              
              <div className="mt-4 pt-4 border-t border-[#e8dcc5]/20">
                <p className="text-gray-400 text-sm italic">
                  Pour toute question concernant votre commande, n'hésitez pas à nous contacter au 04 78 49 02 39.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <Link href="/" className="group flex items-center gap-2 text-[#e8dcc5] hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Retour à l'accueil</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <img 
            src="/logos/TikiLogo.png" 
            alt="Tiki Restaurant Logo"
            className="w-24 h-24 mx-auto mb-4 opacity-70"
          />
          <h2 className="font-didot text-2xl text-[#e8dcc5]">Restaurant Tiki</h2>
          <p className="text-gray-400 text-sm mt-2">
            Chemin du Pontet, 69150 Décines-Charpieu
          </p>
        </div>
      </div>
    </div>
  );
} 