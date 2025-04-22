"use client"

import React, { useState, useEffect } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { toast } from 'react-hot-toast';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import ReservationList from '@/components/calendar/ReservationList';
import ReservationForm from '@/components/calendar/ReservationForm';
import ExportPhoneButton from '@/components/calendar/ExportPhoneButton';
import { Reservation, ReservationFormData, TimeSlot } from '@/types/reservation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedReservations, setSelectedReservations] = useState<Reservation[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newReservation, setNewReservation] = useState<ReservationFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    numberOfGuests: 2,
    time: '',
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

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

      if (selectedDate) {
        updateSelectedReservations(selectedDate);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const updateSelectedReservations = (date: Date) => {
    setSelectedDate(date);
    const dayReservations = reservations.filter(res => {
      const resDate = new Date(res.reservationDateTime);
      return resDate.toDateString() === date.toDateString();
    });
    setSelectedReservations(dayReservations);
  };

  const deleteReservation = async (reservationId: number) => {
    
    // Éviter les déclenchements accidentels ou multiples
    if (isDeleting) {
      return;
    }
    
    // La confirmation est maintenant gérée par le composant ReservationList
    try {
      setIsDeleting(true);
      
      // Obtenir le token d'authentification
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error("❌ Aucun token d'authentification trouvé");
        toast.error('Vous devez être connecté pour supprimer une réservation');
        setIsDeleting(false);
        return;
      }
      
      // Utiliser directement l'API backend
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/reservations/${reservationId}`;
      
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      
      // Gérer les réponses d'erreur
      if (!response.ok) {
        console.error("❌ Erreur HTTP:", response.status);
        let errorMsg = `Erreur ${response.status} lors de la suppression`;
        
        try {
          const data = await response.json();
          console.error("📄 Détails de l'erreur:", data);
          errorMsg = data.message || errorMsg;
        } catch (e) {
          console.error("❌ Pas de détails JSON dans la réponse d'erreur");
        }
        
        throw new Error(errorMsg);
      }
      
      
      // Mettre à jour l'interface
      setReservations(prevReservations => 
        prevReservations.filter(res => res.id !== reservationId)
      );
      
      setSelectedReservations(prevSelectedReservations => 
        prevSelectedReservations.filter(res => res.id !== reservationId)
      );
      
      toast.success('Réservation supprimée avec succès');
      
    } catch (error) {
      console.error("❌ Erreur lors de la suppression:", error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Impossible de supprimer la réservation'}`);
    } finally {;
      setIsDeleting(false);
    }
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReservation(prev => ({
      ...prev,
      [name]: name === 'numberOfGuests' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      setSubmitMessage({ type: 'error', text: 'Veuillez sélectionner une date' });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    
    const [hours, minutes] = newReservation.time.split(':');
    const reservationDate = new Date(selectedDate);
    reservationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    try {
      if (!editingReservation) {
        const response = await fetch(`${API_URL}/reservations/available-slots?date=${selectedDate.toISOString().split('T')[0]}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la vérification des créneaux disponibles');
        }
        
        const availableSlots = await response.json();
        const timeHour = parseInt(hours);
        const isLunch = timeHour < 15;
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
      
      const reservationData = {
        customerName: newReservation.customerName,
        customerEmail: newReservation.customerEmail || 'reservation@telephone.com',
        customerPhone: newReservation.customerPhone,
        numberOfGuests: newReservation.numberOfGuests,
        reservationDateTime: reservationDate.toISOString(),
        specialRequests: newReservation.specialRequests
      };
      
      let result: Reservation;
      
      if (editingReservation) {
        const updateResponse = await fetch(`${API_URL}/reservations/${editingReservation.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reservationData)
        });
        
        if (!updateResponse.ok) {
          throw new Error('Erreur lors de la mise à jour de la réservation');
        }
        
        result = await updateResponse.json();
        setReservations(prev => prev.map(res => res.id === editingReservation.id ? result : res));
        setSelectedReservations(prev => prev.map(res => res.id === editingReservation.id ? result : res));
        setSubmitMessage({ type: 'success', text: 'Réservation mise à jour avec succès' });
      } else {
        const createResponse = await fetch(`${API_URL}/reservations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...reservationData, createdAt: new Date().toISOString() })
        });
        
        if (!createResponse.ok) {
          throw new Error('Erreur lors de la création de la réservation');
        }
        
        result = await createResponse.json();
        setReservations(prev => [...prev, result]);
        setSelectedReservations(prev => [...prev, result]);
        setSubmitMessage({ type: 'success', text: 'Réservation ajoutée avec succès' });
      }
      
      setNewReservation({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        numberOfGuests: 2,
        time: '',
        specialRequests: ''
      });
      
      setEditingReservation(null);
      
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
      <div className="container mt-40 mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Calendrier des réservations</h1>
          <ExportPhoneButton reservations={reservations} />
        </div>
        
        <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30 mb-8">
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
          />
          
          <CalendarGrid
            currentDate={currentDate}
            selectedDate={selectedDate}
            reservations={reservations}
            onSelectDate={updateSelectedReservations}
          />
        </div>
        
        {selectedDate && (
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#C4B5A2]">
                Réservations du {selectedDate.toLocaleDateString('fr-FR', { dateStyle: 'long' })}
              </h3>
              
              <div className="flex gap-3">
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
            </div>

            {showAddForm && (
              <ReservationForm
                formData={newReservation}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitMessage={submitMessage}
                selectedDate={selectedDate}
                isEditing={!!editingReservation}
              />
            )}

            <ReservationList
              reservations={selectedReservations}
              onEdit={startEditReservation}
              onDelete={deleteReservation}
              isDeleting={isDeleting}
            />
          </div>
        )}
      </div>
    </div>
  );
}