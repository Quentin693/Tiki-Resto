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
  const [localEventFormData, setLocalEventFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    specialRequests: "",
  });

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
  
  const handleEventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Vérifier que les données sont complètes
    if (!eventFormData.customerName || !eventFormData.customerEmail || !eventFormData.customerPhone) {
      showToast("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    console.log("Envoi du formulaire avec les données :", eventFormData);
    console.log("Template ID: template_xb59ysa");
    console.log("FormRef:", formRef.current);
  
    emailjs
      .sendForm(
        "service_w43hhbe",
        "template_xb59ysa", // Utiliser le template du formulaire de contact
        formRef.current as HTMLFormElement,
        "qGukIkoXy-BXaqm2L"
      )
      .then(
        (result) => {
          console.log("Email envoyé avec succès!", result.text);
          showToast("Message envoyé avec succès !", "success");
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 3000);
          setLocalEventFormData({
            customerName: "", 
            customerEmail: "",
            customerPhone: "",
            eventType: "",
            eventDate: "",
            guestCount: "",
            specialRequests: "",
          });
        },
        (error) => {
          console.error("Erreur d'envoi:", error);
          showToast("Une erreur s'est produite. Veuillez réessayer.", "error");
          console.error("Error:", error);
        }
      );
  };
  
  const handleDateSelect = (date: Date) => {
    // Aucun besoin de simuler un événement car nous utilisons directement 
    // le onChange du composant SimpleCalendar qui mettra à jour le parent
    setShowEventCalendar(false);
  };
  
  return (
    <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border border-[#C4B5A2]/20 shadow-xl mb-12">
      <h2 className="text-2xl font-bold mb-6">Envoyez votre demande</h2>
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <form ref={formRef} onSubmit={handleEventSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <CakeSlice className="w-5 h-5" />
              Type d'événement
            </label>
            <select
              name="eventType"
              required
              value={eventFormData.eventType}
              onChange={handleEventInputChange}
              className="w-full px-4 py-3 bg-[#1A1A1A] rounded-lg border border-[#C4B5A2]/30 focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white"
            >
              <option value="">Sélectionnez un type d'événement</option>
              {Object.entries(eventTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <Calendar className="w-5 h-5" />
              Date souhaitée
            </label>
            <div 
              className="w-full px-4 py-3 bg-[#1A1A1A] rounded-lg border border-[#C4B5A2]/30 flex justify-between items-center cursor-pointer hover:border-[#C4B5A2]/50 transition-colors"
              onClick={() => setShowEventCalendar(!showEventCalendar)}
              ref={eventCalendarRef}
            >
              <span className="text-white">
                {selectedEventDate ? formatDate(selectedEventDate) : "Sélectionner une date"}
              </span>
              <Calendar className="w-5 h-5 text-[#C4B5A2]" />
            </div>
            
            {/* Affichage du SimpleCalendar en position absolue */}
            {showEventCalendar && (
              <div className="absolute top-full left-0 mt-2 z-50">
                <SimpleCalendar 
                  selectedDate={selectedEventDate} 
                  onChange={handleDateSelect} 
                />
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <Users className="w-5 h-5" />
              Nombre d'invités
            </label>
            <input
              type="number"
              name="guestCount"
              required
              min="1"
              max="120"
              value={eventFormData.guestCount}
              onChange={handleEventInputChange}
              className="w-full px-4 py-3 bg-[#1A1A1A] rounded-lg border border-[#C4B5A2]/30 focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white"
              placeholder="Nombre d'invités"
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

        {/* Champs pour EmailJS - Utiliser les noms de champs du template EmailJS */}
        <input type="hidden" name="from_name" value={eventFormData.customerName} />
        <input type="hidden" name="reply_to" value={eventFormData.customerEmail} />
        <input type="hidden" name="phone" value={eventFormData.customerPhone} />
        <input type="hidden" name="message" value={`
Bonjour,

Je suis ${eventFormData.customerName} et je souhaite organiser un événement dans votre établissement.

Voici les détails de ma demande :
- Type d'événement : ${eventTypeLabels[eventFormData.eventType] || eventFormData.eventType}
- Date souhaitée : ${selectedEventDate ? formatDate(selectedEventDate) : ""}
- Nombre d'invités : ${eventFormData.guestCount} personnes

Demandes spéciales :
${eventFormData.specialRequests || "Aucune demande spéciale"}

Vous pouvez me contacter aux coordonnées suivantes :
- Email : ${eventFormData.customerEmail}
- Téléphone : ${eventFormData.customerPhone}

Merci de votre attention. J'attends votre réponse avec impatience.

Cordialement,
${eventFormData.customerName}
        `} />

        <button
          type="submit"
          disabled={isSubmitting || submitted}
          className="w-full bg-[#C4B5A2] text-black font-medium px-6 py-3 rounded-lg hover:bg-[#a39482] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitted ? (
            <>
              <CheckCircle className="w-5 h-5 inline mr-2" />
              Envoyé
            </>
          ) : isSubmitting ? (
            'Envoi en cours...'
          ) : (
            'Envoyer ma demande'
          )}
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