"use client"

import { useState } from 'react';
import { Clock, Users, Trash2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Reservation, ReservationForAdmin } from '@/types/reservation';

interface ReservationListProps {
  reservations: ReservationForAdmin[];
  onEdit: (reservation: ReservationForAdmin) => void;
  onDelete: (id: number) => void;
  onTableUpdate: (id: number, tableNumber: number, isArrived: boolean) => void;
  isDeleting: boolean;
}

export default function ReservationList({ reservations, onEdit, onDelete, onTableUpdate, isDeleting }: ReservationListProps) {
  // État pour gérer le modal de confirmation de suppression
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);
  // État pour stocker les numéros de table temporaires avant validation
  const [tempTableNumbers, setTempTableNumbers] = useState<Record<number, string>>({});
  // État pour afficher toutes les réservations, y compris celles arrivées
  const [showAll, setShowAll] = useState(false);
  // Récupérer l'utilisateur courant et vérifier s'il est admin
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  
  const handleDelete = (id: number) => {
    // Ouvrir la confirmation
    setConfirmingDelete(id);
  };
  
  const confirmDelete = () => {
    if (confirmingDelete !== null) {
      // Effectuer la suppression après confirmation
      onDelete(confirmingDelete);
      setConfirmingDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setConfirmingDelete(null);
  };

  const handleTableNumberChange = (id: number, value: string) => {
    setTempTableNumbers({
      ...tempTableNumbers,
      [id]: value
    });
  };

  const handleArrivalToggle = (reservation: ReservationForAdmin) => {
    const tableNumber = tempTableNumbers[reservation.id] 
      ? parseInt(tempTableNumbers[reservation.id], 10) 
      : reservation.tableNumber || 0;
    
    // Inverser l'état d'arrivée actuel
    onTableUpdate(reservation.id, tableNumber, !reservation.isArrived);
    
    // Réinitialiser le numéro de table temporaire après validation
    if (tempTableNumbers[reservation.id]) {
      const updatedTempTableNumbers = { ...tempTableNumbers };
      delete updatedTempTableNumbers[reservation.id];
      setTempTableNumbers(updatedTempTableNumbers);
    }
  };

  // Filtrer les réservations en fonction de l'état showAll et si l'utilisateur est admin
  const filteredReservations = !isAdmin 
    ? reservations // Les clients voient toutes les réservations
    : (showAll 
        ? reservations 
        : reservations.filter(reservation => !reservation.isArrived));

  return (
    <div className="space-y-4 mt-6 relative">
      {/* Titre et bouton d'affichage - uniquement le bouton pour les admins */}
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium">
          {!isAdmin 
            ? (reservations.length === 0 ? 'Aucune réservation pour cette date' : `${reservations.length} réservation(s)`)
            : (filteredReservations.length === 0 
                ? (showAll ? 'Aucune réservation pour cette date' : 'Aucune réservation en attente') 
                : `${filteredReservations.length} réservation(s)`)
          }
        </h4>
        
        {isAdmin && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="px-3 py-1 text-sm rounded-md transition-colors bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#C4B5A2]"
          >
            {showAll ? 'Masquer arrivées' : 'Afficher tout'}
          </button>
        )}
      </div>
      
      {/* Modal de confirmation de suppression */}
      {confirmingDelete !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-lg p-6 max-w-md w-full mx-4 border border-[#C4B5A2]/30 shadow-xl">
            <div className="flex items-center text-amber-400 mb-4">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <h3 className="text-xl font-bold">Confirmer la suppression</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.
            </p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 bg-[#3a3a3a] text-gray-300 rounded-lg hover:bg-[#4a4a4a] transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Suppression...' : 'Confirmer la suppression'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {filteredReservations.length > 0 && (
        filteredReservations
          .sort((a, b) => new Date(a.reservationDateTime).getTime() - new Date(b.reservationDateTime).getTime())
          .map(reservation => (
            <div 
              key={reservation.id}
              className={`bg-[#1A1A1A] rounded-lg p-4 border ${
                isAdmin && reservation.isArrived 
                  ? 'border-green-500/30 bg-green-900/10' 
                  : 'border-[#C4B5A2]/30'
              } flex flex-col sm:flex-row justify-between`}
            >
              <div>
                <div className="flex items-center mb-1">
                  <span className="font-medium text-[#C4B5A2]">
                    {new Date(reservation.reservationDateTime).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  <span className="ml-2 px-2 py-0.5 bg-[#C4B5A2]/20 rounded-full text-xs text-[#C4B5A2]">
                    {reservation.numberOfGuests} {reservation.numberOfGuests > 1 ? 'personnes' : 'personne'}
                  </span>
                  {isAdmin && reservation.tableNumber && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-500/20 rounded-full text-xs text-blue-300">
                      Table n°{reservation.tableNumber}
                    </span>
                  )}
                  {isAdmin && reservation.isArrived && (
                    <span className="ml-2 px-2 py-0.5 bg-green-500/20 rounded-full text-xs text-green-300 flex items-center">
                      <CheckCircle size={12} className="mr-1" /> Arrivé
                    </span>
                  )}
                </div>
                <p className="text-white">{reservation.customerName}</p>
                <p className="text-gray-400 text-sm">{reservation.customerPhone}</p>
                {reservation.specialRequests && (
                  <p className="text-gray-500 text-sm mt-1">{reservation.specialRequests}</p>
                )}
              </div>
              
              <div className="flex flex-col gap-2 mt-3 sm:mt-0">
                {isAdmin && (
                  <div className="flex items-center gap-2 self-end sm:self-start">
                    <input
                      type="number"
                      placeholder="N° table"
                      value={tempTableNumbers[reservation.id] !== undefined ? tempTableNumbers[reservation.id] : reservation.tableNumber || ''}
                      onChange={(e) => handleTableNumberChange(reservation.id, e.target.value)}
                      className="w-20 px-2 py-1 text-sm bg-[#2a2a2a] border border-[#4a4a4a] rounded focus:outline-none focus:border-[#C4B5A2]"
                      min="1"
                    />
                    
                    <button
                      onClick={() => handleArrivalToggle(reservation)}
                      className={`px-2 py-1 rounded-lg transition-colors ${
                        reservation.isArrived
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      }`}
                      title={reservation.isArrived ? "Marquer comme non arrivé" : "Marquer comme arrivé"}
                    >
                      {reservation.isArrived ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                  </div>
                )}
                
                <div className="flex gap-2 self-end">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Clic sur le bouton Modifier:', reservation);
                      onEdit(reservation);
                    }}
                    className="px-4 py-2 border border-blue-500/70 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors font-medium"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(reservation.id)}
                    disabled={isDeleting || confirmingDelete !== null}
                    className="px-4 py-2 border border-red-500/70 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
      )}
    </div>
  );
} 