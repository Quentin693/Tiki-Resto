"use client"

import React, { useState, useEffect } from 'react';

interface TimeSlot {
  time: string;
  available: boolean;
  remainingCapacity: number;
}

interface TimeSlotsResponse {
  lunch: TimeSlot[];
  dinner: TimeSlot[];
}

interface FormData {
  date?: string;
  time: string;
  guests?: string;
  specialRequests?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  [key: string]: any; // Permettre des propriétés supplémentaires
}

interface TimeSlotsProps {
  date: string;
  time: string;
  setFormData: (formData: any) => void; // Rendre cette fonction plus flexible
  isAdmin?: boolean; // Nouveau prop pour différencier la vue admin de la vue client
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const MAX_CAPACITY = 40; // Capacité maximale par créneau

export default function TimeSlots({ date, time, setFormData, isAdmin = false }: TimeSlotsProps) {
  const [availableSlots, setAvailableSlots] = useState<TimeSlotsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isClosedDay, setIsClosedDay] = useState<{lunch: boolean, dinner: boolean}>({ lunch: false, dinner: false });

  // Vérifier si le restaurant est ouvert à la date sélectionnée
  useEffect(() => {
    if (!date) return;

    const [year, month, day] = date.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const dayOfWeek = selectedDate.getDay(); // 0 = dimanche, 1 = lundi, etc.

    // Déterminer les fermetures:
    // - Lundi (1): fermé toute la journée
    // - Mardi (2): fermé toute la journée
    // - Mercredi (3): fermé toute la journée
    // - Dimanche (0): fermé le soir
    
    const lunchClosed = dayOfWeek === 1;
    const dinnerClosed = dayOfWeek === 0 || dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 3;

    setIsClosedDay({ lunch: lunchClosed, dinner: dinnerClosed });

  }, [date]);

