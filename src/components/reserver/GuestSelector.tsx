"use client"

import React from 'react';
import { Users } from 'lucide-react';

interface GuestSelectorProps {
  guests: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  showOtherGuests: boolean;
  setShowOtherGuests: React.Dispatch<React.SetStateAction<boolean>>;
  showManualGuests: boolean;
  setShowManualGuests: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  guestsRef: React.RefObject<HTMLDivElement | null>;
}

export default function GuestSelector({
  guests,
  setFormData,
  showOtherGuests,
  setShowOtherGuests,
  showManualGuests,
  setShowManualGuests,
  setShowCalendar,
  guestsRef
}: GuestSelectorProps) {
  return (
    <div className="relative" ref={guestsRef}>
      <p className="text-sm text-gray-400 mb-2">Personnes</p>
      <div 
        className="bg-[#2a2a2a] rounded-lg p-4 border border-[#C4B5A2]/20 cursor-pointer hover:border-[#C4B5A2]/40 transition-colors"
        onClick={() => {
          setShowOtherGuests(!showOtherGuests);
          setShowManualGuests(false);
          setShowCalendar(false);
        }}
      >
        <div className="flex justify-between items-center">
          <span className="text-xl font-medium">{guests}</span>
          <Users className="w-5 h-5 text-[#C4B5A2]" />
        </div>
      </div>
      {showOtherGuests && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#2a2a2a] rounded-lg border border-[#C4B5A2]/20 p-2 z-10">
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <button
                key={num}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    guests: num.toString()
                  }));
                  setShowOtherGuests(false);
                }}
                className={`p-2 rounded ${
                  guests === num.toString() 
                    ? 'bg-[#C4B5A2] text-black' 
                    : 'hover:bg-[#3a3a3a]'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              className="p-2 rounded text-[#C4B5A2] hover:bg-[#3a3a3a] col-span-4 text-center font-medium mt-2"
              onClick={() => {
                // Switch to manual input mode
                setShowOtherGuests(false);
                setShowManualGuests(true);
              }}
            >
              Plus de personnes
            </button>
          </div>
        </div>
      )}
      {showManualGuests && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#2a2a2a] rounded-lg border border-[#C4B5A2]/20 p-4 z-10">
          <label className="block text-sm text-gray-400 mb-2">
            Nombre exact de personnes
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="50"
              value={guests}
              onChange={(e) => {
                const value = Math.max(1, Math.min(50, parseInt(e.target.value) || 1));
                setFormData(prev => ({
                  ...prev,
                  guests: value.toString()
                }));
              }}
              className="flex-1 px-4 py-2 bg-[#1A1A1A] rounded-lg border border-[#C4B5A2]/30 focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white"
              placeholder="Nombre de personnes"
            />
            <button
              type="button"
              onClick={() => {
                setShowManualGuests(false);
              }}
              className="bg-[#C4B5A2] text-black px-4 py-2 rounded-lg hover:bg-[#a39482] transition-colors"
            >
              OK
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Pour les groupes de plus de 20 personnes, veuillez nous contacter directement par téléphone.
          </p>
        </div>
      )}
    </div>
  );
} 