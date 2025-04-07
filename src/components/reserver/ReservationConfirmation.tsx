"use client"

import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ReservationConfirmationProps {
  showConfirmation: boolean;
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  formData: {
    date: string;
    time: string;
    guests: string;
    specialRequests: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
}

export default function ReservationConfirmation({
  showConfirmation,
  setShowConfirmation,
  formData
}: ReservationConfirmationProps) {
  if (!showConfirmation) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-[#2a2a2a] p-8 rounded-xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Réservation prise en compte !</h3>
          <div className="bg-black/20 rounded-lg p-4 my-4 text-left">
            <div className="mb-2">
              <span className="text-gray-400">Nom :</span> 
              <span className="ml-2 font-medium">{formData.customerName}</span>
            </div>
            <div className="mb-2">
              <span className="text-gray-400">Date :</span> 
              <span className="ml-2 font-medium">{new Date(formData.date).toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
            <div className="mb-2">
              <span className="text-gray-400">Heure :</span> 
              <span className="ml-2 font-medium">{formData.time}</span>
            </div>
            <div className="mb-2">
              <span className="text-gray-400">Personnes :</span> 
              <span className="ml-2 font-medium">{formData.guests} {parseInt(formData.guests) === 1 ? 'personne' : 'personnes'}</span>
            </div>
            <div className="mb-2">
              <span className="text-gray-400">Téléphone :</span> 
              <span className="ml-2 font-medium">{formData.customerPhone}</span>
            </div>
            {formData.specialRequests && (
              <div>
                <span className="text-gray-400">Demandes spéciales :</span>
                <p className="mt-1 text-sm italic">{formData.specialRequests}</p>
              </div>
            )}
          </div>
          <p className="text-gray-300 mb-6">
            Vous recevrez un SMS de confirmation dans quelques instants.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowConfirmation(false)}
              className="bg-[#C4B5A2] text-black font-medium px-6 py-3 rounded-lg hover:bg-[#a39482] transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={() => window.location.href = "/"}
              className="bg-[#1A1A1A] text-white font-medium px-6 py-3 rounded-lg hover:bg-[#2a2a2a] border border-[#C4B5A2]/30 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 