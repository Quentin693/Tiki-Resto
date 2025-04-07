"use client"

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { renderEventTypeLabel } from '@/utils/eventUtils';

interface EventConfirmationProps {
  showEventConfirmation: boolean;
  setShowEventConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  eventFormData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    eventType: string;
    eventDate: string;
    guestCount: string;
    specialRequests: string;
  };
}

export default function EventConfirmation({
  showEventConfirmation,
  setShowEventConfirmation,
  eventFormData
}: EventConfirmationProps) {
  if (!showEventConfirmation) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-[#2a2a2a] p-8 rounded-xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Demande envoyée avec succès !</h3>
          <div className="bg-black/20 rounded-lg p-4 my-4 text-left">
            <div className="mb-2">
              <span className="text-gray-400">Nom :</span> 
              <span className="ml-2 font-medium">{eventFormData.customerName}</span>
            </div>
            <div className="mb-2">
              <span className="text-gray-400">Email :</span> 
              <span className="ml-2 font-medium">{eventFormData.customerEmail}</span>
            </div>
            <div className="mb-2">
              <span className="text-gray-400">Type d'événement :</span> 
              <span className="ml-2 font-medium">{renderEventTypeLabel(eventFormData.eventType)}</span>
            </div>
            <div className="mb-2">
              <span className="text-gray-400">Date souhaitée :</span> 
              <span className="ml-2 font-medium">{new Date(eventFormData.eventDate).toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
          </div>
          <p className="text-gray-300 mb-6">
            Notre équipe vous contactera dans les 48 heures pour discuter des détails et vous proposer un devis personnalisé.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowEventConfirmation(false)}
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