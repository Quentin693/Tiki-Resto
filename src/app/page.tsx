"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ServiceSection from '@/components/utils/ServiceSection';
import EventsSection from '@/components/reserver/EventsSection';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/image1.png",
      title: "Une expérience culinaire au bord de l'eau",
      subtitle: "Saveurs exotiques & Ambiance tropicale"
    },
    {
      image: "/image4.png",
      title: "Des plats signature uniques",
      subtitle: "Une cuisine fusion d'exception"
    },
    {
      image: "/image3.png",
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
    <div className="min-h-screen bg-[#2a2a2a] text-white">
      {/* Hero Section avec Slider */}
      <div className="relative h-screen">
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
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
            </div>
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
              <img 
                src="/logo.png"
                alt="Tiki Logo"
                className="w-40 h-40 sm:w-48 sm:h-48 md:w-auto md:h-auto"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4">
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 md:mb-8 max-w-2xl">
                {slide.subtitle}
              </p>
              <a
                href="/reserver"
                className="bg-[#C4B5A2] text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg hover:bg-[#A69783] transition-colors text-sm sm:text-base"
              >
                Réservez Maintenant
              </a>

              {/* Indicateurs de slide */}
              <div className="absolute bottom-8 sm:bottom-12 left-0 right-0">
                <div className="flex justify-center space-x-2 sm:space-x-4">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`
                        w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300
                        ${currentSlide === index 
                          ? 'w-6 sm:w-8 bg-[#C4B5A2]' 
                          : 'bg-white/50 hover:bg-white/80'
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
      <div className="relative bg-[#141414]">
        {/* Conteneur des feuilles et du contenu central */}
        <div className="absolute inset-0 flex">
          {/* Feuilles gauches avec une zone de transition */}
          <div className="w-[200px] sm:w-[300px] md:w-[400px] relative">
            <Image
              src="/decorations/leavesleft.webp"
              alt="Décoration gauche"
              fill
              className="object-cover opacity-20"
              priority
            />
            {/* Dégradé de transition */}
            <div className="absolute inset-y-0 right-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-transparent to-[#141414]" />
          </div>

          {/* Zone centrale avec background très sombre */}
          <div className="flex-grow bg-[#141414]">
            <div className="max-w-6xl mx-auto px-4 sm:px-8" />
          </div>

          {/* Feuilles droites avec une zone de transition */}
          <div className="w-[200px] sm:w-[300px] md:w-[400px] relative">
            <Image
              src="/decorations/leavesright.webp"
              alt="Décoration droite"
              fill
              className="object-cover opacity-20"
              priority
            />
            {/* Dégradé de transition */}
            <div className="absolute inset-y-0 left-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-transparent to-[#141414]" />
          </div>
        </div>

        {/* Contenu principal */}
        <div className="relative py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-8">
            <ServiceSection />
          </div>
        </div>

        <div className="relative py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#C4B5A2] text-center mb-6 sm:mb-8">Evènements à venir ...</h2>
            <EventsSection />
          </div>
        </div>
      </div>
    </div>
  );
}