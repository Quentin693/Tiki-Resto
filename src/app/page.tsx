"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ServiceSection from '@/components/utils/ServiceSection';
import EventsSection from '@/components/utils/EventsSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '/images/default.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads/')) {
    return `${API_URL}${imagePath}`;
  }
  return imagePath; // Pour les images statiques dans le dossier public
};

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/image1.png",
      title: "Une expérience culinaire au bord de l'eau",
      subtitle: "Saveurs exotiques & Ambiance tropicale"
    },
    {
      image: "/image5.png",
      title: "Une vue panoramique sur la mer",
      subtitle: "Vue imprenable sur le Grand Large"
    },
    {
      image: "/image.png",
      title: "Un cadre paradisiaque",
      subtitle: "Pour vos événements spéciaux"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#2a2a2a] text-white">
      {/* Hero Section avec Slider */}
      <div className="relative w-full h-screen">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{
                backgroundImage: `url(${getImageUrl(slide.image)})`,
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
            </div>
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4 max-w-7xl mx-auto">
              <div className="flex flex-col items-center space-y-6 md:space-y-8 -mt-20">
                <h2 className="font-dynapuff text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                  Le TIKI vous souhaite la bienvenue
                </h2>
                <img 
                  src="/logos/TikiLogo.png"
                  alt="Tiki Logo"
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
                />
                <div className="mt-6 md:mt-8">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
                    {slide.title}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 md:mb-10 max-w-3xl mx-auto">
                    {slide.subtitle}
                  </p>
                  <a
                    href="/reserver"
                    className="bg-[#C4B5A2] text-white px-8 py-3 sm:px-10 sm:py-4 rounded-lg hover:bg-[#A69783] transition-colors text-base sm:text-lg font-semibold"
                  >
                    Réservez Maintenant
                  </a>
                </div>
              </div>

              {/* Indicateurs de slide */}
              <div className="absolute bottom-12 sm:bottom-16 left-0 right-0">
                <div className="flex justify-center space-x-4">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`
                        h-2 sm:h-3 rounded-full transition-all duration-300
                        ${currentSlide === index 
                          ? 'w-10 sm:w-12 bg-[#C4B5A2]' 
                          : 'w-2 sm:w-3 bg-white/60 hover:bg-white/90'
                        }
                      `}
                      aria-label={`Slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section Services */}
      <div className="relative w-full bg-[#141414]">
        {/* Conteneur des feuilles et du contenu central */}
        <div className="absolute inset-0 flex">
          {/* Feuilles gauches avec une zone de transition */}
          <div className="w-[15%] sm:w-[20%] md:w-[25%] relative">
            <Image
              src="/decorations/leavesleft.webp"
              alt="Décoration gauche"
              fill
              className="object-cover opacity-20"
              priority
            />
            {/* Dégradé de transition */}
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-[#141414]" />
          </div>

          {/* Zone centrale avec background très sombre */}
          <div className="flex-grow bg-[#141414]" />

          {/* Feuilles droites avec une zone de transition */}
          <div className="w-[15%] sm:w-[20%] md:w-[25%] relative">
            <Image
              src="/decorations/leavesright.webp"
              alt="Décoration droite"
              fill
              className="object-cover opacity-20"
              priority
            />
            {/* Dégradé de transition */}
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-l from-transparent to-[#141414]" />
          </div>
        </div>

        {/* Contenu principal */}
        <div className="relative py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ServiceSection />
          </div>
        </div>

        <div className="relative py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#C4B5A2] text-center mb-10 sm:mb-12">
              Evènements à venir ...
            </h2>
            <EventsSection />
          </div>
        </div>
      </div>
    </div>
  );
}