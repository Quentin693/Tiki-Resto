"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Wines() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState('/carte/cartevin.pdf');

  // Fonction pour normaliser le chemin du PDF en URL absolue
  const getAbsolutePdfUrl = () => {
    // Si c'est déjà une URL absolue, on la retourne telle quelle
    if (pdfUrl.startsWith('http')) return pdfUrl;
    
    // Sinon, on construit l'URL absolue en se basant sur l'emplacement actuel
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}${pdfUrl.startsWith('/') ? '' : '/'}${pdfUrl}`;
  };

  useEffect(() => {
    const checkPdfExists = async () => {
      try {
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to check PDF:', error);
        toast.error('Erreur lors du chargement de la carte des vins');
        setIsLoading(false);
      }
    };
    
    checkPdfExists();
  }, []);

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
      toast.success('Nouvelle carte des vins téléchargée');
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
    <section className="container mx-auto py-20 px-4 min-h-[calc(100vh-180px)]">
      <div className="max-w-6xl mx-auto">
        {/* En-tête élégant */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-didot-bold">Notre Carte des Vins</h2>
          <div className="w-16 h-0.5 bg-[#C4B5A2] mx-auto mt-6"></div>
        </div>
        
        {/* Layout principal */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image à gauche */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xl">
              <Image 
                src="/images/VasqueRose.jpg" 
                alt="Notre sélection de vins" 
                fill 
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              
              {/* Overlay élégant */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              
              {/* Texte décoratif */}
              <div className="absolute top-8 left-0 bg-black/70 backdrop-blur-sm py-3 px-6">
                <span className="text-[#C4B5A2] font-light italic tracking-wider">Sélection</span>
              </div>
              
              {/* Texte du bas */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <p className="text-sm uppercase tracking-widest mb-2 font-light">Dégustation</p>
                <h3 className="text-2xl font-didot-bold">Moment d'exception</h3>
              </div>
            </div>
          </div>
          
          {/* Contenu à droite */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h3 className="text-3xl font-didot-bold mb-6">Découvrez notre sélection</h3>
            
            <p className="text-gray-300 mb-10 leading-relaxed">
              Une collection exclusive de vins fins soigneusement sélectionnés pour accompagner votre expérience gastronomique. Notre sommelier a composé une carte d'exception, alliant tradition et découverte pour sublimer chaque plat.
            </p>
            
            <ul className="mb-12 space-y-3 text-gray-400">
              <li className="flex items-center justify-center lg:justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C4B5A2] mr-3"></span>
                Grands crus et appellations prestigieuses
              </li>
              <li className="flex items-center justify-center lg:justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C4B5A2] mr-3"></span>
                Sélection de vins et champagnes
              </li>
              <li className="flex items-center justify-center lg:justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C4B5A2] mr-3"></span>
                Vins au verre
              </li>
            </ul>
            
            {/* Boutons pour consulter et télécharger */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href={getAbsolutePdfUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 border border-[#C4B5A2] text-[#C4B5A2] font-light hover:bg-[#C4B5A2] hover:text-black transition-all duration-300 tracking-wide"
              >
                <span className="flex items-center justify-center">
                  <ExternalLink className="mr-2" size={18} />
                  Consulter
                </span>
              </a>
              
              <a 
                href={getAbsolutePdfUrl()} 
                download="Carte_Vins_TikiRestaurant.pdf" 
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
      </div>

      {user?.role === 'admin' && (
        <div className="mt-20 max-w-md mx-auto">
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
              <p className="text-gray-500 text-sm">Mettre à jour la carte des vins (PDF)</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}