"use client"

import React, { useState } from 'react';
import { Calendar, Clock, Users, MessageSquare, CheckCircle, Instagram, Facebook, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '2',
    specialRequests: '',
    selectedTable: null
  });
  
  const [showConfirmation, setShowConfirmation] = useState(false);

  const tables = [
    { id: 1, seats: 4, available: true, x: 15, y: 15 },
    { id: 2, seats: 2, available: false, x: 45, y: 15 },
    { id: 3, seats: 6, available: true, x: 75, y: 15 },
    { id: 4, seats: 4, available: true, x: 15, y: 60 },
    { id: 5, seats: 8, available: false, x: 45, y: 60 },
    { id: 6, seats: 4, available: true, x: 75, y: 60 }
  ];

  const availableTimes = [
    '11:30', '12:00', '12:30', '13:00', '13:30',
    '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTableSelect = (tableId) => {
    const table = tables.find(t => t.id === tableId);
    if (table && table.available) {
      setFormData(prev => ({
        ...prev,
        selectedTable: tableId
      }));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white relative">
      {/* Background de base sombre */}
      <div className="fixed" />

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
          <div className="relative max-w-6xl mx-auto px-8 py-8">
            {/* En-tête */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Réservation</h1>
              <div className="w-24 h-1 bg-[#C4B5A2] mx-auto mb-4"></div>
              <p className="text-gray-300">Choisissez votre table et réservez votre moment</p>
            </div>

            {/* Grille principale */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Plan de salle */}
              <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border border-[#C4B5A2]/20 shadow-xl">
                <h2 className="text-2xl font-semibold mb-6">Plan de Salle</h2>
                <div className="relative w-full aspect-[4/3] border-2 border-[#3a3a3a] rounded-lg bg-[#1a1a1a]/50">
                  {tables.map((table) => {
                    const width = (table.seats / 8) * 25;
                    return (
                      <div
                        key={table.id}
                        onClick={() => handleTableSelect(table.id)}
                        className={`absolute cursor-pointer transition-transform hover:scale-105 
                          ${table.available ? 'bg-green-500/80' : 'bg-red-500/80'}
                          ${formData.selectedTable === table.id ? 'ring-4 ring-[#C4B5A2]' : ''}
                        `}
                        style={{
                          left: `${table.x}%`,
                          top: `${table.y}%`,
                          width: `${width}%`,
                          height: '15%',
                          transform: 'translate(-50%, -50%)',
                          borderRadius: '8px',
                        }}
                      >
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm whitespace-nowrap">
                          {table.seats} pers.
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-8 mt-12">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500/80 rounded"></div>
                    <span>Disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500/80 rounded"></div>
                    <span>Occupé</span>
                  </div>
                </div>
              </div>

              {/* Formulaire */}
              <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border border-[#C4B5A2]/20 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#C4B5A2]" />
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-[#1a1a1a] rounded-lg border border-[#C4B5A2]/30 focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#C4B5A2]" />
                      Heure
                    </label>
                    <select
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1a1a1a] rounded-lg border border-[#C4B5A2]/30 focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white"
                    >
                      <option value="">Sélectionnez une heure</option>
                      {availableTimes.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#C4B5A2]" />
                      Nombre de personnes
                    </label>
                    <select
                      name="guests"
                      required
                      value={formData.guests}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1a1a1a] rounded-lg border border-[#C4B5A2]/30 focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white"
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'personne' : 'personnes'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#C4B5A2]" />
                      Demandes spéciales
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#1a1a1a] rounded-lg border border-[#C4B5A2]/30 focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white"
                      placeholder="Allergies, occasion spéciale..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!formData.selectedTable}
                    className="w-full bg-[#C4B5A2] hover:bg-[#A69783] text-black font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formData.selectedTable ? 'Confirmer la réservation' : 'Veuillez sélectionner une table'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de confirmation */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] p-8 rounded-xl max-w-md w-full mx-4 border border-[#C4B5A2]/20">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Réservation Confirmée</h3>
              <div className="text-gray-300 space-y-2">
                <p>Date : {new Date(formData.date).toLocaleDateString('fr-FR')}</p>
                <p>Heure : {formData.time}</p>
                <p>Nombre de personnes : {formData.guests}</p>
                <p>Table n° : {formData.selectedTable}</p>
                {formData.specialRequests && (
                  <p>Demandes spéciales : {formData.specialRequests}</p>
                )}
              </div>
              <button
                onClick={() => setShowConfirmation(false)}
                className="mt-6 bg-[#C4B5A2] text-black px-6 py-2 rounded-lg hover:bg-[#A69783] transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}