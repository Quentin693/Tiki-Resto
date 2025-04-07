"use client"

import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, getDay, getDaysInMonth, startOfMonth, endOfMonth, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, Users, Trash2 } from 'lucide-react';
import TimeSlots from '@/components/reserver/TimeSlots';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface TimeSlot {
  time: string;
  available: boolean;
  remainingCapacity: number;
}

interface Reservation {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfGuests: number;
  reservationDateTime: string;
  specialRequests?: string;
  createdAt?: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedReservations, setSelectedReservations] = useState<Reservation[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newReservation, setNewReservation] = useState<{
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    numberOfGuests: number;
    time: string;
    specialRequests: string;
  }>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    numberOfGuests: 2,
    time: '',
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  // Charger les réservations au chargement et à chaque changement de mois
  useEffect(() => {
    fetchReservations();
  }, [currentDate]);

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${API_URL}/reservations`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des réservations');
      }
      const data = await response.json();
      setReservations(data);

      // Si une date est déjà sélectionnée, mettre à jour ses réservations
      if (selectedDate) {
        updateSelectedReservations(selectedDate);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const updateSelectedReservations = (date: Date) => {
    setSelectedDate(date);
    
    // Filtrer les réservations pour cette date
    const dayReservations = reservations.filter(res => {
      const resDate = new Date(res.reservationDateTime);
      return isSameDay(resDate, date);
    });
    
    setSelectedReservations(dayReservations);
  };

  // Fonction pour supprimer une réservation
  const deleteReservation = async (reservationId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la réservation');
      }
      
      // Mettre à jour les listes de réservations
      setReservations(prevReservations => 
        prevReservations.filter(res => res.id !== reservationId)
      );
      
      setSelectedReservations(prevSelectedReservations => 
        prevSelectedReservations.filter(res => res.id !== reservationId)
      );
      
      toast.success('Réservation supprimée avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'lors de la suppression'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Tableau des noms de jours en français
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = monthStart;
    const endDate = monthEnd;

    const daysInMonth = getDaysInMonth(currentDate);
    const startDay = getDay(startOfMonth(currentDate)) || 7; // Convertir 0 (dimanche) en 7 pour le calendrier français
    
    const days = [];
    
    // Ajouter des jours vides pour aligner avec le bon jour de la semaine
    for (let i = 1; i < startDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 bg-[#2a2a2a]/50 border border-[#3a3a3a]" />
      );
    }

    // Date actuelle pour désactiver les jours passés
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ajouter les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      
      // Vérifier si cette date est sélectionnée
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      
      // Vérifier si cette date est dans le passé
      const isPast = date < today;
      
      // Trouver les réservations pour ce jour
      const dayReservations = reservations.filter(res => {
        const resDate = new Date(res.reservationDateTime);
        return isSameDay(resDate, date);
      });

      days.push(
        <div
          key={day}
          onClick={() => !isPast && updateSelectedReservations(date)}
          className={`h-24 bg-[#2a2a2a] border border-[#3a3a3a] p-2 transition-colors
            ${isSelected ? 'ring-2 ring-[#C4B5A2]' : 'hover:bg-[#3a3a3a]'}
            ${isPast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium">{day}</span>
            {dayReservations.length > 0 && (
              <span className="text-xs px-2 py-1 rounded-full bg-[#C4B5A2] text-black">
                {dayReservations.reduce((sum, res) => sum + res.numberOfGuests, 0)} pers.
              </span>
            )}
          </div>
          {dayReservations.length > 0 && (
            <div className="mt-2 space-y-1">
              {dayReservations.slice(0, 2).map(reservation => {
                const time = new Date(reservation.reservationDateTime).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                });
                return (
                  <div key={reservation.id} className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{time}</span>
                    <span>•</span>
                    <span>{reservation.numberOfGuests}p</span>
                  </div>
                );
              })}
              {dayReservations.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{dayReservations.length - 2} autres
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  // Fonction pour commencer l'édition d'une réservation
  const startEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    const reservationDate = new Date(reservation.reservationDateTime);
    setNewReservation({
      customerName: reservation.customerName,
      customerEmail: reservation.customerEmail,
      customerPhone: reservation.customerPhone,
      numberOfGuests: reservation.numberOfGuests,
      time: `${reservationDate.getHours().toString().padStart(2, '0')}:${reservationDate.getMinutes().toString().padStart(2, '0')}`,
      specialRequests: reservation.specialRequests || ''
    });
    setShowAddForm(true);
  };

  // Modification de addReservation pour gérer à la fois les ajouts et les modifications
  const addReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      setSubmitMessage({ type: 'error', text: 'Veuillez sélectionner une date' });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    
    // Formatage de la date et l'heure
    const [hours, minutes] = newReservation.time.split(':');
    const reservationDate = new Date(selectedDate);
    reservationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    try {
      // Vérifier la capacité disponible pour ce créneau horaire (seulement pour les nouvelles réservations)
      if (!editingReservation) {
        const response = await fetch(`${API_URL}/reservations/available-slots?date=${selectedDate.toISOString().split('T')[0]}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la vérification des créneaux disponibles');
        }
        
        const availableSlots = await response.json();
        
        // Déterminer si c'est un déjeuner ou un dîner
        const timeHour = parseInt(hours);
        const isLunch = timeHour < 15; // Avant 15h = déjeuner
        
        const slots = isLunch ? availableSlots.lunch : availableSlots.dinner;
        const slot = slots.find((s: TimeSlot) => s.time === newReservation.time);
        
        if (!slot) {
          throw new Error('Créneau horaire non disponible');
        }
        
        if (newReservation.numberOfGuests > slot.remainingCapacity) {
          setSubmitMessage({ 
            type: 'error', 
            text: `Ce créneau ne peut pas accueillir ${newReservation.numberOfGuests} personnes (capacité restante: ${slot.remainingCapacity})`
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      let result: Reservation;
      
      if (editingReservation) {
        // Mise à jour d'une réservation existante
        const reservationToUpdate = {
          customerName: newReservation.customerName,
          customerEmail: newReservation.customerEmail || 'reservation@telephone.com',
          customerPhone: newReservation.customerPhone,
          numberOfGuests: newReservation.numberOfGuests,
          reservationDateTime: reservationDate.toISOString(),
          specialRequests: newReservation.specialRequests
        };
        
        const updateResponse = await fetch(`${API_URL}/reservations/${editingReservation.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reservationToUpdate)
        });
        
        if (!updateResponse.ok) {
          throw new Error('Erreur lors de la mise à jour de la réservation');
        }
        
        result = await updateResponse.json();
        
        // Mettre à jour la liste des réservations
        setReservations(prevReservations => 
          prevReservations.map(res => res.id === editingReservation.id ? result : res)
        );
        
        // Mettre à jour la liste des réservations pour la date sélectionnée
        setSelectedReservations(prevSelectedReservations => 
          prevSelectedReservations.map(res => res.id === editingReservation.id ? result : res)
        );
        
        setSubmitMessage({ type: 'success', text: 'Réservation mise à jour avec succès' });
      } else {
        // Création d'une nouvelle réservation
        const reservationToAdd = {
          customerName: newReservation.customerName,
          customerEmail: newReservation.customerEmail || 'reservation@telephone.com',
          customerPhone: newReservation.customerPhone,
          numberOfGuests: newReservation.numberOfGuests,
          reservationDateTime: reservationDate.toISOString(),
          specialRequests: newReservation.specialRequests,
          createdAt: new Date().toISOString()
        };
        
        const createResponse = await fetch(`${API_URL}/reservations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reservationToAdd)
        });
        
        if (!createResponse.ok) {
          throw new Error('Erreur lors de la création de la réservation');
        }
        
        result = await createResponse.json();
        
        // Mettre à jour la liste des réservations
        setReservations(prevReservations => [...prevReservations, result]);
        
        // Mettre à jour la liste des réservations pour la date sélectionnée
        setSelectedReservations(prevSelectedReservations => [...prevSelectedReservations, result]);
        
        setSubmitMessage({ type: 'success', text: 'Réservation ajoutée avec succès' });
      }
      
      // Réinitialiser le formulaire
      setNewReservation({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        numberOfGuests: 2,
        time: '',
        specialRequests: ''
      });
      
      setEditingReservation(null);
      
      // Fermer le formulaire après 2 secondes
      setTimeout(() => {
        setShowAddForm(false);
        setSubmitMessage({ type: '', text: '' });
      }, 2000);
      
    } catch (error) {
      console.error('Erreur:', error);
      setSubmitMessage({ type: 'error', text: `Erreur: ${error instanceof Error ? error.message : 'lors de l\'opération'}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Calendrier des réservations</h1>
        
        {/* En-tête du calendrier */}
        <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={prevMonth}
              className="p-2 bg-[#1a1a1a] rounded-lg hover:bg-[#3a3a3a]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy', { locale: fr })}
            </h2>
            
            <button 
              onClick={nextMonth}
              className="p-2 bg-[#1a1a1a] rounded-lg hover:bg-[#3a3a3a]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {/* Jours de la semaine */}
            {weekDays.map(day => (
              <div key={day} className="text-center py-2 text-[#C4B5A2] font-medium">
                {day}
              </div>
            ))}
            
            {/* Jours du mois */}
            {renderCalendar()}
          </div>
        </div>
        
        {/* Réservations du jour sélectionné */}
        {selectedDate && (
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                Réservations du {selectedDate.toLocaleDateString('fr-FR', { dateStyle: 'long' })}
              </h3>
              
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setEditingReservation(null);
                  setNewReservation({
                    customerName: '',
                    customerEmail: '',
                    customerPhone: '',
                    numberOfGuests: 2,
                    time: '',
                    specialRequests: ''
                  });
                }}
                className="px-4 py-2 bg-[#C4B5A2] text-black rounded-lg font-medium hover:bg-[#d8c7b2] transition-colors"
              >
                {showAddForm ? 'Annuler' : 'Ajouter une réservation'}
              </button>
            </div>

            {/* Formulaire d'ajout/modification de réservation */}
            {showAddForm && (
              <div className="bg-[#3a3a3a] rounded-lg p-4 mb-6">
                <h4 className="text-lg font-semibold mb-4">
                  {editingReservation ? 'Modifier la réservation' : 'Nouvelle réservation (appel téléphonique)'}
                </h4>
                {submitMessage.text && (
                  <div className={`p-3 mb-4 rounded ${submitMessage.type === 'error' ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}`}>
                    {submitMessage.text}
                  </div>
                )}
                <form onSubmit={addReservation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nom du client*</label>
                    <input
                      type="text"
                      value={newReservation.customerName}
                      onChange={e => setNewReservation({...newReservation, customerName: e.target.value})}
                      className="w-full bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Téléphone*</label>
                    <input
                      type="tel"
                      value={newReservation.customerPhone}
                      onChange={e => setNewReservation({...newReservation, customerPhone: e.target.value})}
                      className="w-full bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email (optionnel)</label>
                    <input
                      type="email"
                      value={newReservation.customerEmail}
                      onChange={e => setNewReservation({...newReservation, customerEmail: e.target.value})}
                      className="w-full bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nombre de personnes*</label>
                    <input
                      type="number"
                      min="1"
                      value={newReservation.numberOfGuests}
                      onChange={e => setNewReservation({...newReservation, numberOfGuests: parseInt(e.target.value)})}
                      className="w-full bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-2"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Créneau horaire*</label>
                    <div className="mt-2">
                      {selectedDate && 
                        <TimeSlots 
                          date={format(selectedDate, 'yyyy-MM-dd')} 
                          time={newReservation.time} 
                          setFormData={(formData) => {
                            console.log("TimeSlot selected:", formData);
                            setNewReservation(prev => ({
                              ...prev,
                              time: formData.time || formData
                            }));
                          }}
                          isAdmin={true}
                        />
                      }
                    </div>
                    {!newReservation.time && (
                      <p className="text-orange-400 text-sm mt-2">Veuillez sélectionner un créneau horaire</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Demandes spéciales</label>
                    <textarea
                      value={newReservation.specialRequests}
                      onChange={e => setNewReservation({...newReservation, specialRequests: e.target.value})}
                      className="w-full bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-2 min-h-[80px]"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || !newReservation.time}
                      className="px-6 py-2 bg-[#C4B5A2] text-black rounded-lg font-medium hover:bg-[#d8c7b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting 
                        ? 'Traitement...' 
                        : editingReservation 
                          ? 'Mettre à jour la réservation' 
                          : 'Créer la réservation'
                      }
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {selectedReservations.length === 0 ? (
                <p className="text-gray-400">Aucune réservation pour cette date</p>
              ) : (
                selectedReservations
                  .sort((a, b) => new Date(a.reservationDateTime).getTime() - new Date(b.reservationDateTime).getTime())
                  .map(reservation => (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between p-4 bg-[#3a3a3a] rounded-lg"
                    >
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                          <span className="font-medium">{reservation.customerName}</span>
                          <span className="text-sm text-gray-400">{reservation.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(reservation.reservationDateTime).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {reservation.numberOfGuests} pers.
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditReservation(reservation)}
                          className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => deleteReservation(reservation.id)}
                          disabled={isDeleting}
                          className="px-3 py-1 rounded bg-red-600 text-white text-sm flex items-center gap-1 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}