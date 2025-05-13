"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ServiceSection from '@/components/utils/ServiceSection';
import EventsSection from '@/components/utils/EventsSection';
import SpacesSection from '@/components/utils/SpacesSection';
import Head from 'next/head';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '/images/default.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads/')) {
    return `${API_URL}${imagePath}`;
  }
  return imagePath; // Pour les images statiques dans le dossier public
};

// Définition des types pour les espaces
interface SpaceProps {
  title: string;
  description: string;
  imagePath: string;
  imageAlt: string;
  reverse?: boolean;
}

// Composant Separator pour réutilisation
const Separator = () => (
  <div className="w-full py-12 md:py-16 flex flex-col items-center justify-center">
    <div className="relative flex items-center justify-center w-full max-w-md px-4">
      {/* Motif décoratif */}
      <div className="w-1/3 h-[1px] bg-gradient-to-r from-transparent to-[#e8dcc5]/70"></div>
      
      <div className="relative mx-5">
        <div className="w-10 h-10 flex items-center justify-center">
          <div className="absolute w-full h-[1px] bg-[#e8dcc5]/50 rotate-45"></div>
          <div className="absolute w-full h-[1px] bg-[#e8dcc5]/50 -rotate-45"></div>
          <div className="absolute w-3 h-3 rounded-full border border-[#e8dcc5]/70"></div>
          <div className="absolute w-1 h-1 rounded-full bg-[#e8dcc5]"></div>
        </div>
      </div>
      
      <div className="w-1/3 h-[1px] bg-gradient-to-l from-transparent to-[#e8dcc5]/70"></div>
    </div>
  </div>
);

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/image1.png",
      title: "Un cadre paradisiaque",
      subtitle: "Pour vos événements spéciaux"
    },
    {
      image: "/image5.png",
      title: "Une vue panoramique sur l'eau",
      subtitle: "Vue imprenable sur le Grand Large"
    },
    {
      image: "/Brasero.jpg",
      title: "Une expérience culinaire unique",
      subtitle: "Saveurs exotiques & Ambiance chaleureuse"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    // Observer pour animations au défilement
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Observer tous les éléments avec data-aos
    document.querySelectorAll('[data-aos]').forEach(item => {
      observer.observe(item);
    });
    
    // Détection du défilement jusqu'en bas de la page
    const handleScroll = () => {
      // La hauteur totale de la page, incluant ce qui n'est pas visible
      const totalPageHeight = document.body.scrollHeight;
      // La hauteur de la fenêtre du navigateur
      const windowHeight = window.innerHeight;
      // Position actuelle du défilement depuis le haut
      const scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      
      // Si l'utilisateur est proche du bas de la page (à 50px près)
      if (scrollPosition + windowHeight >= totalPageHeight - 50) {
        // Rediriger vers la page de réservation
        window.location.href = '/reserver';
      }
    };
    
    // Ajouter l'écouteur d'événement de défilement
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(timer);
      observer.disconnect();
      // Nettoyer l'écouteur d'événement de défilement
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Allura&display=swap" />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/didot" />
      </Head>
      <div className="flex flex-col w-full min-h-screen bg-[#0f0f0f] text-white relative">
        {/* Background global avec feuilles décoratives - limité au contenu principal */}
        <div className="absolute inset-0 flex z-0 pointer-events-none overflow-hidden">
          {/* Feuilles gauches avec une zone de transition */}
          <div className="w-[15%] sm:w-[20%] md:w-[25%] relative">
            <Image
              src="/decorations/leavesleft.webp"
              alt="Décoration gauche"
              fill
              className="object-cover opacity-10"
              priority
            />
            {/* Dégradé de transition */}
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-[#0f0f0f]" />
          </div>

          {/* Zone centrale avec background très sombre */}
          <div className="flex-grow bg-[#0f0f0f]" />

          {/* Feuilles droites avec une zone de transition */}
          <div className="w-[15%] sm:w-[20%] md:w-[25%] relative">
            <Image
              src="/decorations/leavesright.webp"
              alt="Décoration droite"
              fill
              className="object-cover opacity-10"
              priority
            />
            {/* Dégradé de transition */}
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-l from-transparent to-[#0f0f0f]" />
          </div>
        </div>

        {/* Hero Section avec Slider - prend toute la hauteur et largeur de la fenêtre */}
        <div className="relative w-full h-screen z-10 overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div 
                className="absolute inset-0" 
                style={{ 
                  backgroundImage: `url(${getImageUrl(slide.image)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  width: '100vw',
                  height: '100vh',
                  filter: 'brightness(75%) contrast(110%) saturate(100%)',
                }}
              >
                <div className="absolute inset-0 bg-black/35" />
              </div>
            </div>
          ))}
          
          {/* Contenu Hero avec Titre et Bouton */}
          <div className="relative h-full w-full flex flex-col items-center justify-center text-center px-4">
            <div className="flex flex-col items-center justify-center max-w-screen-xl mx-auto">
              {/* Titre Tiki Resto avec logo en dessous */}
              <div className="flex flex-col items-center justify-center mb-4">
                <h2 className="font-didot text-8xl sm:text-7xl md:text-8xl font-light tracking-widest text-white leading-none capitalize">
                  TIKI  
                </h2>
                
                <img 
                  src="/logos/TikiLogo.png"
                  alt="Tiki Logo"
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 my-4 opacity-95"
                />
              </div>
              
              {/* Sous-titre avec la même font */}
              <p className="font-allura text-10xl sm:text-6xl md:text-5xl text-[#e8dcc5] tracking-wide leading-none mb-6">
                Au Bord de l &apos;eau
              </p>
              
              {/* Séparateur élégant */}
              <div className="w-48 sm:w-56 md:w-64 h-[1px] bg-gradient-to-r from-transparent via-[#e8dcc5]/70 to-transparent mb-12"></div>
              
              {/* Titre du slide - design plus épuré */}
              <h1 className="font-didot text-5xl sm:text-6xl md:text-7xl font-light text-white tracking-wide mb-3">
                {slides[currentSlide].title}
              </h1>
              
              {/* Sous-titre du slide */}
              <p className="text-lg sm:text-xl md:text-2xl text-[#e8dcc5]/90 max-w-2xl font-light mb-12">
                {slides[currentSlide].subtitle}
              </p>
              
              {/* Bouton de réservation plus élégant */}
              <a
                href="/reserver"
                className="group relative overflow-hidden bg-transparent text-[#e8dcc5] font-didot text-xl font-medium px-12 py-4 tracking-wider uppercase transition-all duration-500"
              >
                <span className="relative z-10">Réservez Maintenant</span>
                <span className="absolute inset-0 border border-[#e8dcc5]/70 group-hover:border-[#e8dcc5] transition-colors duration-500"></span>
                <span className="absolute bottom-0 left-0 right-0 h-0 bg-[#e8dcc5]/10 group-hover:h-full transition-all duration-300 ease-out"></span>
                <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#e8dcc5]/50 group-hover:bg-[#e8dcc5] transition-colors duration-500"></span>
              </a>
            </div>

            {/* Indicateurs de slide plus discrets */}
            <div className="absolute bottom-12 sm:bottom-16 left-0 right-0">
              <div className="flex justify-center space-x-5">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`
                      h-[2px] transition-all duration-300
                      ${currentSlide === index 
                        ? 'w-12 bg-[#e8dcc5]' 
                        : 'w-12 bg-white/30 hover:bg-white/50'
                      }
                    `}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal - au-dessus du background */}
        <div className="relative z-10">
          {/* Section des espaces du restaurant */}
          <SpacesSection />
          
          {/* Séparateur élégant */}
          <Separator />

          {/* Section Plateaux de Fruits de Mer */}
          <div className="relative w-full py-24 md:py-32 overflow-hidden">
            
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
              {/* Titre décoratif */}
              <div className="text-center mb-20" data-aos="fade-up">
                <span className="font-allura text-3xl md:text-4xl text-[#e8dcc5]/80">Saveurs de l 'océan</span>
                <h2 className="font-didot text-5xl sm:text-6xl font-light text-[#e8dcc5] mt-2 mb-6 tracking-wide">
                  Bar à Fruits de Mer
                </h2>
                <div className="w-20 h-[1px] bg-[#e8dcc5]/50 mx-auto"></div>
              </div>
              
              {/* Contenu principal */}
              <div className="relative flex flex-col lg:flex-row items-center gap-12 md:gap-16 lg:gap-20">
                {/* Image du plateau */}
                <div className="relative w-full lg:w-1/2 aspect-square max-w-md mx-auto lg:mx-0" data-aos="fade-right">
                  <div className="absolute inset-4 border border-[#e8dcc5]/30 z-10"></div>
                  <div className="absolute inset-0 overflow-hidden">
                    <Image 
                      src="/Plateau.jpg" 
                      alt="Plateau de fruits de mer" 
                      fill 
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                      priority 
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/30 opacity-60"></div>
                  
                  {/* Badge "Sur place ou à emporter" */}
                  <div className="absolute top-6 right-6 bg-[#e8dcc5] text-[#0f0f0f] px-4 py-2 font-didot tracking-wider text-sm uppercase rotate-3 shadow-lg">
                    Sur place ou à emporter
                  </div>
                </div>
                
                {/* Texte descriptif */}
                <div className="w-full lg:w-1/2 max-w-2xl" data-aos="fade-left">
                  <h3 className="font-didot text-3xl sm:text-4xl text-[#e8dcc5] mb-6">Une expérience maritime d'exception</h3>
                  
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    Découvrez notre sélection de fruits de mer fraîchement pêchés et soigneusement préparés. Des huîtres fines de claire aux perles de l'impératrice Joël Dupuch, en passant par nos plateaux composés et assiettes dégustation.
                  </p>
                  
                  {/* Plateaux disponibles */}
                  <div className="space-y-6 mb-10">
                    <div className="flex items-center">
                      <div className="h-px w-6 bg-[#e8dcc5]/50 mr-4"></div>
                      <h4 className="font-didot text-xl text-[#e8dcc5]">Nos plateaux et assiettes</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Plateau de l'écaillé */}
                      <div className="bg-[#1a1a1a]/50 border border-[#e8dcc5]/20 p-4 rounded-sm">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-[#e8dcc5]">Plateau de l'écailler</h5>
                          <span className="text-[#e8dcc5] font-light">49.00€</span>
                        </div>
                        <p className="text-gray-400 text-sm">12 fines de claire, 6 crevettes roses, bulots 300g</p>
                      </div>
                      
                      {/* Plateau du pêcheur */}
                      <div className="bg-[#1a1a1a]/50 border border-[#e8dcc5]/20 p-4 rounded-sm">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-[#e8dcc5]">Plateau du pêcheur</h5>
                          <span className="text-[#e8dcc5] font-light">62.00€</span>
                        </div>
                        <p className="text-gray-400 text-sm">12 Perles de l'impératrice, 6 crevettes roses, bulots 300g</p>
                      </div>
                      
                      {/* Assiette de l'écaillé */}
                      <div className="bg-[#1a1a1a]/50 border border-[#e8dcc5]/20 p-4 rounded-sm">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-[#e8dcc5]">Assiette de l'écailler</h5>
                          <span className="text-[#e8dcc5] font-light">15.00€</span>
                        </div>
                        <p className="text-gray-400 text-sm">3 fines de claire n°3, 3 crevettes roses, bulots 100g</p>
                      </div>
                      
                      {/* Assiette dégustation */}
                      <div className="bg-[#1a1a1a]/50 border border-[#e8dcc5]/20 p-4 rounded-sm">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-[#e8dcc5]">Assiette dégustation</h5>
                          <span className="text-[#e8dcc5] font-light">19.00€</span>
                        </div>
                        <p className="text-gray-400 text-sm">3 fines de claire n°3, 3 Perles de l'impératrice n°3</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Produits individuels */}
                  <div className="space-y-5 mb-10">
                    <div className="flex items-center">
                      <div className="h-px w-6 bg-[#e8dcc5]/50 mr-4"></div>
                      <h4 className="font-didot text-xl text-[#e8dcc5]">Produits à l'unité</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Fines de claire</span>
                        <span className="text-[#e8dcc5]">24.00€ / 12.00€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Perles de l'impératrice</span>
                        <span className="text-[#e8dcc5]">32.00€ / 16.00€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Bulots (300g)</span>
                        <span className="text-[#e8dcc5]">14.00€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Bouquet de crevettes (6)</span>
                        <span className="text-[#e8dcc5]">12.00€</span>
                      </div>
                      <div className="text-gray-500 text-xs italic">
                        Produits sur commande (homard, tourteau, langoustines) disponibles
                      </div>
                    </div>
                  </div>
                  
                  {/* Bouton de commande */}
                  <div className="flex items-center">
                    <a href="/commander" className="bg-[#e8dcc5]/20 hover:bg-[#e8dcc5]/30 border border-[#e8dcc5]/40 px-8 py-3 text-[#e8dcc5] font-didot tracking-wider uppercase transition-all duration-300">
                      Commander
                    </a>
                    <p className="ml-6 text-gray-400 text-sm">
                      Réservation 48h à l'avance<br />requise pour l'emporter
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Séparateur élégant */}
          <Separator />

          {/* Section Services */}
          <div className="relative w-full py-24 md:py-32">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="font-didot text-5xl sm:text-6xl font-light text-[#e8dcc5] text-center mb-16 tracking-wide">
                Nos Services
              </h2>
              <ServiceSection />
            </div>
          </div>
          
          {/* Séparateur élégant */}
          <Separator />

          {/* Section Événements */}
          <div className="relative w-full py-24 md:py-32">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="font-didot text-5xl sm:text-6xl font-light text-[#e8dcc5] text-center mb-16 tracking-wide">
                Évènements à venir
              </h2>
              <EventsSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}