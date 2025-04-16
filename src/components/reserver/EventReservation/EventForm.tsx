"use client"

import React, { useRef, useState } from 'react';
import { Users, Mail, Phone, CakeSlice, Calendar, MessageSquare, CheckCircle, X } from 'lucide-react';
import SimpleCalendar from '@/components/reserver/SimpleCalendar';
import emailjs from '@emailjs/browser';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

interface EventFormProps {
  eventFormData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    eventType: string;
    eventDate: string;
    guestCount: string;
    specialRequests: string;
  };
  handleEventInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleEventSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  error: string;
  showEventCalendar: boolean;
  setShowEventCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEventDate: Date;
  eventCalendarRef: React.RefObject<HTMLDivElement | null>;
  formatDate: (date: Date) => string;
  formRef: React.RefObject<HTMLFormElement | null>;
}

// Types d'événements et leurs labels
const eventTypeLabels: Record<string, string> = {
  'birthday': 'Anniversaire',
  'wedding': 'Mariage',
  'christening': 'Baptême',
  'communion': 'Communion',
  'corporate': 'Événement d\'entreprise',
  'other': 'Autre événement',
};

export default function EventForm({
  eventFormData,
  handleEventInputChange,
  handleEventSubmit,
  isSubmitting,
  error,
  showEventCalendar,
  setShowEventCalendar,
  selectedEventDate,
  eventCalendarRef,
  formatDate,
  formRef
}: EventFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const Toast = ({ message, type, onClose }: ToastProps) => (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`}>
      {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
      <p>{message}</p>
      <button onClick={onClose} className="ml-4">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
  
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleDateSelect = (date: Date) => {
    const event = {
      target: {
        name: 'eventDate',
        value: date.toISOString().split('T')[0]
      }
    } as React.ChangeEvent<HTMLInputElement>;

    handleEventInputChange(event);
    setShowEventCalendar(false);
  };
  
  return (
    <div className="mb-8 space-y-8">
      {/* Sélecteurs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type d'événement */}
        <div>
          <p className="text-sm text-gray-400 mb-2">Type d'événement</p>
          <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#C4B5A2]/20">
            <select
              name="eventType"
              value={eventFormData.eventType}
              onChange={handleEventInputChange}
              className="w-full bg-transparent text-xl font-medium focus:outline-none"
            >
              <option value="" className="bg-[#1A1A1A]">Sélectionnez un type</option>
              {Object.entries(eventTypeLabels).map(([value, label]) => (
                <option key={value} value={value} className="bg-[#1A1A1A]">{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Nombre d'invités */}
        <div>
          <p className="text-sm text-gray-400 mb-2">Nombre d'invités</p>
          <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#C4B5A2]/20">
            <input
              type="number"
              name="guestCount"
              value={eventFormData.guestCount}
              onChange={handleEventInputChange}
              min="1"
              max="120"
              className="w-full bg-transparent text-xl font-medium focus:outline-none"
              placeholder="Nombre d'invités"
            />
          </div>
        </div>

        {/* Date souhaitée */}
        <div className="relative" ref={eventCalendarRef}>
          <p className="text-sm text-gray-400 mb-2">Date souhaitée</p>
          <div 
            className="bg-[#2a2a2a] rounded-lg p-4 border border-[#C4B5A2]/20 cursor-pointer hover:border-[#C4B5A2]/40 transition-colors"
            onClick={() => setShowEventCalendar(!showEventCalendar)}
          >
            <div className="flex justify-between items-center">
              <span className="text-xl font-medium">
                {eventFormData.eventDate ? formatDate(new Date(eventFormData.eventDate)) : "Sélectionner une date"}
              </span>
              <Calendar className="w-5 h-5 text-[#C4B5A2]" />
            </div>
          </div>
          
          {showEventCalendar && (
            <div className="absolute z-20 mt-2 right-0">
              <SimpleCalendar 
                selectedDate={eventFormData.eventDate ? new Date(eventFormData.eventDate) : null}
                onChange={handleDateSelect}
              />
            </div>
          )}
        </div>
      </div>

      {/* Formulaire de contact */}
      <form ref={formRef} onSubmit={handleEventSubmit} className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border border-[#C4B5A2]/20 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <Users className="w-5 h-5" />
              Nom complet
            </label>
            <input
              type="text"
              name="customerName"
              required
              value={eventFormData.customerName}
              onChange={handleEventInputChange}
              className="w-full px-4 py-3 bg-[#1A1A1A] rounded-lg border border-[#C4B5A2]/30 focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white"
              placeholder="Votre nom complet"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <Mail className="w-5 h-5" />
              Email
            </label>
            <input
              type="email"
              name="customerEmail"
              required
              value={eventFormData.customerEmail}
              onChange={handleEventInputChange}
              className="w-full px-4 py-3 bg-[#1A1A1A] rounded-lg border border-[#C4B5A2]/30 focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <Phone className="w-5 h-5" />
              Téléphone
            </label>
            <input
              type="tel"
              name="customerPhone"
              required
              value={eventFormData.customerPhone}
              onChange={handleEventInputChange}
              className="w-full px-4 py-3 bg-[#1A1A1A] rounded-lg border border-[#C4B5A2]/30 focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white"
              placeholder="06 XX XX XX XX"
              pattern="[0-9\s]*"
              maxLength={14}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-300 mb-2">
            <MessageSquare className="w-5 h-5" />
            Détails et demandes particulières
          </label>
          <textarea
            name="specialRequests"
            value={eventFormData.specialRequests}
            onChange={handleEventInputChange}
            className="w-full px-4 py-3 bg-[#1A1A1A] rounded-lg border border-[#C4B5A2]/30 focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white h-32 resize-none"
            placeholder="Précisez vos besoins spécifiques, vos attentes ou toute autre information utile..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 bg-[#C4B5A2] text-black font-medium px-6 py-3 rounded-lg hover:bg-[#a39482] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
        </button>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
      </form>
    </div>
  );
} 