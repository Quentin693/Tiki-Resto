"use client"

import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, X, Check, AlertCircle,
  Calendar, Clock, User, PieChart, RefreshCw, FileText
} from 'lucide-react';

// Types d'absence
const absenceTypes = {
  CONGE: 'Congé',
  MALADIE: 'Maladie',
  FORMATION: 'Formation',
  AUTRE: 'Autre'
};

// Structure enrichie des données de personnel
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
    },
    absences: [
      {
        type: 'CONGE',
        startDate: '2025-02-20',
        endDate: '2025-02-27',
        status: 'APPROVED'
      }
    ],
    workload: {
      currentWeekHours: 35,
      averageWeekHours: 37,
      overtime: 2
    }
  }
];

const timeSlots = ["11:00-15:00", "15:00-18:00", "18:00-23:00"];
const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function EnhancedStaffManagement() {
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [showScheduleChangeModal, setShowScheduleChangeModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [notification, setNotification] = useState(null);
  const [viewMode, setViewMode] = useState('schedule'); // 'schedule', 'absences', 'stats'

  // Stats calculées
  const calculateStats = (staff) => {
    return {
      totalHours: staff.workload.currentWeekHours,
      overtime: staff.workload.overtime,
      absenceDays: staff.absences.reduce((acc, curr) => {
        const start = new Date(curr.startDate);
        const end = new Date(curr.endDate);
        const days = (end - start) / (1000 * 60 * 60 * 24);
        return acc + days;
      }, 0),
    };
  };

  // Composant pour la demande de changement d'horaires
  const ScheduleChangeModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#2a2a2a] rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Demande de changement d'horaires</h2>
          <button onClick={() => setShowScheduleChangeModal(false)} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input type="date" className="w-full px-4 py-2 bg-[#3a3a3a] border border-[#C4B5A2]/30 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nouveau créneau</label>
            <select className="w-full px-4 py-2 bg-[#3a3a3a] border border-[#C4B5A2]/30 rounded-lg">
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Motif</label>
            <textarea className="w-full px-4 py-2 bg-[#3a3a3a] border border-[#C4B5A2]/30 rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-[#C4B5A2] text-white px-4 py-2 rounded-lg hover:bg-[#A69783]">
            Soumettre la demande
          </button>
        </form>
      </div>
    </div>
  );

  // Composant pour la gestion des absences
  const AbsenceModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#2a2a2a] rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Nouvelle absence</h2>
          <button onClick={() => setShowAbsenceModal(false)} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type d'absence</label>
            <select className="w-full px-4 py-2 bg-[#3a3a3a] border border-[#C4B5A2]/30 rounded-lg">
              {Object.entries(absenceTypes).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date de début</label>
              <input type="date" className="w-full px-4 py-2 bg-[#3a3a3a] border border-[#C4B5A2]/30 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date de fin</label>
              <input type="date" className="w-full px-4 py-2 bg-[#3a3a3a] border border-[#C4B5A2]/30 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Commentaire</label>
            <textarea className="w-full px-4 py-2 bg-[#3a3a3a] border border-[#C4B5A2]/30 rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-[#C4B5A2] text-white px-4 py-2 rounded-lg hover:bg-[#A69783]">
            Soumettre la demande
          </button>
        </form>
      </div>
    </div>
  );

  // Vue principale
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="bg-[#2a2a2a] border-b border-[#C4B5A2]">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Gestion du Personnel</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Actions principales */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button onClick={() => setShowAddStaffModal(true)} 
                    className="bg-[#C4B5A2] text-white px-4 py-2 rounded-lg hover:bg-[#A69783] flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Ajouter un membre
            </button>
            <button onClick={() => setShowAbsenceModal(true)}
                    className="bg-[#3a3a3a] text-white px-4 py-2 rounded-lg hover:bg-[#4a4a4a] flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Gérer les absences
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setViewMode('schedule')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${viewMode === 'schedule' ? 'bg-[#C4B5A2]' : 'bg-[#3a3a3a]'}`}>
              <Clock className="w-5 h-5" />
              Planning
            </button>
            <button onClick={() => setViewMode('absences')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${viewMode === 'absences' ? 'bg-[#C4B5A2]' : 'bg-[#3a3a3a]'}`}>
              <Calendar className="w-5 h-5" />
              Absences
            </button>
            <button onClick={() => setViewMode('stats')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${viewMode === 'stats' ? 'bg-[#C4B5A2]' : 'bg-[#3a3a3a]'}`}>
              <PieChart className="w-5 h-5" />
              Statistiques
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste du personnel */}
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
            <h2 className="text-xl font-bold mb-6">Personnel</h2>
            <div className="space-y-4">
              {mockStaff.map((staff) => {
                const stats = calculateStats(staff);
                return (
                  <div key={staff.id}
                       className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                         selectedStaff?.id === staff.id ? 'bg-[#C4B5A2]/20 border-[#C4B5A2]' : 'bg-[#3a3a3a] border-transparent hover:border-[#C4B5A2]/50'
                       }`}
                       onClick={() => setSelectedStaff(staff)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{staff.name}</h3>
                        <p className="text-sm text-gray-400">{staff.role}</p>
                        <div className="mt-2 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full ${
                            stats.overtime > 0 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'
                          }`}>
                            <Clock className="w-4 h-4 mr-1" />
                            {stats.totalHours}h/sem
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={(e) => {
                          e.stopPropagation();
                          setShowScheduleChangeModal(true);
                        }} className="p-1 hover:text-[#C4B5A2]">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vue dynamique basée sur viewMode */}
          <div className="lg:col-span-2 bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
            {viewMode === 'schedule' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Planning</h2>
                  <button onClick={() => {/* Logique de rotation */}}
                          className="px-4 py-2 rounded-lg bg-[#3a3a3a] hover:bg-[#4a4a4a] flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Rotation auto
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left">Jour</th>
                        {timeSlots.map((slot) => (
                          <th key={slot} className="px-4 py-2 text-center">{slot}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {daysOfWeek.map((day, index) => (
                        <tr key={day} className="border-t border-[#C4B5A2]/10">
                          <td className="px-4 py-4 font-medium">{day}</td>
                          {timeSlots.map((slot) => {
                            const isScheduled = selectedStaff?.schedule[day.toLowerCase()]?.includes(slot);
                            const workload = selectedStaff ? 'normal' : 'light'; // Calculer la charge réelle
                            return (
                              <td key={slot} className="px-4 py-4">
                                <div className="flex justify-center">
                                  <button
                                    className={`w-6 h-6 rounded transition-colors ${
                                      isScheduled 
                                        ? workload === 'high' 
                                          ? 'bg-red-500'
                                          : workload === 'normal'
                                            ? 'bg-[#C4B5A2]'
                                            : 'bg-green-500'
                                        : 'bg-[#3a3a3a] hover:bg-[#C4B5A2]/50'
                                    }`}
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
              </>
            )}

            {viewMode === 'absences' && (
              <>
                <h2 className="text-xl font-bold mb-6">Gestion des absences</h2>
                <div className="space-y-4">
                  {selectedStaff?.absences.map((absence, index) => (
                    <div key={index} className="bg-[#3a3a3a] p-4 rounded-lg border border-[#C4B5A2]/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">{absenceTypes[absence.type]}</span>
                          <p className="text-sm text-gray-400">
                            Du {new Date(absence.startDate).toLocaleDateString()} au {new Date(absence.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          absence.status === 'APPROVED' 
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {absence.status === 'APPROVED' ? 'Approuvé' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {viewMode === 'stats' && (
              <>
                <h2 className="text-xl font-bold mb-6">Statistiques</h2>
                {selectedStaff ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#3a3a3a] p-6 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">Heures travaillées</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-400">Cette semaine</p>
                          <p className="text-2xl font-bold">{selectedStaff.workload.currentWeekHours}h</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Moyenne mensuelle</p>
                          <p className="text-2xl font-bold">{selectedStaff.workload.averageWeekHours}h</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Heures supplémentaires</p>
                          <p className="text-2xl font-bold text-yellow-300">+{selectedStaff.workload.overtime}h</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#3a3a3a] p-6 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">Absences</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-400">Total jours d'absence</p>
                          <p className="text-2xl font-bold">
                            {selectedStaff.absences.reduce((acc, curr) => {
                              const start = new Date(curr.startDate);
                              const end = new Date(curr.endDate);
                              return acc + Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                            }, 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Prochaine absence</p>
                          {selectedStaff.absences.length > 0 ? (
                            <p className="text-lg">
                              {new Date(selectedStaff.absences[0].startDate).toLocaleDateString()}
                            </p>
                          ) : (
                            <p className="text-lg text-gray-400">Aucune absence prévue</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-12">
                    Sélectionnez un membre du personnel pour voir ses statistiques
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modaux */}
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
                  className="w-full px-4 py-2 bg-[#3a3a3a] border border-[#C4B5A2]/30 rounded-lg"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fonction</label>
                <select className="w-full px-4 py-2 bg-[#3a3a3a] border border-[#C4B5A2]/30 rounded-lg">
                  <option>Serveur/Serveuse</option>
                  <option>Chef de rang</option>
                  <option>Maître d'hôtel</option>
                  <option>Barman/Barmaid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Disponibilité</label>
                <select className="w-full px-4 py-2 bg-[#3a3a3a] border border-[#C4B5A2]/30 rounded-lg">
                  <option>Temps plein</option>
                  <option>Temps partiel</option>
                  <option>Extra</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#C4B5A2] text-white px-4 py-2 rounded-lg hover:bg-[#A69783]"
              >
                Ajouter
              </button>
            </form>
          </div>
        </div>
      )}

      {showAbsenceModal && <AbsenceModal />}
      {showScheduleChangeModal && <ScheduleChangeModal />}

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