  // Charger les créneaux disponibles lorsque la date change
  useEffect(() => {
    if (!date) return;

    const fetchAvailableSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/reservations/available-slots?date=${date}`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des créneaux disponibles');
        }
        const data = await response.json();
        setAvailableSlots(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les créneaux disponibles');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [date]);

  // Fonction pour déterminer la classe CSS selon la disponibilité
  const getCapacityColorClass = (remainingCapacity: number) => {
    if (remainingCapacity <= 0) return 'text-red-500';
    if (remainingCapacity < 10) return 'text-orange-400';
    if (remainingCapacity < 20) return 'text-yellow-400';
    return 'text-green-500';
  };

  if (!date) return null;
  if (loading) return <div className="text-center py-8">Chargement des créneaux disponibles...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!availableSlots) return null;

  // Formater la date pour l'affichage en prenant soin de la timezone
  const displayDate = (() => {
    // Créer un objet Date à midi pour éviter les problèmes de fuseau horaire
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day, 12, 0, 0, 0);
    
    return dateObj.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  })();

  // Filtrer les créneaux disponibles pour les clients (pas pour admin)
  const getLunchSlots = () => {
    // Si le restaurant est fermé le midi pour ce jour, retourner un tableau vide
    if (isClosedDay.lunch && !isAdmin) {
      return [];
    } else if (isClosedDay.lunch && isAdmin) {
      // Pour admin, on affiche quand même les créneaux mais marqués comme indisponibles
      return availableSlots.lunch.map(slot => ({ ...slot, available: false }));
    }
    
    if (isAdmin) {
      return availableSlots.lunch;
    } else {
      return availableSlots.lunch.filter(slot => slot.available);
    }
  };

  const getDinnerSlots = () => {
    // Si le restaurant est fermé le soir pour ce jour, retourner un tableau vide
    if (isClosedDay.dinner && !isAdmin) {
      return [];
    } else if (isClosedDay.dinner && isAdmin) {
      // Pour admin, on affiche quand même les créneaux mais marqués comme indisponibles
      return availableSlots.dinner.map(slot => ({ ...slot, available: false }));
    }
    
    if (isAdmin) {
      return availableSlots.dinner;
    } else {
      return availableSlots.dinner.filter(slot => slot.available);
    }
  };

  const lunchSlots = getLunchSlots();
  const dinnerSlots = getDinnerSlots();

  return (
    <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border border-[#C4B5A2]/20 shadow-xl mb-8">
      <h2 className="text-2xl font-semibold mb-2">Horaires disponibles</h2>
      <p className="text-gray-400 mb-6">pour le {displayDate}</p>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-3 text-[#C4B5A2]">Déjeuner</h3>
          {lunchSlots.length === 0 ? (
            <p className="text-gray-400">
              {isClosedDay.lunch 
                ? "Le restaurant est fermé le midi ce jour-là" 
                : "Aucun créneau disponible pour le déjeuner"}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {lunchSlots.map(slot => (
                <button
                  key={`lunch-${slot.time}`}
                  type="button"
                  onClick={() => {
                    console.log("Clicked lunch slot:", slot);
                    if ((slot.available || isAdmin) && (!isClosedDay.lunch || isAdmin)) {
                      if (isAdmin) {
                        setFormData(slot.time);
                      } else {
                        setFormData((prev: FormData) => ({ ...prev, time: slot.time }));
                      }
                    }
                  }}
                  disabled={(!slot.available && !isAdmin) || (isClosedDay.lunch && !isAdmin)}
                  className={`py-3 px-4 rounded-lg text-center transition-colors ${
                    time === slot.time
                      ? 'bg-[#C4B5A2] text-black font-medium'
                      : (slot.available && !isClosedDay.lunch) || isAdmin
                        ? 'bg-[#1A1A1A] hover:bg-[#2a2a2a] text-white border border-[#C4B5A2]/30'
                        : 'bg-[#1A1A1A] text-gray-500 cursor-not-allowed opacity-50 border border-[#3a3a3a]'
                  }`}
                >
                  <div>{slot.time}</div>
                  {isAdmin && (
                    <div className={`text-xs ${isClosedDay.lunch ? 'text-red-500' : getCapacityColorClass(slot.remainingCapacity)}`}>
                      {isClosedDay.lunch ? 'FERMÉ' : `${slot.remainingCapacity} / ${MAX_CAPACITY} places`}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3 text-[#C4B5A2]">Dîner</h3>
          {dinnerSlots.length === 0 ? (
            <p className="text-gray-400">
              {isClosedDay.dinner 
                ? "Le restaurant est fermé le soir ce jour-là" 
                : "Aucun créneau disponible pour le dîner"}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {dinnerSlots.map(slot => (
                <button
                  key={`dinner-${slot.time}`}
                  type="button"
                  onClick={() => {
                    console.log("Clicked dinner slot:", slot);
                    if ((slot.available || isAdmin) && (!isClosedDay.dinner || isAdmin)) {
                      if (isAdmin) {
                        setFormData(slot.time);
                      } else {
                        setFormData((prev: FormData) => ({ ...prev, time: slot.time }));
                      }
                    }
                  }}
                  disabled={(!slot.available && !isAdmin) || (isClosedDay.dinner && !isAdmin)}
                  className={`py-3 px-4 rounded-lg text-center transition-colors ${
                    time === slot.time
                      ? 'bg-[#C4B5A2] text-black font-medium'
                      : (slot.available && !isClosedDay.dinner) || isAdmin
                        ? 'bg-[#1A1A1A] hover:bg-[#2a2a2a] text-white border border-[#C4B5A2]/30'
                        : 'bg-[#1A1A1A] text-gray-500 cursor-not-allowed opacity-50 border border-[#3a3a3a]'
                  }`}
                >
                  <div>{slot.time}</div>
                  {isAdmin && (
                    <div className={`text-xs ${isClosedDay.dinner ? 'text-red-500' : getCapacityColorClass(slot.remainingCapacity)}`}>
                      {isClosedDay.dinner ? 'FERMÉ' : `${slot.remainingCapacity} / ${MAX_CAPACITY} places`}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 