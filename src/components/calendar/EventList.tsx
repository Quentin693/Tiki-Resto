"use client"

import { useState } from 'react';
import { Calendar, Edit, Trash2, AlertTriangle, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  maxGuests: number;
  type: 'special' | 'private' | 'public' | 'seafood';
  color: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationIds?: number[];
  isPickup: boolean;
}

interface EventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export default function EventList({ events, onEdit, onDelete, isDeleting }: EventListProps) {
  // État pour gérer le modal de confirmation de suppression
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);
  // Récupérer l'utilisateur courant et vérifier s'il est admin
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  
  const handleDelete = (id: number) => {
    setConfirmingDelete(id);
  };
  
  const confirmDelete = () => {
    if (confirmingDelete !== null) {
      onDelete(confirmingDelete);
      setConfirmingDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setConfirmingDelete(null);
  };

  // Obtenir la couleur de fond en fonction du type d'événement
  const getEventBackground = (type: string, color: string) => {
    if (type === 'private') return 'border-green-500/30 bg-green-900/5';
    if (type === 'public') return 'border-blue-500/30 bg-blue-900/5';
    if (type === 'special') return 'border-yellow-500/30 bg-yellow-900/5';
    // Fallback à la couleur personnalisée si disponible
    return `border-[${color}]/30 bg-[${color}]/5`;
  };

  return (
    <div className="space-y-4 mt-6 relative">
      {/* En-tête de la section */}
      <div className="flex justify-between items-center">
        <div>
          {events.length === 0 
            ? 'Aucun événement pour cette date' 
            : `${events.length} événement(s)`
          }
        </div>
      </div>
      
      {/* Modal de confirmation de suppression */}
      {confirmingDelete !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-lg p-6 max-w-md w-full mx-4 border border-[#2c2d8f]/30 shadow-xl">
            <div className="flex items-center text-amber-400 mb-4">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <h3 className="text-xl font-bold">Confirmer la suppression</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.
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
      
      {events.length > 0 ? (
        events
          .sort((a, b) => 
            a.startTime.localeCompare(b.startTime) || a.title.localeCompare(b.title)
          )
          .map(event => (
            <div 
              key={event.id}
              className={`bg-[#1A1A1A] rounded-lg p-4 border ${getEventBackground(event.type, event.color)}`}
              style={{ borderLeft: `4px solid ${event.color}` }}
            >
              <div className="flex flex-wrap justify-between">
                <div className="w-full md:w-7/12">
                  <div className="flex items-center mb-1 flex-wrap gap-2">
                    <span className="font-medium text-[#2c2d8f]">
                      {event.startTime} {event.endTime && `- ${event.endTime}`}
                    </span>
                    <span className="px-2 py-0.5 bg-[#2c2d8f]/20 rounded-full text-xs text-[#2c2d8f] flex items-center">
                      {event.type === 'private' ? 'Évènement privé' : 
                       event.type === 'public' ? 'Évènement public' : 
                       event.type === 'seafood' ? 'Évènement seafood' : 'Évènement spécial'}
                    </span>
                  </div>
                  
                  <p className="text-white font-medium">{event.title}</p>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Users size={14} className="mr-1" /> {event.maxGuests} personnes
                  </div>
                  <p className="text-gray-400 text-sm">{event.customerName} - {event.customerPhone}</p>
                  
                  {event.description && (
                    <div className="mt-3 p-2 bg-[#2a2a2a] rounded border border-[#3a3a3a]">
                      <p className="text-xs font-medium text-gray-400">Description:</p>
                      <p className="text-sm text-gray-300">{event.description}</p>
                    </div>
                  )}
                </div>
                
                <div className="w-full md:w-4/12 mt-4 md:mt-0 flex justify-end">
                  <div className="flex gap-2 self-end">
                    <button
                      onClick={() => onEdit(event)}
                      className="px-4 py-2 border border-blue-500/70 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors font-medium"
                    >
                      <Edit size={16} className="inline mr-1" /> Modifier
                    </button>
                    
                    <button
                      onClick={() => handleDelete(event.id)}
                      disabled={isDeleting || confirmingDelete !== null}
                      className="px-4 py-2 border border-red-500/70 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} className="inline mr-1" /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
      ) : (
        <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#2c2d8f]/20 text-center">
          <p className="text-gray-400">Aucun événement pour cette date</p>
        </div>
      )}
    </div>
  );
} 