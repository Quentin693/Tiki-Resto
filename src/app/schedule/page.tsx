"use client"

import React, { useState } from 'react';
import { 
  Plus, 
  User, 
  Calendar, 
  Clock,
  AlertCircle,
  X,
  Check,
  Edit2,
  Trash2
} from 'lucide-react';

// Données simulées
const mockStaff = [
  {
    id: 1,
    name: "Marie Dubois",
    role: "Serveuse",
    availability: "Temps plein",
    schedule: {
      monday: ["11:00-15:00", "18:00-23:00"],
      tuesday: ["11:00-15:00"],
      wednesday: ["18:00-23:00"],
      thursday: ["11:00-15:00", "18:00-23:00"],
      friday: ["18:00-23:00"],
      saturday: ["11:00-15:00", "18:00-23:00"],
      sunday: []
    }
  },
  // Ajoutez plus de membres du personnel ici
];

const timeSlots = [
  "11:00-15:00",
  "15:00-18:00",
  "18:00-23:00"
];

const daysOfWeek = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche"
];

export default function StaffManagementPage() {
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* En-tête */}
      <div className="bg-[#2a2a2a] border-b border-[#C4B5A2]">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Gestion du Personnel</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Actions */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="bg-[#C4B5A2] text-white px-4 py-2 rounded-lg hover:bg-[#A69783] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter un membre
            </button>
          </div>
        </div>

        {/* Liste du personnel et Planning */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste du personnel */}
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
            <h2 className="text-xl font-bold mb-6">Personnel</h2>
            <div className="space-y-4">
              {mockStaff.map((staff) => (
                <div
                  key={staff.id}
                  className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                    selectedStaff?.id === staff.id
                      ? 'bg-[#C4B5A2]/20 border-[#C4B5A2]'
                      : 'bg-[#3a3a3a] border-transparent hover:border-[#C4B5A2]/50'
                  }`}
                  onClick={() => setSelectedStaff(staff)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{staff.name}</h3>
                      <p className="text-sm text-gray-400">{staff.role}</p>
                      <p className="text-sm text-gray-400">{staff.availability}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1 hover:text-[#C4B5A2]">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Planning */}
          <div className="lg:col-span-2 bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
            <h2 className="text-xl font-bold mb-6">Planning</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Jour</th>
                    {timeSlots.map((slot) => (
                      <th key={slot} className="px-4 py-2 text-center">
                        {slot}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {daysOfWeek.map((day, index) => (
                    <tr key={day} className="border-t border-[#C4B5A2]/10">
                      <td className="px-4 py-4 font-medium">{day}</td>
                      {timeSlots.map((slot) => {
                        const isScheduled = selectedStaff?.schedule[day.toLowerCase()]?.includes(slot);
                        return (
                          <td key={slot} className="px-4 py-4">
                            <div className="flex justify-center">
                              <button
                                className={`w-6 h-6 rounded ${
                                  isScheduled 
                                    ? 'bg-[#C4B5A2]' 
                                    : 'bg-[#3a3a3a] hover:bg-[#C4B5A2]/50'
                                } transition-colors`}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'ajout de personnel */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Ajouter un membre</h2>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom complet</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-[#3a3a3a] border border-[#C4B5A2]/30 rounded-lg focus:ring-2 focus:ring-[#C4B5A2] focus:border-[#C4B5A2] text-white"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fonction</label>
                <select className="w-full px-4 py-2 bg-[#3a3a3a] border border-[#C4B5A2]/30 rounded-lg focus:ring-2 focus:ring-[#C4B5A2] focus:border-[#C4B5A2] text-white">
                  <option>Serveur/Serveuse</option>
                  <option>Chef de rang</option>
                  <option>Maître d'hôtel</option>
                  <option>Barman/Barmaid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Disponibilité</label>
                <select className="w-full px-4 py-2 bg-[#3a3a3a] border border-[#C4B5A2]/30 rounded-lg focus:ring-2 focus:ring-[#C4B5A2] focus:border-[#C4B5A2] text-white">
                  <option>Temps plein</option>
                  <option>Temps partiel</option>
                  <option>Extra</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#C4B5A2] text-white px-4 py-2 rounded-lg hover:bg-[#A69783] transition-colors mt-6"
              >
                Ajouter
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <p className="text-white flex items-center gap-2">
            {notification.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {notification.message}
          </p>
        </div>
      )}
    </div>
  );
}