'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Modal from '@/components/shared/Modal';
import TimeSlots from '@/components/reserver/TimeSlots';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface Reservation {
  id: number;
  date: string;
  time: string;
  guests: number;
  status: string;
  specialRequests?: string;
  userId: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
}

// Interface pour le formulaire de modification
interface EditFormData {
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}

export default function MesReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, refreshLogin, token } = useAuth();
  const router = useRouter();
  const [loadAttempted, setLoadAttempted] = useState(false);
  
  // État pour la modification
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{time: string, available: boolean}[]>([]);
  
  // Nouvel état pour la confirmation de suppression
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);

  useEffect(() => {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    if (!isLoading && !isAuthenticated) {
      toast.error('Veuillez vous connecter pour accéder à vos réservations');
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Charger les réservations seulement si l'utilisateur est connecté et qu'on n'a pas déjà tenté de charger
    if (user && user.id && !loadAttempted) {
      fetchUserReservations();
      setLoadAttempted(true); // Marquer comme tenté pour éviter les rechargements en boucle
    } else if (!user && !isLoading) {
      setIsLoading(false);
    }
  }, [user, loadAttempted, isLoading]);

  // Fonction pour charger les créneaux disponibles pour une date
  const fetchAvailableTimeSlots = async (date: string) => {
    try {
      // On utilise maintenant l'API complète depuis l'environnement
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/reservations/available-slots?date=${date}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des créneaux disponibles');
      }
      
      const data = await response.json();
      
      // Combiner les créneaux du déjeuner et du dîner
      const allSlots = [...data.lunch, ...data.dinner];
      
      // Si nous modifions une réservation, le créneau actuel doit être disponible
      if (editingReservation) {
        const currentTimeSlot = `${editingReservation.time.split(':')[0]}:${editingReservation.time.split(':')[1]}`;
        const slotExists = allSlots.some(slot => slot.time === currentTimeSlot);
        
        if (!slotExists) {
          allSlots.push({ time: currentTimeSlot, available: true, remainingCapacity: editingReservation.guests });
        }
      }
      
      setAvailableTimeSlots(allSlots);
    } catch (error) {
      console.error('Erreur lors du chargement des créneaux:', error);
      toast.error('Impossible de charger les créneaux disponibles');
      
      // En cas d'erreur, créer au moins un créneau pour le créneau actuel
      if (editingReservation) {
        const currentTimeSlot = `${editingReservation.time.split(':')[0]}:${editingReservation.time.split(':')[1]}`;
        setAvailableTimeSlots([{ time: currentTimeSlot, available: true }]);
      } else {
        // Créneaux par défaut si aucune réservation n'est en cours d'édition
        const defaultLunchSlots = ['12:00', '12:30', '13:00', '13:30', '14:00'];
        const defaultDinnerSlots = ['19:00', '19:30', '20:00', '20:30', '21:00'];
        
        const defaultSlots = [
          ...defaultLunchSlots.map(time => ({ time, available: true })),
          ...defaultDinnerSlots.map(time => ({ time, available: true }))
        ];
        
        setAvailableTimeSlots(defaultSlots);
      }
    }
  };

  // Utiliser useCallback pour envelopper fetchUserReservations
  const fetchUserReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      let response = null;
      let success = false;
      let errorDetails = '';
      
      // Si l'utilisateur est connecté, on essaie d'abord son token
      if (isAuthenticated && user) {
        try {
          // Récupérer le token depuis localStorage
          const storedToken = localStorage.getItem('token');
          
          // Vérifier si les tokens correspondent
          if (token !== storedToken) {
            console.warn('Page: Attention - Le token du contexte ne correspond pas au token stocké');
          }
          
          const tokenToUse = token || storedToken;
          if (!tokenToUse) {
            console.error('Page: Aucun token disponible. Impossible de faire la requête authentifiée.');
            throw new Error('Token manquant');
          }
          response = await fetch('/api/reservations/user', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokenToUse}`
            }
          });
          // Si la réponse est OK, on marque le succès
          if (response.ok) {
            success = true;
          } else {
            const errorData = await response.json();
            errorDetails = errorData.message || 'Erreur d\'authentification';
            console.error('Page: Erreur avec le token:', response.status, errorData);
            
            // Si le token est invalide, essayer de rafraîchir la session
            if (errorData.message && errorData.message.includes('Token')) {
              console.log('Page: Tentative de rafraîchir la session...');
              const refreshSuccess = await refreshLogin();
              
              if (refreshSuccess) {
                // Récupérer le nouveau token
                const newToken = localStorage.getItem('token');
                console.log('Page: Nouvelle tentative avec token rafraîchi:', newToken ? 'Token disponible' : 'Pas de nouveau token');
                
                // Réessayer avec le nouveau token
                response = await fetch('/api/reservations/user', {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                });
                
                console.log('Page: Réponse après rafraîchissement:', response.status);
                
                if (response.ok) {
                  success = true;
                  console.log('Page: Réservations récupérées avec succès après rafraîchissement');
                } else {
                  const newErrorData = await response.json();
                  errorDetails = newErrorData.message || 'Échec après rafraîchissement';
                  console.error('Page: Échec après rafraîchissement:', response.status, newErrorData);
                }
              } else {
                console.log('Page: Échec du rafraîchissement de session');
              }
            }
          }
        } catch (error) {
          console.error('Page: Erreur lors de la requête authentifiée:', error);
          errorDetails = 'Erreur de communication avec le serveur';
        }
      }
      
      // Si l'authentification a échoué ou n'a pas été tentée, on essaie par email/téléphone
      if (!success) {
        console.log('Tentative de récupération des réservations par email/téléphone');
        const searchParams = new URLSearchParams();
        if (user?.email) searchParams.append('email', user.email);
        if (user?.phoneNumber) searchParams.append('phone', user.phoneNumber);
        
        // Si nous n'avons ni email ni téléphone, afficher un message d'erreur
        if (!user?.email && !user?.phoneNumber) {
          toast.error('Veuillez vous connecter ou fournir un email/téléphone pour voir vos réservations');
          setIsLoading(false);
          return;
        }
        
        try {
          response = await fetch(`/api/reservations/search?${searchParams.toString()}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            success = true;
            console.log('Réservations récupérées avec succès via email/téléphone');
          } else {
            const searchErrorData = await response.json();
            errorDetails = searchErrorData.message || 'Erreur de recherche';
            console.error('Erreur de recherche par email/téléphone:', searchErrorData);
          }
        } catch (searchError) {
          console.error('Erreur lors de la recherche par email/téléphone:', searchError);
          errorDetails = 'Erreur de communication lors de la recherche';
        }
      }

      // Vérifier que response n'est pas null avant d'appeler .json()
      if (!response || !success) {
        throw new Error(`Aucune réponse valide obtenue: ${errorDetails}`);
      }

      const data = await response.json();
      setReservations(data);
    } catch (error: any) {
      console.error('Erreur globale:', error);
      toast.error(`Impossible de charger vos réservations: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  }, [refreshLogin, user, isAuthenticated, token]);

  // Ouvrir le modal de modification avec les données de la réservation
  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setEditFormData({
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      specialRequests: reservation.specialRequests || ''
    });
    
    // Charger les créneaux disponibles pour la date sélectionnée
    fetchAvailableTimeSlots(reservation.date);
    
    setShowEditModal(true);
  };

  // Gérer les changements dans le formulaire
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Si la date change, recharger les créneaux disponibles
    if (name === 'date' && value !== editFormData.date) {
      fetchAvailableTimeSlots(value);
    }
    
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) : value
    }));
  };

  // Soumettre les modifications
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingReservation) return;
    
    setIsSubmitting(true);
    
    try {
      // Préparer les données pour l'API
      const reservationData = {
        date: editFormData.date,
        time: editFormData.time,
        guests: editFormData.guests,
        specialRequests: editFormData.specialRequests
      };
      
      const response = await fetch(`/api/reservations/${editingReservation.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reservationData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification');
      }
      
      const updatedReservation = await response.json();
      
      // Mettre à jour la liste des réservations
      setReservations(prev => 
        prev.map(res => res.id === editingReservation.id ? updatedReservation : res)
      );
      
      toast.success('Réservation modifiée avec succès');
      setShowEditModal(false);
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(`Impossible de modifier la réservation: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (reservationId: number) => {
    console.log("Bouton d'annulation cliqué pour la réservation:", reservationId);
    
    // Ouvrir la confirmation au lieu de supprimer directement
    setConfirmingDelete(reservationId);
  };
  
  // Fonction pour effectuer la suppression après confirmation
  const confirmDelete = async () => {
    if (confirmingDelete === null) return;
    
    const reservationId = confirmingDelete;
    
    try {
      console.log("Suppression confirmée pour réservation:", reservationId);
      
      // Récupérer le token depuis localStorage
      const tokenToUse = localStorage.getItem('token');
      
      if (!tokenToUse) {
        toast.error('Vous devez être connecté pour annuler une réservation');
        setConfirmingDelete(null);
        return;
      }
      
      // Utiliser directement l'API backend
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/reservations/${reservationId}`;
      console.log('URL de la requête:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenToUse}`
        }
      });
      
      console.log("Réponse reçue, statut:", response.status);
      
      // Simplifier la gestion des erreurs
      if (!response.ok) {
        let errorMsg = `Erreur ${response.status} lors de l'annulation`;
        try {
          const data = await response.json();
          errorMsg = data.message || errorMsg;
        } catch (e) {
          // Ignorer les erreurs de parsing JSON
        }
        throw new Error(errorMsg);
      }

      // Mettre à jour l'état local immédiatement
      setReservations(prev => prev.filter(res => res.id !== reservationId));
      toast.success('Réservation annulée avec succès');
      
      // Recharger les réservations pour s'assurer que tout est à jour
      fetchUserReservations();
      
    } catch (error: any) {
      console.error('Erreur complète:', error);
      
      // Message d'erreur simple et clair
      toast.error(`Impossible d'annuler la réservation: ${error.message || 'Erreur inconnue'}`);
      
      // Essayer de rafraîchir le token si c'est un problème d'authentification
      if (error.message && (
        error.message.includes('Token') || 
        error.message.includes('auth') || 
        error.message.includes('401')
      )) {
        refreshLogin().then(success => {
          if (success) {
            toast.success('Session rafraîchie, veuillez réessayer');
          }
        });
      }
    } finally {
      // Fermer le modal de confirmation
      setConfirmingDelete(null);
    }
  };
  
  // Fonction pour annuler la suppression
  const cancelDelete = () => {
    setConfirmingDelete(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#141414]">
        <div className="animate-bounce">
          <Image src="/logos/TikiLogo.png" alt="Chargement..." width={100} height={100} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <div className="absolute inset-0 flex">
        {/* Décoration gauche */}
        <div className="w-[15%] sm:w-[20%] md:w-[25%] relative">
          <Image
            src="/decorations/leavesleft.webp"
            alt="Décoration gauche"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-[#141414]" />
        </div>

        {/* Zone centrale */}
        <div className="flex-grow bg-[#141414]" />

        {/* Décoration droite */}
        <div className="w-[15%] sm:w-[20%] md:w-[25%] relative">
          <Image
            src="/decorations/leavesright.webp"
            alt="Décoration droite"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-l from-transparent to-[#141414]" />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative py-16 md:py-24">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-[#C4B5A2] mb-12">Mes Réservations</h1>
          
          {reservations.length === 0 ? (
            <div className="text-center py-12 bg-[#2a2a2a]/50 rounded-xl border border-[#3a3a3a]/50">
              <h2 className="text-2xl font-medium text-gray-300 mb-4">Vous n'avez pas encore de réservations</h2>
              <p className="text-gray-400 mb-6">Réservez une table dès maintenant pour profiter de notre cuisine exotique !</p>
              <button 
                onClick={() => router.push('/reserver')}
                className="bg-[#C4B5A2] hover:bg-[#A69783] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Faire une réservation
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:gap-8">
              {reservations.map((reservation) => (
                <div 
                  key={reservation.id} 
                  className="bg-[#2a2a2a]/50 rounded-xl border border-[#3a3a3a]/50 p-6 flex flex-col md:flex-row md:items-center justify-between"
                >
                  <div className="flex-grow mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <span className="text-[#C4B5A2] text-xl font-semibold">{formatDate(reservation.date)}</span>
                      <span className="ml-2 px-2 py-1 bg-[#C4B5A2]/20 rounded text-sm text-[#C4B5A2]">
                        {reservation.time}
                      </span>
                    </div>
                    <p className="text-gray-300">
                      <span className="font-medium">{reservation.guests}</span> {reservation.guests > 1 ? 'personnes' : 'personne'}
                    </p>
                    {reservation.specialRequests && (
                      <p className="text-gray-400 mt-2 text-sm">
                        <span className="font-medium">Demandes spéciales :</span> {reservation.specialRequests}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleEdit(reservation)}
                      className="px-4 py-2 border border-blue-500/70 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="px-4 py-2 border border-red-500/70 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {confirmingDelete !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-xl p-6 max-w-md w-full mx-4 border border-[#3a3a3a]/50 shadow-xl">
            <div className="flex items-center text-amber-400 mb-4">
              <div className="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-amber-400/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Confirmer l'annulation</h3>
            </div>
            
            <p className="text-gray-300 mb-6 pl-11">
              Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
            </p>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={cancelDelete}
                className="px-5 py-2 rounded bg-transparent border border-gray-500 hover:bg-gray-700 transition-colors"
              >
                Non, garder
              </button>
              <button 
                onClick={confirmDelete}
                className="px-5 py-2 rounded bg-red-600/80 text-white hover:bg-red-700 transition-colors"
              >
                Oui, annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showEditModal && (
        <Modal 
          title={`Réservations du ${new Date(editFormData.date).toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}`}
          onClose={() => setShowEditModal(false)}
        >
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Modifier la réservation</h3>
            
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom du client*</label>
                  <input
                    type="text"
                    name="customerName"
                    value={editingReservation?.customerName || ''}
                    disabled
                    className="w-full p-2 rounded bg-[#333333] border border-[#4a4a4a] focus:outline-none text-gray-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone*</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={editingReservation?.customerPhone || ''}
                    disabled
                    className="w-full p-2 rounded bg-[#333333] border border-[#4a4a4a] focus:outline-none text-gray-300"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email (optionnel)</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={editingReservation?.customerEmail || ''}
                    disabled
                    className="w-full p-2 rounded bg-[#333333] border border-[#4a4a4a] focus:outline-none text-gray-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre de personnes*</label>
                  <select
                    name="guests"
                    value={editFormData.guests}
                    onChange={handleEditFormChange}
                    className="w-full p-2 rounded bg-[#333333] border border-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#C4B5A2]"
                    required
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num} {num > 1 ? 'personnes' : 'personne'}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Créneau horaire*</label>
                <div className="bg-[#2a2a2a]/90 rounded-xl p-4 border border-[#C4B5A2]/20">
                  <h2 className="text-lg font-semibold mb-2">Horaires disponibles</h2>
                  <p className="text-gray-400 mb-4">pour le {new Date(editFormData.date).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</p>
                  
                  <div className="space-y-6">
                    {/* Déjeuner */}
                    <div>
                      <h3 className="text-md font-medium mb-3 text-[#C4B5A2]">Déjeuner</h3>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {['12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30'].map(slot => (
                          <button
                            key={`lunch-${slot}`}
                            type="button"
                            onClick={() => setEditFormData(prev => ({ ...prev, time: slot }))}
                            className={`py-2 px-3 rounded-lg text-center transition-colors ${
                              editFormData.time === slot
                                ? 'bg-[#C4B5A2] text-black font-medium'
                                : 'bg-[#1A1A1A] hover:bg-[#2a2a2a] text-white border border-[#C4B5A2]/30'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Dîner */}
                    <div>
                      <h3 className="text-md font-medium mb-3 text-[#C4B5A2]">Dîner</h3>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {['19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30'].map(slot => (
                          <button
                            key={`dinner-${slot}`}
                            type="button"
                            onClick={() => setEditFormData(prev => ({ ...prev, time: slot }))}
                            className={`py-2 px-3 rounded-lg text-center transition-colors ${
                              editFormData.time === slot
                                ? 'bg-[#C4B5A2] text-black font-medium'
                                : 'bg-[#1A1A1A] hover:bg-[#2a2a2a] text-white border border-[#C4B5A2]/30'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Demandes spéciales</label>
                <textarea
                  name="specialRequests"
                  value={editFormData.specialRequests || ''}
                  onChange={handleEditFormChange}
                  className="w-full p-2 rounded bg-[#333333] border border-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#C4B5A2] min-h-[100px]"
                  placeholder="Allergies, préférences de table, etc."
                />
              </div>
              
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2 rounded bg-transparent border border-gray-500 hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded bg-[#C4B5A2] hover:bg-[#A69783] text-black font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Modification en cours...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
