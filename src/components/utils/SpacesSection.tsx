"use client"

import React, { useEffect } from 'react';
import Image from 'next/image';

// Définition des types pour les espaces
interface SpaceProps {
  title: string;
  description: string;
  imagePath: string;
  imageAlt: string;
  number: string;
}

// Composant pour chaque espace individuel
const SpaceItem = ({ title, description, imagePath, imageAlt, number }: SpaceProps) => {
  const isEven = parseInt(number) % 2 === 0;
  
  return (
    <div className="w-full mb-32 md:mb-40 opacity-0 translate-y-10 transition-all duration-1000 ease-out overflow-hidden"
      data-aos="fade-up">
      <div className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-start gap-0`}>
        {/* Section image - alternée selon le numéro */}
        <div className="w-full md:w-1/2 relative overflow-hidden">
          {/* Image principale */}
          <div className="relative h-80 sm:h-96 md:h-[550px] w-full overflow-hidden group">
            {/* Cadre décoratif */}
            <div className="absolute inset-4 border border-[#e8dcc5]/20 z-10 transition-all duration-700 group-hover:inset-6"></div>
            
            {/* Image avec effets */}
            <div className="absolute inset-0 overflow-hidden transition-transform duration-700 ease-in-out transform group-hover:scale-105">
              <Image 
                src={imagePath} 
                alt={imageAlt} 
                layout="fill" 
                objectFit="cover"
                quality={95}
                className="brightness-90 contrast-105 transition-all duration-700 ease-out filter group-hover:brightness-100 group-hover:contrast-110"
              />
            </div>
            
            {/* Overlay stylisé */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40 opacity-70 transition-opacity duration-700 group-hover:opacity-40"></div>
            
            {/* Bordure design coin supérieur */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-[#e8dcc5]/40 transition-all duration-700 group-hover:w-16 group-hover:h-16"></div>
            
            {/* Bordure design coin inférieur */}
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-[#e8dcc5]/40 transition-all duration-700 group-hover:w-16 group-hover:h-16"></div>
            
            {/* Vignette subtile */}
            <div className="absolute inset-0 bg-radial-gradient pointer-events-none"></div>
          </div>
        </div>
        
        {/* Section contenu - alternée selon le numéro */}
        <div className={`w-full md:w-1/2 ${isEven ? 'pr-0 md:pr-16 lg:pr-24 md:pl-0' : 'pl-0 md:pl-16 lg:pl-24'} py-6 md:py-16 flex flex-col justify-center ${isEven ? 'md:text-right' : ''}`}>
          {/* Numéro décoratif en grand */}
          <div className="relative">
            <span className={`absolute -top-16 ${isEven ? '-right-2 md:-right-6' : '-left-2 md:-left-6'} font-didot text-[120px] md:text-[180px] text-[#e8dcc5]/10 select-none pointer-events-none`}>
              {number}
            </span>
            
            {/* Titre et sous-titre */}
            <div className="relative mb-8">
              <h4 className="font-allura text-[#e8dcc5]/80 text-3xl md:text-4xl mb-3">Au bord de l 'eau</h4>
              <h3 className="font-didot text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#e8dcc5] tracking-wide leading-tight">
                {title}
              </h3>
              <div className={`w-16 h-[1px] bg-[#e8dcc5]/50 mt-6 mb-8 ${isEven ? 'ml-auto' : ''}`}></div>
            </div>

            {/* Description */}
            <p className={`text-gray-300 leading-relaxed text-lg md:text-xl mb-12 ${isEven ? 'ml-auto' : ''} max-w-xl`}>
              {description}
            </p>
            
            {/* Bouton */}
            <div className={`${isEven ? 'text-right' : ''}`}>
              <a href="/reserver" className="inline-block px-10 py-4 bg-[#e8dcc5]/20 hover:bg-[#e8dcc5]/30 border border-[#e8dcc5]/30 text-[#e8dcc5] font-didot tracking-widest uppercase text-lg transition-all duration-300">
                Réservez votre table
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant principal pour la section des espaces
export default function SpacesSection() {
  // Données des espaces du restaurant
  const spaces = [
    {
      number: "01",
      title: "Notre Terrasse",
      description: "Profitez d'une vue imprenable sur le Grand Large depuis notre terrasse spacieuse. Idéale pour les repas en journée, elle vous offre un cadre relaxant baigné de soleil et caressé par la brise marine. Chaque repas devient un moment d'évasion face à l'horizon.",
      imagePath: "/Terasse.jpg",
      imageAlt: "Terrasse du restaurant avec vue sur la mer"
    },
    {
      number: "02",
      title: "La Véranda",
      description: "Notre véranda avec vue sur le Grand Large offre une transition parfaite entre intérieur et extérieur. Abritée des éléments mais baignée de lumière naturelle, elle offre une atmosphère chaleureuse où vous pourrez savourer nos spécialités tout en admirant le paysage maritime.",
      imagePath: "/Veranda.jpg",
      imageAlt: "Véranda avec plantes exotiques"
    },
    {
      number: "03",
      title: "Le Petit Salon",
      description: "Pour des moments plus privés, notre petit salon vous accueille dans un écrin de confort et d'élégance. Décoré avec des pièces authentiques, cet espace est parfait pour les dîners romantiques ou les conversations intimes entre amis.",
      imagePath: "/PetitSalon.jpg",
      imageAlt: "Petit salon cosy avec décoration"
    },
    {
      number: "04",
      title: "Le Coin Afterwork",
      description: "Vivez des soirées magiques autour de notre brasero. Cet espace extérieur unique est idéal pour prolonger la soirée dans une ambiance chaleureuse et conviviale. Dégustez nos cocktails maison et laissez-vous bercer par le bruit des vagues tout en profitant de la chaleur du feu.",
      imagePath: "/CoinAfterwork.jpg",
      imageAlt: "Espace brasero en bord de mer pour les soirées"
    }
  ];

  useEffect(() => {
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
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full pt-24 pb-16 px-4 md:px-6 lg:px-8">
      {/* Styles personnalisés pour gradients */}
      <style jsx global>{`
        .bg-radial-gradient {
          background: radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, 0.4) 100%);
        }
      `}</style>
      
      {/* Élément décoratif supérieur */}
      <div className="absolute left-1/2 -translate-x-1/2 top-12 w-[1px] h-16 bg-[#e8dcc5]/30"></div>
      
      {/* Contenu */}
      <div className="max-w-screen-xl mx-auto">
        {/* Titre de section élégant */}
        <div className="text-center mb-32 opacity-0 translate-y-10 transition-all duration-1000 ease-out" data-aos="fade-up">
          <h2 className="font-didot text-5xl sm:text-6xl md:text-7xl font-light text-[#e8dcc5] tracking-wide">
            Nos Espaces
          </h2>
          <div className="w-32 h-[1px] bg-[#e8dcc5]/30 mx-auto mt-8 mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl tracking-wide font-light">
            Découvrez nos différents environnements, chacun avec sa propre ambiance unique
          </p>
        </div>
        
        {/* Liste des espaces */}
        <div className="space-y-16 md:space-y-32">
          {spaces.map((space, index) => (
            <React.Fragment key={space.title}>
              <SpaceItem 
                number={space.number}
                title={space.title}
                description={space.description}
                imagePath={space.imagePath}
                imageAlt={space.imageAlt}
              />
              
              {/* Séparateur décoratif entre les sections (sauf après le dernier) */}
              {index < spaces.length - 1 && (
                <div className="w-full flex flex-col items-center opacity-0 translate-y-10 transition-all duration-1000 ease-out" data-aos="fade-up">
                  <div className="relative w-full max-w-[300px] py-12 my-6">
                    <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#e8dcc5]/40 to-transparent top-1/2 transform -translate-y-1/2"></div>
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rotate-45 border border-[#e8dcc5]/20 bg-black/50"></div>
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rotate-45 border border-[#e8dcc5]/40"></div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
} 