"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Users, MessageSquare, Phone, Mail, MapPin, CheckCircle, ChevronLeft, ChevronRight, Gift, Cake, Heart, Bookmark, CakeSlice } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import { useAuth } from '@/contexts/AuthContext';
import Notifications from '@/components/Notifications';

// Composants
import GuestSelector from '@/components/reserver/GuestSelector';
import ReservationCalendar from '@/components/reserver/ReservationCalendar';
import SimpleCalendar from '@/components/reserver/SimpleCalendar';
import TimeSlots from '@/components/reserver/TimeSlots';
import ReservationForm from '@/components/reserver/ReservationForm';
import LocationMap from '@/components/reserver/LocationMap';
import ReservationConfirmation from '@/components/reserver/ReservationConfirmation';
import EventPresentation from '@/components/reserver/EventReservation/EventPresentation';
import EventForm from '@/components/reserver/EventReservation/EventForm';
import EventConfirmation from '@/components/reserver/EventReservation/EventConfirmation';

interface ReservationData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfGuests: number;
  reservationDateTime: string;
  specialRequests: string;
  userId?: number;
  createdAt: string;
}

export default function ReservationPage() {
  const { user, isAuthenticated } = useAuth();
  // Date actuelle pour le calendrier
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);
  const guestsRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const eventCalendarRef = useRef<HTMLDivElement>(null);

  // Forcer le refresh des créneaux horaires quand la date change
  const [timeSlotRefreshKey, setTimeSlotRefreshKey] = useState(0);

  const [formData, setFormData] = useState({
    date: today.toISOString().split('T')[0],
    time: '',
    guests: '2',
    specialRequests: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherGuests, setShowOtherGuests] = useState(false);
  const [showManualGuests, setShowManualGuests] = useState(false);
  const [activeTab, setActiveTab] = useState('reservation'); // 'reservation' or 'event'
  const [showEventConfirmation, setShowEventConfirmation] = useState(false);
  const [showEventCalendar, setShowEventCalendar] = useState(false);
  const [selectedEventDate, setSelectedEventDate] = useState(today);
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);
  const [errorEvent, setErrorEvent] = useState('');
  const [eventFormData, setEventFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    eventType: '',
    eventDate: '',
    guestCount: '2',
    specialRequests: ''
  });

  const eventFormRef = useRef<HTMLFormElement>(null);
  
  // Regex pour la validation
  const phoneRegex = /^(04|06|07)(\s\d{2}){4}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Créneaux horaires possibles
  const lunchSlots = ['12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30'];
  const dinnerSlots = ['19:00','19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30'];

  // Configuration du calendrier
  useEffect(() => {
    // Met à jour les créneaux horaires disponibles en fonction du jour sélectionné
    // Cette logique peut être adaptée selon vos besoins
  }, [selectedDate]);

  // Gestionnaire de clic extérieur pour fermer les sélecteurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (guestsRef.current && !guestsRef.current.contains(event.target as Node)) {
        setShowOtherGuests(false);
        setShowManualGuests(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
      if (eventCalendarRef.current && !eventCalendarRef.current.contains(event.target as Node)) {
        setShowEventCalendar(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date: Date) => {
    return `${date.getDate()} ${date.toLocaleString('fr-FR', { month: 'long' })} ${date.getFullYear()}`;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (date: Date) => {
    
    // Créer une copie de la date à midi pour éviter les problèmes de fuseau horaire
    const dateOnly = new Date(date);
    dateOnly.setHours(12, 0, 0, 0);
    
    // Formatage cohérent de la date pour le formulaire (YYYY-MM-DD)
    const formattedDate = dateOnly.toISOString().split('T')[0];
    
    // Réinitialiser l'heure sélectionnée quand on change de date
    setFormData({
      ...formData,
      date: formattedDate,
      time: ''  // Réinitialiser l'heure
    });
    setSelectedDate(dateOnly);
    
    // Forcer le rafraîchissement des créneaux horaires
    setTimeSlotRefreshKey(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validation du nombre de personnes
    const numGuests = parseInt(formData.guests);
    if (numGuests > 20) {
      setError('Pour les groupes de plus de 20 personnes, veuillez nous contacter directement au 04 78 49 02 39');
      setIsSubmitting(false);
      return;
    }

    // Validation du numéro de téléphone avec les espaces
    if (!phoneRegex.test(formData.customerPhone)) {
      setError('Le numéro de téléphone doit être au format 06 XX XX XX XX');
      setIsSubmitting(false);
      return;
    }

    try {
      // Format attendu par le backend
      const reservationData: ReservationData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        numberOfGuests: numGuests,
        reservationDateTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
        specialRequests: formData.specialRequests || "",
        createdAt: new Date().toISOString(),
      };

      // Si l'utilisateur est connecté, associer la réservation à son compte
      if (isAuthenticated && user) {
        reservationData.userId = user.id;
      }

      // Ajouter une note pour les grands groupes
      if (numGuests >= 8) {
        reservationData.specialRequests = reservationData.specialRequests 
          ? `${reservationData.specialRequests}\n[Réservation groupe: ${numGuests} personnes]` 
          : `[Réservation groupe: ${numGuests} personnes]`;
      }

      const response = await fetch('http://localhost:3001/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isAuthenticated ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la réservation');
      }

      const data = await response.json();
      setShowConfirmation(true);
    } catch (err) {
      setError('Une erreur est survenue lors de la réservation. Veuillez réessayer.');
      console.error('Erreur:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'customerPhone') {
      // Formatage du numéro de téléphone pendant la saisie
      const cleaned = value.replace(/\D/g, ''); // Garde uniquement les chiffres
      let formatted = cleaned;
      
      // Format XX XX XX XX XX
      if (cleaned.length >= 2) {
        const parts = [];
        for (let i = 0; i < cleaned.length && i < 10; i += 2) {
          parts.push(cleaned.slice(i, i + 2));
        }
        formatted = parts.join(' ');
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLaunchNavigation = () => {
    window.open('https://maps.google.com?q=Chemin+du+Pontet+69150+Décines-Charpieu', '_blank');
  };

  const timeSlotButtons = (slots: string[]) => {
    return slots.map(time => (
      <button
        key={time}
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, time }))}
        className={`py-3 px-4 rounded-lg text-center transition-colors ${
          formData.time === time
            ? 'bg-[#C4B5A2] text-black font-medium'
            : 'bg-[#1A1A1A] hover:bg-[#2a2a2a] text-white border border-[#C4B5A2]/30'
        }`}
      >
        {time}
      </button>
    ));
  };

  const renderCalendar = () => {
    const days = daysInMonth(currentMonth, currentYear);
    const firstDay = firstDayOfMonth(currentMonth, currentYear);
    
    // Ajustement pour commencer par lundi (1) au lieu de dimanche (0)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    const calendarDays = [];
    
    // Ajouter les jours du mois précédent
    for (let i = 0; i < adjustedFirstDay; i++) {
      calendarDays.push(<div key={`prev-${i}`} className="py-3 px-2 text-center opacity-20"></div>);
    }
    
    // Jours du mois en cours
    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0);
    
    for (let i = 1; i <= days; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isSelected = selectedDate && 
                         date.getDate() === selectedDate.getDate() && 
                         date.getMonth() === selectedDate.getMonth() && 
                         date.getFullYear() === selectedDate.getFullYear();
      const isPast = date < minDate;
      
      calendarDays.push(
        <button
          key={i}
          type="button"
          disabled={isPast}
          onClick={() => !isPast && handleDateSelect(date)}
          className={`py-3 px-2 text-center rounded-lg transition-colors ${
            isSelected 
              ? 'bg-[#C4B5A2] text-black font-medium' 
              : isPast 
                ? 'opacity-20 cursor-not-allowed' 
                : 'hover:bg-[#2a2a2a]'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return calendarDays;
  };

  const handleEventSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setIsSubmittingEvent(true);
    setErrorEvent('');
    
    try {
      // Validation manuelle du formulaire
      if (!phoneRegex.test(eventFormData.customerPhone)) {
        toast.error('Veuillez entrer un numéro de téléphone valide (format: 06 12 34 56 78)');
        setIsSubmittingEvent(false);
        return;
      }

      if (!emailRegex.test(eventFormData.customerEmail)) {
        toast.error('Veuillez entrer une adresse email valide');
        setIsSubmittingEvent(false);
        return;
      }
      
      // Formatage de la date pour le client
      let formattedEventDate = 'Date non spécifiée';
      if (eventFormData.eventDate) {
        const eventDate = new Date(eventFormData.eventDate);
        formattedEventDate = eventDate.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
  
      // Utiliser Notifications.notify avec toutes les informations
      await Notifications.notify({
        type: 'event',
        data: {
          customerName: eventFormData.customerName,
          customerEmail: eventFormData.customerEmail,
          customerPhone: eventFormData.customerPhone,
          eventType: eventFormData.eventType,
          eventDate: eventFormData.eventDate,
          formattedEventDate: formattedEventDate,
          guestCount: eventFormData.guestCount,
          numberOfGuests: eventFormData.guestCount,
          specialRequests: eventFormData.specialRequests || 'Aucune',
          subject: `Nouvelle demande d'événement - ${eventFormData.eventType}`
        },
        sendSMS: false,
        sendEmail: true
      });
      
      // Réinitialiser le formulaire
      setEventFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        eventType: '',
        eventDate: '',
        guestCount: '2',
        specialRequests: ''
      });
      toast.success('Votre demande a été envoyée avec succès !');
      // Utiliser une nouvelle date au lieu de null
      setSelectedEventDate(new Date());
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      toast.error('Une erreur est survenue lors de l\'envoi du formulaire.');
      setErrorEvent('Une erreur est survenue lors de l\'envoi du formulaire.');
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'customerPhone') {
      // Formatage du numéro de téléphone pendant la saisie
      const cleaned = value.replace(/\D/g, ''); // Garde uniquement les chiffres
      let formatted = cleaned;
      
      // Format XX XX XX XX XX
      if (cleaned.length >= 2) {
        const parts = [];
        for (let i = 0; i < cleaned.length && i < 10; i += 2) {
          parts.push(cleaned.slice(i, i + 2));
        }
        formatted = parts.join(' ');
      }
      
      setEventFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else {
      setEventFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Composants pour les icônes des types d'événements
  const eventTypeIcons = {
    'birthday': <Cake className="w-6 h-6" />,
    'wedding': <Heart className="w-6 h-6" />,
    'christening': <Gift className="w-6 h-6" />,
    'communion': <Bookmark className="w-6 h-6" />,
    'corporate': <Users className="w-6 h-6" />,
    'other': <CakeSlice className="w-6 h-6" />,
  };

  const renderEventTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'birthday': 'Anniversaire',
      'wedding': 'Mariage',
      'christening': 'Baptême',
      'communion': 'Communion',
      'corporate': 'Événement d\'entreprise',
      'other': 'Autre événement',
    };
    return labels[type] || type;
  };

  const selectEventDate = (day: number) => {
    // Créer une date pour le jour sélectionné
    const newDate = new Date(currentYear, currentMonth, day);
    
    // S'assurer que l'heure est à 0 pour éviter les problèmes de fuseau horaire
    newDate.setHours(0, 0, 0, 0);
    
    // Format YYYY-MM-DD pour le formulaire
    const formattedDate = newDate.toISOString().split('T')[0];
    
    setSelectedEventDate(newDate);
    setEventFormData({
      ...eventFormData,
      eventDate: formattedDate
    });
    setShowEventCalendar(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#141414] text-white relative">
      {/* Background de base sombre */}
      <div className="fixed inset-0 bg-black/40" />

      {/* Contenu principal */}
      <main className="flex-grow relative">
        <div className="relative h-full">
          {/* Conteneur des feuilles et du contenu central */}
          <div className="absolute inset-0 flex">
            {/* Feuilles gauches avec une zone de transition */}
            <div className="w-[400px] relative">
              <Image
                src="/decorations/leavesleft.webp"
                alt="Décoration gauche"
                fill
                className="object-cover opacity-20"
                priority
              />
              {/* Dégradé de transition */}
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#141414]" />
            </div>

            {/* Zone centrale avec background très sombre */}
            <div className="flex-grow bg-[#141414]">
              <div className="max-w-6xl mx-auto px-8" />
            </div>

            {/* Feuilles droites avec une zone de transition */}
            <div className="w-[400px] relative">
              <Image
                src="/decorations/leavesright.webp"
                alt="Décoration droite"
                fill
                className="object-cover opacity-20"
                priority
              />
              {/* Dégradé de transition */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-l from-transparent to-[#141414]" />
            </div>
          </div>

          {/* Zone de contenu superposée */}
          <div className="relative max-w-6xl mt-40 mx-auto px-8 py-8">
            {/* Image stylisée du restaurant en haut */}
            <div className="relative w-full h-[300px] mb-8 rounded-xl overflow-hidden">
              <Image
                src="/restaurant-interior.jpg"
                alt="Restaurant Au Tiki"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-7xl font-didot">Tiki Au Bord de l'Eau</h1>
                <p className="text-xl text-gray-200">Découvrez notre expérience</p>
              </div>
            </div>

            {/* Onglets de navigation */}
            <div className="flex mb-8 justify-center">
              <div className="inline-flex rounded-lg overflow-hidden">
                <button
                  className={`px-8 py-3 text-lg font-medium ${
                    activeTab === 'reservation'
                      ? 'bg-[#C4B5A2] text-black'
                      : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                  }`}
                  onClick={() => setActiveTab('reservation')}
                >
                  Réservation
                </button>
                <button
                  className={`px-8 py-3 text-lg font-medium ${
                    activeTab === 'event'
                      ? 'bg-[#C4B5A2] text-black'
                      : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                  }`}
                  onClick={() => setActiveTab('event')}
                >
                  Événement spécial
                </button>
              </div>
            </div>

            {activeTab === 'reservation' ? (
              <>
                {/* En-tête */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-didot-bold mb-4">Réservez dès maintenant</h1>
                  <div className="w-24 h-1 bg-[#C4B5A2] mx-auto mb-4"></div>
                  <p className="text-gray-300">Les réservations ouvrent 30 jours à l'avance</p>
                </div>

                {/* Sélecteurs de réservation dans le style de l'image */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Composant Sélecteur de personnes */}
                  <GuestSelector 
                    guests={formData.guests}
                    setFormData={setFormData}
                    showOtherGuests={showOtherGuests}
                    setShowOtherGuests={setShowOtherGuests}
                    showManualGuests={showManualGuests}
                    setShowManualGuests={setShowManualGuests}
                    setShowCalendar={setShowCalendar}
                    guestsRef={guestsRef}
                  />

                  {/* Affichage du sélecteur d'heure (sans les options) */}
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Heure</p>
                    <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#C4B5A2]/20">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-medium">
                          {formData.time ? formData.time : "Tous les horaires"}
                        </span>
                        <Clock className="w-5 h-5 text-[#C4B5A2]" />
                      </div>
                    </div>
                  </div>

                  {/* Nouveau composant de calendrier simple */}
                  <div className="relative" ref={calendarRef}>
                    <p className="text-sm text-gray-400 mb-2">Date</p>
                    <div 
                      className="bg-[#2a2a2a] rounded-lg p-4 border border-[#C4B5A2]/20 cursor-pointer hover:border-[#C4B5A2]/40 transition-colors"
                      onClick={() => setShowCalendar(!showCalendar)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-medium">
                          {selectedDate ? selectedDate.toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'}) : "Sélectionner une date"}
                        </span>
                        <Calendar className="w-5 h-5 text-[#C4B5A2]" />
                      </div>
                    </div>
                    
                    {/* Affichage du calendrier simple en dropdown */}
                    {showCalendar && (
                      <div className="absolute z-20 mt-2 right-0">
                        <SimpleCalendar 
                          selectedDate={selectedDate} 
                          onChange={(date: Date) => {
                            handleDateSelect(date);
                            setShowCalendar(false);
                          }} 
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Affichage des créneaux horaires */}
                {formData.date && (
                  <TimeSlots
                    key={`timeslots-${timeSlotRefreshKey}-${formData.date}`}
                    date={formData.date}
                    time={formData.time}
                    setFormData={setFormData}
                  />
                )}

                {/* Formulaire de contact si un créneau est sélectionné */}
                {formData.time && (
                  <ReservationForm 
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    error={error}
                  />
                )}

                {/* Composant Carte */}
                <LocationMap />
              </>
            ) : (
              <>
                {/* En-tête pour les événements spéciaux */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold mb-4">Organisez votre événement</h1>
                  <div className="w-24 h-1 bg-[#C4B5A2] mx-auto mb-4"></div>
                  <p className="text-gray-300">Anniversaires, mariages, baptêmes et autres célébrations</p>
                </div>

                {/* Présentation des événements */}
                <EventPresentation />

                {/* Formulaire d'événement */}
                <EventForm 
                  eventFormData={eventFormData}
                  handleEventInputChange={handleEventInputChange}
                  handleEventSubmit={handleEventSubmit}
                  isSubmitting={isSubmittingEvent}
                  error={errorEvent}
                  showEventCalendar={showEventCalendar}
                  setShowEventCalendar={setShowEventCalendar}
                  selectedEventDate={selectedEventDate}
                  eventCalendarRef={eventCalendarRef}
                  formatDate={formatDate}
                  formRef={eventFormRef}
                />

                {/* Calendrier d'événement (affiché dans une modale) */}
                {showEventCalendar && (
                  <div className="absolute mt-2 right-0 z-50">
                    <SimpleCalendar 
                      selectedDate={selectedEventDate} 
                      onChange={(date: Date) => {
                        // Mettre à jour à la fois l'état de date et le formulaire
                        setSelectedEventDate(date);
                        const formattedDate = date.toISOString().split('T')[0];
                        setEventFormData(prev => ({
                          ...prev,
                          eventDate: formattedDate
                        }));
                        setShowEventCalendar(false);
                      }} 
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modales de confirmation */}
      <ReservationConfirmation 
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        formData={formData}
      />

      <EventConfirmation
        showEventConfirmation={showEventConfirmation}
        setShowEventConfirmation={setShowEventConfirmation}
        eventFormData={eventFormData}
      />
    </div>
  );
}