"use client"

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Share2, Instagram, Facebook } from 'lucide-react';
import Image from 'next/image';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const categories = [
    { id: 'all', name: 'Tout' },
    { id: 'restaurant', name: 'Restaurant' },
    { id: 'dishes', name: 'Plats' },
    { id: 'events', name: 'Événements' }
  ];

  const images = [
    {
      id: 1,
      src: "/image1.png",
      category: "restaurant",
      title: "Vue extérieure",
      description: "Notre façade tropicale"
    },
    {
      id: 2,
      src: "/image2.png",
      category: "restaurant",
      title: "Salle principale",
      description: "Ambiance tamisée et décoration exotique"
    },
    {
      id: 3,
      src: "/image3.png",
      category: "dishes",
      title: "Cocktail Signature",
      description: "Notre fameux cocktail Tiki"
    },
    {
      id: 4,
      src: "/image4.png",
      category: "dishes",
      title: "Mahi-Mahi",
      description: "Poisson grillé aux épices"
    },
    {
      id: 5,
      src: "/image4.png",
      category: "events",
      title: "Soirée Polynésienne",
      description: "Danseurs traditionnels"
    },
    {
      id: 6,
      src: "/image1.png",
      category: "events",
      title: "Concert Live",
      description: "Musique traditionnelle"
    }
  ];

  const filteredImages = activeCategory === 'all' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  useEffect(() => {
    let interval;
    if (isPlaying && !selectedImage) {
      interval = setInterval(() => {
        setSelectedImage(prev => {
          const currentIndex = filteredImages.findIndex(img => img.id === prev?.id);
          return filteredImages[(currentIndex + 1) % filteredImages.length];
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, filteredImages]);

  const handleNext = () => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage?.id);
    setSelectedImage(filteredImages[(currentIndex + 1) % filteredImages.length]);
  };

  const handlePrev = () => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage?.id);
    setSelectedImage(filteredImages[(currentIndex - 1 + filteredImages.length) % filteredImages.length]);
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
              <h1 className="text-4xl font-bold mb-4">Galerie Photos</h1>
              <div className="w-24 h-1 bg-[#C4B5A2] mx-auto mb-4"></div>
              <p className="text-gray-300">Plongez dans l'ambiance unique de notre restaurant</p>
            </div>

            {/* Filtres */}
            <div className="flex justify-center space-x-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-2 rounded-full border-2 transition-colors ${
                    activeCategory === category.id
                      ? 'border-[#C4B5A2] bg-[#C4B5A2] text-white'
                      : 'border-[#C4B5A2]/30 hover:border-[#C4B5A2] text-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Grille d'images */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image) => (
                <div 
                  key={image.id}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-[#C4B5A2]/20 shadow-xl bg-[#2a2a2a]/90 backdrop-blur-md"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  <div className="relative h-64">
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="text-lg font-semibold">{image.title}</h3>
                    <p className="text-sm text-gray-300">{image.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal pour zoom */}
            {selectedImage && (
              <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center">
                <div className="absolute top-4 right-4 space-x-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-4 py-2 rounded-lg bg-[#C4B5A2] text-white hover:bg-[#A69783] transition-colors"
                  >
                    {isPlaying ? 'Pause' : 'Lecture auto'}
                  </button>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-white hover:text-[#C4B5A2] transition-colors"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>
                
                <button
                  onClick={handlePrev}
                  className="absolute left-4 text-white hover:text-[#C4B5A2] transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                
                <div className="max-w-4xl max-h-[80vh] relative">
                  <div className="relative h-[80vh] w-full">
                    <Image
                      src={selectedImage.src}
                      alt={selectedImage.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80">
                    <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
                    <p className="text-gray-300 mb-4">{selectedImage.description}</p>
                    <div className="flex space-x-4">
                      <button className="flex items-center gap-2 text-[#C4B5A2] hover:text-white transition-colors">
                        <Facebook className="w-5 h-5" />
                        Partager
                      </button>
                      <button className="flex items-center gap-2 text-[#C4B5A2] hover:text-white transition-colors">
                        <Instagram className="w-5 h-5" />
                        Partager
                      </button>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  className="absolute right-4 text-white hover:text-[#C4B5A2] transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}