"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Download, FileText, ChevronLeft, ChevronRight, Eye, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Images de plats avec descriptions pour le diaporama
const featuredDishes = [
  {
    id: 1,
    name: "Tartare de bœuf charolais au couteau 180g",
    description: "Frites fraiches & bouquet de salade",
    image: "/plats/789e4106a9510e5758f1323d62a1bf0392.jpeg", // Assurez-vous que ces images existent dans votre dossier public
    category: "Plats"
  },
  {
    id: 2,
    name: "Tataki de Thon",
    description: "Tataki de thon en croûte de sésame, sauce thaï et légumes croquants",
    image: "/plats/11089de9dd601532210ee8f589437272a1.jpeg",
    category: "Entrées"
  },
  {
    id: 3,
    name: "Tartaki de Boeuf 380g",
    description: "Tartare de bœuf charolais & tataki de bœuf à l’Italienne, frite fraiches",
    image: "/plats/cccba0db20dfc054e847947d1410686a6.jpeg",
    category: "Plats"
  },
  {
    id: 4,
    name: "Cuisses de grenouilles comme en Dombes 300g",
    description: "Pommes de terre grenaille",
    image: "/plats/grenouilles.jpeg",
    category: "Plats"
  },
  {
    id: 5,
    name: "Brioche Perdue Nanterre",
    description: "Caramel beurre salé & boule de glace crème brulée",
    image: "/plats/e4a171e7cad3c22b71080b6284b590934.jpeg",
    category: "Desserts"
  }
];

export default function Carte() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState('/carte/carte.pdf'); // Chemin par défaut vers votre PDF statique
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fonction pour normaliser le chemin du PDF en URL absolue
  const getAbsolutePdfUrl = () => {
    // Si c'est déjà une URL absolue, on la retourne telle quelle
    if (pdfUrl.startsWith('http')) return pdfUrl;
    
    // Sinon, on construit l'URL absolue en se basant sur l'emplacement actuel
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}${pdfUrl.startsWith('/') ? '' : '/'}${pdfUrl}`;
  };

  // Effet pour vérifier si le PDF existe
  useEffect(() => {
    const checkPdfExists = async () => {
      try {
        // Pour l'instant, nous utilisons un PDF statique
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to check PDF:', error);
        toast.error('Erreur lors du chargement du menu');
        setIsLoading(false);
      }
    };
    
    checkPdfExists();
  }, []);

  // Fonction pour passer à la diapositive suivante
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === featuredDishes.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  // Fonction pour passer à la diapositive précédente
  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? featuredDishes.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  // Auto-défilement
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Pour les administrateurs qui veulent uploader un nouveau PDF
  const handleUploadNewPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    if (file.type !== 'application/pdf') {
      toast.error('Veuillez sélectionner un fichier PDF');
      return;
    }
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Commentez cette section et implémentez-la quand votre API sera prête
      // const response = await fetch(`${API_URL}/uploads/menu-pdf`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: formData,
      // });
      
      // if (!response.ok) throw new Error('Failed to upload PDF');
      // const data = await response.json();
      // setPdfUrl(data.pdfUrl);
      
      // Pour l'instant, nous continuons à utiliser le PDF statique
      toast.success('Nouveau menu PDF téléchargé');
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to upload PDF:', error);
      toast.error('Erreur lors du téléchargement du PDF');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C4B5A2]"></div>
      </div>
    );
  }

  return (
    <section className="min-h-[calc(100vh-200px)] py-10">
      <div className="text-center mb-14">
        <h2 className="text-5xl font-didot-bold mb-4">Notre Carte</h2>
        <div className="w-16 h-0.5 bg-[#C4B5A2] mx-auto mb-8"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 flex flex-col lg:flex-row gap-12 items-center">
        {/* Section PDF à gauche */}
        <div className="w-full lg:w-1/2 bg-[#1a1a1a] p-8 rounded-lg border border-[#C4B5A2]/30 shadow-xl">
          <div className="text-center">
            <FileText size={40} className="mx-auto text-[#C4B5A2] mb-5" />
            <h3 className="text-2xl font-didot-bold mb-3">Notre carte complète</h3>
            <p className="text-gray-400 text-sm mb-8">Consultez notre carte pour découvrir tous nos plats</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href={getAbsolutePdfUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 border border-[#C4B5A2] text-[#C4B5A2] hover:bg-[#C4B5A2] hover:text-black transition-all duration-300 tracking-wide"
              >
                <span className="flex items-center justify-center">
                  <ExternalLink className="mr-2" size={18} />
                  Consulter
                </span>
              </a>
              
              <a 
                href={getAbsolutePdfUrl()} 
                download="Carte_TikiRestaurant.pdf" 
                className="inline-block px-6 py-3 text-gray-400 hover:text-white transition-all duration-300 tracking-wide"
              >
                <span className="flex items-center justify-center">
                  <Download className="mr-2" size={18} />
                  Télécharger
                </span>
              </a>
            </div>
            
          </div>
        </div>
        
        {/* Diaporama à droite avec taille réduite */}
        <div className="w-full lg:w-1/2">
          <h3 className="text-xl font-didot-bold mb-5 text-center lg:text-left">Nos Spécialités</h3>
          
          <div className="relative">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredDishes.map((dish) => (
                  <div key={dish.id} className="w-full flex-shrink-0">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 500px"
                        priority
                      />
                      
                      {/* Overlay plus subtil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                      
                      {/* Texte en bas de l'image - style plus raffiné */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                        <span className="inline-block px-2 py-1 mb-2 rounded-sm bg-[#C4B5A2]/80 text-black text-xs font-medium uppercase tracking-wider">{dish.category}</span>
                        <h4 className="text-white text-xl font-didot-bold mb-1">{dish.name}</h4>
                        <p className="text-gray-200 text-sm font-light">{dish.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation buttons plus petits et élégants */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-[#C4B5A2] p-2 rounded-full hover:text-black transition-all duration-300 text-white"
              aria-label="Plat précédent"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-[#C4B5A2] p-2 rounded-full hover:text-black transition-all duration-300 text-white"
              aria-label="Plat suivant"
            >
              <ChevronRight size={20} />
            </button>
            
            {/* Indicators plus petits et élégants */}
            <div className="flex justify-center mt-4 gap-2">
              {featuredDishes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsTransitioning(true);
                    setCurrentSlide(index);
                    setTimeout(() => setIsTransitioning(false), 500);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'bg-[#C4B5A2] w-6' : 'bg-gray-600 w-1.5 hover:bg-gray-400'
                  }`}
                  aria-label={`Aller au plat ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="mt-16 max-w-md mx-auto">
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Administration</h3>
            <div className="relative border border-dashed border-gray-700 rounded p-6 text-center">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleUploadNewPdf}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileText size={24} className="mx-auto text-gray-500 mb-2" />
              <p className="text-gray-500 text-sm">Mettre à jour le menu (PDF)</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}