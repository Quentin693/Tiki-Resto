"use client"

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Users,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

// Données simulées
const mockReservations = [
  {
    id: 1,
    clientName: "Marie Dupont",
    date: "2024-12-18",
    time: "19:30",
    guests: 4,
    tableNumber: 5,
    status: "confirmed"
  },
  {
    id: 2,
    clientName: "Jean Martin",
    date: "2024-12-18",
    time: "20:00",
    guests: 2,
    tableNumber: 3,
    status: "pending"
  },
  // Ajoutez plus de réservations ici
];

export default function ReservationCalendar() {
  const [viewType, setViewType] = useState('week'); // 'day', 'week', 'month'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedReservation, setSelectedReservation] = useState(null);

  const viewOptions = [
    { value: 'day', label: 'Jour' },
    { value: 'week', label: 'Semaine' },
    { value: 'month', label: 'Mois' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* En-tête */}
      <div className="bg-[#2a2a2a] border-b border-[#C4B5A2]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Calendrier des Réservations</h1>
            <div className="flex items-center gap-4">
              {/* Sélecteur de vue */}
              <div className="flex rounded-lg border border-[#C4B5A2]/30 overflow-hidden">
                {viewOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setViewType(option.value)}
                    className={`px-4 py-2 ${
                      viewType === option.value
                        ? 'bg-[#C4B5A2] text-white'
                        : 'hover:bg-[#C4B5A2]/20'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation du calendrier */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#C4B5A2]/20 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">
              {selectedDate.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </h2>
            <button className="p-2 hover:bg-[#C4B5A2]/20 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-4 py-2 bg-[#C4B5A2] rounded-lg hover:bg-[#A69783] transition-colors"
          >
            Aujourd'hui
          </button>
        </div>

        {/* Grille du calendrier */}
        <div className="bg-[#2a2a2a] rounded-xl border border-[#C4B5A2]/30">
          {/* En-tête des heures */}
          <div className="grid grid-cols-8 gap-px bg-[#3a3a3a] p-px">
            <div className="bg-[#2a2a2a] p-4">Heures</div>
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="bg-[#2a2a2a] p-4 text-center">
                {new Date(selectedDate.getTime() + i * 24 * 60 * 60 * 1000)
                  .toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
              </div>
            ))}
          </div>

          {/* Grille des heures */}
          <div className="divide-y divide-[#3a3a3a]">
            {Array.from({ length: 13 }, (_, i) => i + 11).map((hour) => (
              <div key={hour} className="grid grid-cols-8 gap-px bg-[#3a3a3a]">
                <div className="bg-[#2a2a2a] p-4 text-sm">
                  {`${hour}:00`}
                </div>
                {Array.from({ length: 7 }, (_, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="bg-[#2a2a2a] p-4 min-h-[100px] relative group"
                  >
                    {/* Exemple de réservation */}
                    <div className="absolute inset-x-2 top-2 p-2 rounded bg-green-500/20 border border-green-500 cursor-pointer hover:bg-green-500/30 transition-colors">
                      <p className="text-sm font-medium">Dupont - 4p</p>
                      <p className="text-xs">Table 5</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Liste des réservations du jour */}
        <div className="mt-8 bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
          <h2 className="text-xl font-bold mb-6">Réservations du jour</h2>
          <div className="space-y-4">
            {mockReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center justify-between p-4 bg-[#3a3a3a] rounded-lg hover:bg-[#3a3a3a]/80 cursor-pointer"
                onClick={() => setSelectedReservation(reservation)}
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(reservation.status)}
                  <div>
                    <p className="font-medium">{reservation.clientName}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {reservation.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {reservation.guests} pers.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">Table {reservation.tableNumber}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de détails de réservation */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold mb-2">
                  Réservation {selectedReservation.clientName}
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  {getStatusIcon(selectedReservation.status)}
                  <span className="capitalize">{selectedReservation.status}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReservation(null)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#C4B5A2]" />
                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p>{new Date(selectedReservation.date).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#C4B5A2]" />
                <div>
                  <p className="text-sm text-gray-400">Heure</p>
                  <p>{selectedReservation.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#C4B5A2]" />
                <div>
                  <p className="text-sm text-gray-400">Personnes</p>
                  <p>{selectedReservation.guests}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Confirmer
              </button>
              <button
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}