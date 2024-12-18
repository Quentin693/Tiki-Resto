"use client"

import React, { useState } from 'react';
import { CalendarDays, Clock, Users, Bell, Send, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function EventsPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const events = [
    {
      id: 1,
      title: "Soirée Polynésienne",
      description: "Immergez-vous dans l'ambiance des îles avec nos danseuses traditionnelles, musiciens locaux et un buffet spécial aux saveurs du Pacifique.",
      date: "2024-12-24",
      time: "19:00",
      capacity: "120 places",
      imagePath: "/events/Polynesie.jpeg"
    },
    {
      id: 2,
      title: "Masterclass Cocktails Tiki",
      description: "Apprenez à réaliser nos cocktails signature avec notre chef barman. Dégustation et secrets de préparation inclus.",
      date: "2024-12-31",
      time: "18:30",
      capacity: "30 places",
      imagePath: "/events/cocktail.jpeg"
    },
    {
      id: 3,
      title: "Dîner-Spectacle de dauphin",
      description: "Une soirée unique mêlant gastronomie raffinée et performances artistiques spectaculaires dans un cadre paradisiaque.",
      date: "2025-01-15",
      time: "20:00",
      capacity: "80 places",
      imagePath: "/events/dauphins.jpeg"
    }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail('');
  };

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
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Événements à venir</h1>
              <div className="w-24 h-1 bg-[#C4B5A2] mx-auto mb-4"></div>
              <p className="text-gray-300">Découvrez les soirées et événements spéciaux organisés dans notre restaurant</p>
            </div>

            {/* Liste des événements */}
            <div className="space-y-8 mb-16">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-[#C4B5A2]/20"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 h-[500px]">
                    {/* Image container */}
                    <div className="relative h-[500px] lg:h-full">
                      <div className="absolute inset-0 bg-black/30 z-10" />
                      <Image
                        src={event.imagePath}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Content container */}
                    <div className="h-[500px] p-8 flex flex-col">
                      <div className="flex-grow">
                        <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
                        <p className="text-gray-400 mb-6 line-clamp-3">{event.description}</p>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-gray-300">
                            <CalendarDays className="w-5 h-5 text-[#C4B5A2] mr-3" />
                            {new Date(event.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Clock className="w-5 h-5 text-[#C4B5A2] mr-3" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Users className="w-5 h-5 text-[#C4B5A2] mr-3" />
                            {event.capacity}
                          </div>
                        </div>

                        <button className="w-full bg-[#C4B5A2] hover:bg-[#A69783] text-black font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                          Réserver votre place
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter Section */}
            <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border border-[#C4B5A2]/20 shadow-xl">
              <div className="text-center mb-8">
                <Bell className="w-12 h-12 text-[#C4B5A2] mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Ne manquez aucun événement</h2>
                <p className="text-gray-400">Inscrivez-vous à notre newsletter pour être informé de nos prochains événements</p>
              </div>

              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                <div className="flex gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="flex-1 px-4 py-3 bg-[#1a1a1a] rounded-lg border border-[#C4B5A2]/30 focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white"
                  />
                  <button
                    type="submit"
                    className="bg-[#C4B5A2] hover:bg-[#A69783] text-black font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {subscribed ? (
                      "Inscrit !"
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        S'inscrire
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}