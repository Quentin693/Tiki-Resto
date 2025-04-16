import Image from 'next/image';
import { useState, useEffect } from 'react';

const partnerLogos = [
  { id: 1, src: "/logos/LogoAE.png", name: "Actu Event" },
  { id: 2, src: "/logos/LogoEDF.png", name: "EDF" },
  { id: 3, src: "/logos/LogoFrF.png", name: "France Frais" },
  { id: 4, src: "/logos/fullsport.jpg", name: "Full sport" },
  { id: 5, src: "/logos/LogoXPOLo.png", name: "XPO logistics" },
  { id: 6, src: "/logos/LogoPlattard.png", name: "Plattard" },
];

export default function PartnerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const logosToShow = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex % partnerLogos.length;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-16">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Ils nous ont fait confiance...</h2>
        <div className="w-16 h-0.5 bg-[#C4B5A2] mx-auto"></div>
      </div>
      
      <div className="relative h-32 overflow-hidden bg-[#1a1a1a]/60 rounded-xl border border-[#C4B5A2]/20 p-4">
        <div className="absolute inset-0">
          <div 
            className="flex w-full h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / logosToShow)}%)` }}
          >
            {partnerLogos.map((logo, index) => (
              <div 
                key={logo.id}
                className="flex-none w-1/3 px-4 flex items-center justify-center"
              >
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-16 flex items-center justify-center">
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={120}
                      height={60}
                      className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{logo.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-2">
          {partnerLogos.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-[#C4B5A2]' : 'bg-gray-600'}`}
              aria-label={`Voir logo ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 