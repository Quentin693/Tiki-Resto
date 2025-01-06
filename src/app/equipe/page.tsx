"use client"

import React from 'react';
import Image from 'next/image';
import { Users, Phone, Mail, Star, ChefHat, Clock } from 'lucide-react';

export default function TeamPage() {
  const teamMembers = [
    {
      id: 1,
      name: "Greg Maire",
      role: "Vieux Loup",
      description: "Fort de 20 ans d'expérience dans la cuisine polynésienne, Michel dirige notre cuisine avec passion et créativité. Formé aux îles Marquises, il apporte l'authenticité des saveurs du Pacifique à chaque plat.",
      speciality: "Poissons crus et marinades traditionnelles",
      experience: "20 ans d'expérience",
      schedule: "Chef du service du soir",
      imagePath: "/equipe/greg.jpg"
    },
    {
      id: 2,
      name: "Alexis Berthier",
      role: "Gros Grizzly",
      description: "Spécialiste des desserts fusion mêlant techniques françaises et ingrédients polynésiens, Marie crée des desserts uniques qui racontent une histoire à chaque bouchée.",
      speciality: "Desserts fusion polynésiens",
      experience: "15 ans d'expérience",
      schedule: "Service continu",
      imagePath: "/equipe/alex.jpeg"
    },
    {
      id: 3,
      name: "Quentin Cialone",
      role: "Cochon du seigneur",
      description: "Expert en fruits de mer et spécialités locales, Paul apporte sa touche unique aux plats traditionnels tahitiens. Sa créativité donne une nouvelle dimension à nos recettes ancestrales.",
      speciality: "Fruits de mer et poissons",
      experience: "12 ans d'expérience",
      schedule: "Chef du service du midi",
      imagePath: "/equipe/quentin.jpeg"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#141414] text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh]">
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover"
          >
            <source src="/videoKitchen.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <div>
            <img 
              src="/logo.png"
              alt="Tiki Logo"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Notre équipe
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl">
            Une passion commune : vous faire voyager à travers nos saveurs
          </p>
          <div className="w-24 h-1 bg-[#C4B5A2]"></div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="relative flex-grow bg-[#141414]">
        <div className="relative">
          {/* Background avec feuilles */}
          <div className="absolute inset-0 flex">
            <div className="w-[400px] relative">
              <Image
                src="/decorations/leavesleft.webp"
                alt="Décoration gauche"
                fill
                className="object-cover opacity-20"
                priority
              />
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#141414]" />
            </div>

            <div className="flex-grow bg-[#141414]">
              <div className="max-w-6xl mx-auto px-8" />
            </div>

            <div className="w-[400px] relative">
              <Image
                src="/decorations/leavesright.webp"
                alt="Décoration droite"
                fill
                className="object-cover opacity-20"
                priority
              />
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-l from-transparent to-[#141414]" />
            </div>
          </div>

          {/* Contenu */}
          <div className="relative max-w-6xl mx-auto px-8 py-16">
            {/* Introduction */}
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#C4B5A2] mb-4">Une équipe passionnée</h2>
              <p className="text-gray-400 max-w-3xl mx-auto">
                Notre équipe de professionnels dévoués combine expertise culinaire et passion pour la gastronomie polynésienne. Chaque membre apporte sa touche unique pour créer une expérience gustative inoubliable.
              </p>
            </div>

            {/* Liste des membres de l'équipe */}
            <div className="space-y-16">
              {teamMembers.map((member) => (
                <div 
                  key={member.id}
                  className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-[#C4B5A2]/20"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 h-[500px]">
                    <div className="relative h-[500px] lg:h-full">
                      <div className="absolute inset-0 bg-black/30 z-10" />
                      <Image
                        src={member.imagePath}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="h-[500px] p-8 flex flex-col">
                      <div className="flex-grow">
                        <h2 className="text-2xl font-bold mb-2">{member.name}</h2>
                        <p className="text-[#C4B5A2] mb-4">{member.role}</p>
                        <p className="text-gray-400 mb-6">{member.description}</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center text-gray-300">
                            <ChefHat className="w-5 h-5 text-[#C4B5A2] mr-3" />
                            {member.speciality}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Star className="w-5 h-5 text-[#C4B5A2] mr-3" />
                            {member.experience}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Clock className="w-5 h-5 text-[#C4B5A2] mr-3" />
                            {member.schedule}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Section Contact */}
            <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border border-[#C4B5A2]/20 shadow-xl mt-16">
              <div className="text-center mb-8">
                <Users className="w-12 h-12 text-[#C4B5A2] mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Contactez notre équipe</h2>
                <p className="text-gray-400">Pour toute demande spéciale ou information complémentaire</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <a href="tel:+123456789" className="flex items-center gap-2 bg-[#C4B5A2] hover:bg-[#A69783] text-black font-medium px-6 py-3 rounded-lg transition-colors">
                  <Phone className="w-4 h-4" />
                  Appeler le restaurant
                </a>
                <a href="mailto:contact@restaurant.com" className="flex items-center gap-2 bg-[#C4B5A2] hover:bg-[#A69783] text-black font-medium px-6 py-3 rounded-lg transition-colors">
                  <Mail className="w-4 h-4" />
                  Envoyer un email
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}