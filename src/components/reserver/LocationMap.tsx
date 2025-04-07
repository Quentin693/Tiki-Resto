"use client"

import React from 'react';
import { MapPin } from 'lucide-react';
import { Palmtree, Anchor } from 'lucide-react';

const GoogleMap = () => (
  <div className="h-[400px] bg-gray-800 relative">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2782.6075252015074!2d4.9783531762406425!3d45.77919567900309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f4c76abb734dcd%3A0x43c9f1c968fba11b!2sTIKI%20au%20bord%20de%20l&#39;eau!5e0!3m2!1sfr!2sfr!4v1716290171633!5m2!1sfr!2sfr&maptype=hybrid"
      width="100%"
      height="100%"
      style={{ border: 0, filter: 'saturate(1.5) hue-rotate(10deg) brightness(0.95)' }}
      allowFullScreen={false}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
    <div className="absolute inset-0 pointer-events-none border-[8px] border-[#C4B5A2]/40 rounded-lg"></div>
    <div className="absolute bottom-4 left-4 flex space-x-2">
      <div className="bg-[#C4B5A2]/80 p-2 rounded-full">
        <Palmtree className="w-5 h-5 text-[#1a1a1a]" />
      </div>
      <div className="bg-[#C4B5A2]/80 p-2 rounded-full">
        <Anchor className="w-5 h-5 text-[#1a1a1a]" />
      </div>
    </div>
  </div>
);

export default function LocationMap() {
  const handleLaunchNavigation = () => {
    window.open('https://maps.google.com?q=Tiki+Au+Bord+de+l\'Eau+Décines-Charpieu', '_blank');
  };

  return (
    <div className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-md mb-8 border border-[#C4B5A2]">
      <GoogleMap />
      <div className="p-4 bg-[#1A1A1A]">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h3 className="font-medium text-white">Adresse</h3>
            <p className="text-gray-400">Tiki Au Bord de l'Eau<br />69330 Decines</p>
          </div>
        </div>
        
        <button 
          onClick={handleLaunchNavigation}
          className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-[#C4B5A2]/30"
        >
          <MapPin className="w-5 h-5 text-[#C4B5A2]" />
          Lancer la navigation
        </button>
      </div>
    </div>
  );
} 