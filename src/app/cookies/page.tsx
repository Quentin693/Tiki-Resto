"use client"

import React from 'react';
import Image from 'next/image';

export default function CookiesPage() {
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
          <h1 className="font-didot text-5xl sm:text-6xl text-[#e8dcc5] mb-4">Gestion des Cookies</h1>
          <div className="w-24 h-[1px] bg-[#e8dcc5]/50 mx-auto"></div>
        </div>

        <div className="prose prose-lg prose-invert max-w-none mb-16">
          <section className="mb-10">
            <p className="italic text-gray-400 mb-8">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <p className="mb-6">
              Cette page vous informe sur l'utilisation des cookies sur notre site web et vous permet 
              de gérer vos préférences concernant leur utilisation.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">1. Qu'est-ce qu'un cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou mobile) 
              lors de votre visite sur notre site web. Il permet de stocker des informations relatives à votre 
              navigation sur notre site, comme vos préférences d'affichage ou vos informations de connexion.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">2. Les cookies que nous utilisons</h2>
            
            <h3 className="font-didot text-xl text-[#e8dcc5]/80 mb-3 mt-6">2.1 Cookies essentiels</h3>
            <p>
              Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés. 
              Ils permettent notamment de mémoriser votre connexion à votre compte utilisateur et de faciliter 
              votre navigation sur notre site.
            </p>
            
            <h3 className="font-didot text-xl text-[#e8dcc5]/80 mb-3 mt-6">2.2 Cookies d'analyse et de performance</h3>
            <p>
              Ces cookies nous permettent de collecter des informations sur l'utilisation de notre site, comme 
              le nombre de visiteurs, les pages les plus consultées ou la durée moyenne des visites. Ces données 
              nous aident à améliorer constamment l'expérience utilisateur.
            </p>
            
            <h3 className="font-didot text-xl text-[#e8dcc5]/80 mb-3 mt-6">2.3 Cookies de fonctionnalité</h3>
            <p>
              Ces cookies permettent d'enregistrer certaines préférences comme la langue, ou encore les informations 
              que vous avez saisies dans des formulaires pour faciliter vos prochaines visites.
            </p>
            
            <h3 className="font-didot text-xl text-[#e8dcc5]/80 mb-3 mt-6">2.4 Cookies de ciblage et publicitaires</h3>
            <p>
              Ces cookies peuvent être utilisés pour vous proposer des publicités adaptées à vos centres d'intérêt. 
              Ils permettent également de limiter le nombre de fois que vous voyez une publicité et nous aident à 
              mesurer l'efficacité de nos campagnes publicitaires.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">3. Gérer vos préférences</h2>
            <p>
              Vous pouvez à tout moment choisir d'activer ou de désactiver certains types de cookies 
              en utilisant le panneau de paramètres ci-dessous :
            </p>
            
            <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-6 my-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[#e8dcc5] font-medium">Cookies essentiels</label>
                  <span className="text-gray-400 text-sm">(Toujours actifs)</span>
                </div>
                <p className="text-sm text-gray-400">Nécessaires au fonctionnement du site</p>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="analytics" className="text-white">Cookies d'analyse</label>
                  <button
                    className="relative inline-flex items-center h-6 rounded-full w-11 bg-[#3a3a3a] focus:outline-none"
                    role="switch"
                    aria-checked="true"
                  >
                    <span className="sr-only">Activer les cookies d'analyse</span>
                    <span className="translate-x-6 inline-block w-4 h-4 transform bg-[#e8dcc5] rounded-full" />
                  </button>
                </div>
                <p className="text-sm text-gray-400">Nous aident à comprendre comment vous utilisez notre site</p>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="functional" className="text-white">Cookies de fonctionnalité</label>
                  <button
                    className="relative inline-flex items-center h-6 rounded-full w-11 bg-[#3a3a3a] focus:outline-none"
                    role="switch"
                    aria-checked="false"
                  >
                    <span className="sr-only">Activer les cookies de fonctionnalité</span>
                    <span className="translate-x-1 inline-block w-4 h-4 transform bg-white rounded-full" />
                  </button>
                </div>
                <p className="text-sm text-gray-400">Améliorent votre expérience sur notre site</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="targeting" className="text-white">Cookies publicitaires</label>
                  <button
                    className="relative inline-flex items-center h-6 rounded-full w-11 bg-[#3a3a3a] focus:outline-none"
                    role="switch"
                    aria-checked="false"
                  >
                    <span className="sr-only">Activer les cookies publicitaires</span>
                    <span className="translate-x-1 inline-block w-4 h-4 transform bg-white rounded-full" />
                  </button>
                </div>
                <p className="text-sm text-gray-400">Permettent d'afficher des publicités pertinentes</p>
              </div>
              
              <div className="flex justify-end">
                <button className="bg-[#e8dcc5] text-[#0f0f0f] px-4 py-2 rounded font-medium hover:bg-[#d1c5b0] transition-colors">
                  Enregistrer mes préférences
                </button>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">4. Comment désactiver les cookies via votre navigateur</h2>
            <p>
              Vous pouvez également configurer votre navigateur pour qu'il accepte ou refuse certains 
              cookies. La procédure varie selon le navigateur :
            </p>
            
            <ul className="list-disc pl-6 mb-4 mt-4">
              <li><strong>Google Chrome :</strong> Menu → Paramètres → Afficher les paramètres avancés → Confidentialité → Paramètres de contenu → Cookies</li>
              <li><strong>Mozilla Firefox :</strong> Menu → Options → Vie privée → Cookies</li>
              <li><strong>Safari :</strong> Préférences → Confidentialité</li>
              <li><strong>Microsoft Edge :</strong> Paramètres → Cookies et autorisations du site</li>
            </ul>
            
            <p className="text-gray-400 text-sm mt-4">
              Veuillez noter que la désactivation de certains cookies peut affecter les fonctionnalités 
              de notre site et limiter votre expérience utilisateur.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">5. Durée de conservation des cookies</h2>
            <p>
              La durée de vie des cookies varie selon leur type :
            </p>
            <ul className="list-disc pl-6 mb-4 mt-4">
              <li>Cookies de session : supprimés automatiquement à la fermeture du navigateur</li>
              <li>Cookies persistants : conservés pendant une durée définie (généralement de quelques jours à plusieurs mois)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-didot text-2xl text-[#e8dcc5] mb-4">6. Modifications de notre politique en matière de cookies</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique à tout moment. Toute modification entrera 
              en vigueur immédiatement après sa publication sur cette page.
            </p>
            <p className="mt-4">
              Pour toute question concernant notre politique en matière de cookies, veuillez nous contacter à l'adresse : 
              contact@tikilyon.fr
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 