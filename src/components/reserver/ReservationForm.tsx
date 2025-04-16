"use client"

import React, { useEffect } from 'react';
import { Phone, Mail, User, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ReservationFormProps {
  formData: {
    date: string;
    time: string;
    guests: string;
    specialRequests: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  error: string;
}

export default function ReservationForm({
  formData,
  handleInputChange,
  handleSubmit,
  isSubmitting,
  error
}: ReservationFormProps) {
  const { user, isAuthenticated } = useAuth();

  // Préremplir les champs si l'utilisateur est connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      // Créer un événement synthétique pour chaque champ à préremplir
      const fields = {
        customerName: user.name || '',
        customerEmail: user.email || '',
        customerPhone: user.phoneNumber || ''
      };

      // On ne prérempli que si les champs sont vides
      Object.entries(fields).forEach(([fieldName, fieldValue]) => {
        if (fieldValue && !formData[fieldName as keyof typeof formData]) {
          const syntheticEvent = {
            target: {
              name: fieldName,
              value: fieldValue
            }
          } as React.ChangeEvent<HTMLInputElement>;
          
          handleInputChange(syntheticEvent);
        }
      });
    }
  }, [isAuthenticated, user, handleInputChange, formData]);

  return (
    <div className="bg-[#2a2a2a] rounded-xl p-4 sm:p-6 md:p-8 mt-4 sm:mt-6 mb-4 sm:mb-6 border border-[#C4B5A2]/30">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Vos coordonnées</h3>
      
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-3 sm:space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
              placeholder="Nom et prénom"
              className="pl-9 sm:pl-10 w-full p-2.5 sm:p-3 bg-[#1A1A1A] rounded-lg border border-[#C4B5A2]/30 focus:outline-none focus:border-[#C4B5A2] text-sm sm:text-base"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              required
              placeholder="Adresse email"
              className="pl-9 sm:pl-10 w-full p-2.5 sm:p-3 bg-[#1A1A1A] rounded-lg border border-[#C4B5A2]/30 focus:outline-none focus:border-[#C4B5A2] text-sm sm:text-base"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              required
              placeholder="Téléphone"
              className="pl-9 sm:pl-10 w-full p-2.5 sm:p-3 bg-[#1A1A1A] rounded-lg border border-[#C4B5A2]/30 focus:outline-none focus:border-[#C4B5A2] text-sm sm:text-base"
            />
          </div>
          
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              placeholder="Demandes spéciales (allergies, occasion spéciale...)"
              rows={4}
              className="pl-9 sm:pl-10 w-full p-2.5 sm:p-3 bg-[#1A1A1A] rounded-lg border border-[#C4B5A2]/30 focus:outline-none focus:border-[#C4B5A2] text-sm sm:text-base"
            ></textarea>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#C4B5A2] text-black font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors hover:bg-[#a39482] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isSubmitting ? "Réservation en cours..." : "Confirmer la réservation"}
          </button>
        </div>
        
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400 text-center">
          En réservant, vous acceptez de fournir vos coordonnées pour la confirmation.
        </p>
      </form>
    </div>
  );
} 