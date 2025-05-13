'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  phoneNumber?: string;
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

// Interface pour le formulaire de modification de réservation
interface EditFormData {
  id?: number;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  sendSms?: boolean;
}

// Interfaces pour les commandes de fruits de mer
interface SeafoodItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  half?: boolean;
}

interface SeafoodPlateau {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface SeafoodOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupDate: string;
  pickupTime: string;
  isPickup: boolean;
  items: SeafoodItem[];
  plateaux: SeafoodPlateau[];
  totalPrice: number;
  specialRequests?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Interface pour le formulaire de modification de commande
interface EditSeafoodOrderFormData {
  id?: string;
  pickupDate: string;
  pickupTime: string;
  specialRequests?: string;
  isPickup: boolean;
  sendSms?: boolean;
}

export default function MesReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, refreshLogin, token } = useAuth();
  const router = useRouter();
  const [loadAttempted, setLoadAttempted] = useState(false);
  
  // État pour les commandes de fruits de mer
  const [seafoodOrders, setSeafoodOrders] = useState<SeafoodOrder[]>([]);
  const [orders, setOrders] = useState<SeafoodOrder[]>([]);
  const [loadOrdersAttempted, setLoadOrdersAttempted] = useState(false);
  const [activeTab, setActiveTab] = useState<'reservations' | 'orders'>('reservations');
  
  // État pour la modification
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    date: '',
    time: '',
    guests: 2,
    specialRequests: '',
    sendSms: true
  });
  
  // États pour la modification des commandes de fruits de mer
  const [editingOrder, setEditingOrder] = useState<SeafoodOrder | null>(null);
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [editOrderData, setEditOrderData] = useState<EditSeafoodOrderFormData>({
    pickupDate: '',
    pickupTime: '',
    specialRequests: '',
    isPickup: true,
    sendSms: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{time: string, available: boolean}[]>([]);
  
  // Nouvel état pour la confirmation de suppression
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);
  const [confirmingOrderDelete, setConfirmingOrderDelete] = useState<string | null>(null);
  const [sendNotification, setSendNotification] = useState(true);

  // État pour les messages de succès et d'erreur
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const successMessage = useRef('');
  const [errorToast, setErrorToast] = useState({ visible: false, message: '' });
  
  // Valeurs initiales pour réinitialiser les formulaires
  const initialEditFormData: EditFormData = {
    date: '',
    time: '',
    guests: 2,
    specialRequests: '',
    sendSms: true
  };
  
  const initialEditOrderData: EditSeafoodOrderFormData = {
    pickupDate: '',
    pickupTime: '',
    specialRequests: '',
    isPickup: true,
    sendSms: true
  };

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
  
  // Effet pour charger les commandes de fruits de mer
  useEffect(() => {
    if (user && user.id && !loadOrdersAttempted) {
      fetchUserSeafoodOrders();
      setLoadOrdersAttempted(true);
    }
  }, [user, loadOrdersAttempted]);

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

  // Modifier fetchUserReservations pour traiter les réservations comme les commandes de fruits de mer
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
                // Réessayer avec le nouveau token
                response = await fetch('/api/reservations/user', {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                });
                
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
        
        // Simplifier pour n'utiliser que phoneNumber
        const phoneNumber = user?.phoneNumber;
        if (phoneNumber) searchParams.append('phone', phoneNumber);
        
        // Si nous n'avons ni email ni téléphone, afficher un message d'erreur
        if (!user?.email && !phoneNumber) {
          toast.error('Veuillez vous connecter ou fournir un email/téléphone pour voir vos réservations');
          setIsLoading(false);
          return;
        }
        
        try {
          console.log(`Recherche avec paramètres: ${searchParams.toString()}`);
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
      
      console.log("Données brutes du serveur:", JSON.stringify(data));
      
      // Traiter les réservations exactement comme les commandes de fruits de mer
      const processedReservations = data.map((reservation: any) => {
        console.log(`Réservation #${reservation.id} - données brutes:`, JSON.stringify(reservation));
        
        // Extraire date et heure sans aucune conversion
        let datePart = reservation.date;
        let timePart = reservation.time;
        
        // Si on a reservationDateTime mais pas date/time séparés
        if (reservation.reservationDateTime && (!datePart || !timePart)) {
          if (reservation.reservationDateTime.includes('T')) {
            const parts = reservation.reservationDateTime.split('T');
            datePart = parts[0];
            
            // Extraire l'heure sans aucune conversion
            timePart = parts[1].split(':')[0] + ':' + parts[1].split(':')[1];
          }
        }
        
        return {
          ...reservation,
          date: datePart,
          time: timePart
        };
      });
      
      console.log("Réservations traitées sans conversion:", processedReservations);
      setReservations(processedReservations);
    } catch (error: any) {
      console.error('Erreur globale:', error);
      toast.error(`Impossible de charger vos réservations: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  }, [refreshLogin, user, isAuthenticated, token]);

  // Fonction pour récupérer les commandes de fruits de mer de l'utilisateur
  const fetchUserSeafoodOrders = useCallback(async () => {
    try {
      let response = null;
      let success = false;
      let errorDetails = '';
      
      // Au lieu d'essayer le token, allons directement à la recherche par email/téléphone
      console.log('Tentative de récupération des commandes par email/téléphone');
      const searchParams = new URLSearchParams();
      
      // Utiliser les coordonnées du profil utilisateur
      if (user?.email) searchParams.append('email', user.email);
      
      // Utiliser phoneNumber pour l'API
      const phoneNumber = user?.phoneNumber;
      if (phoneNumber) searchParams.append('phone', phoneNumber);
      
      // Si nous n'avons ni email ni téléphone, afficher un message d'erreur
      if (!user?.email && !phoneNumber) {
        console.log('Aucun email ou téléphone disponible pour chercher les commandes');
        setSeafoodOrders([]);
        return;
      }
      
      try {
        console.log(`Recherche avec paramètres: ${searchParams.toString()}`);
        response = await fetch(`/api/seafood-orders/search?${searchParams.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Statut de la réponse API seafood-orders/search:', response.status);
        
        if (response.ok) {
          success = true;
          console.log('Commandes récupérées avec succès via email/téléphone');
        } else {
          // Récupérer le contenu brut pour le débogage
          const rawErrorText = await response.text();
          console.error('Erreur brute de l\'API de recherche:', rawErrorText);
          
          try {
            const searchErrorData = JSON.parse(rawErrorText);
            errorDetails = searchErrorData.message || 'Erreur de recherche';
            console.error('Erreur de recherche par email/téléphone:', searchErrorData);
          } catch (parseError) {
            console.error('Impossible de parser l\'erreur comme JSON:', parseError);
            errorDetails = `Erreur ${response.status}: ${rawErrorText.substring(0, 100)}...`;
          }
        }
      } catch (searchError) {
        console.error('Erreur lors de la recherche par email/téléphone:', searchError);
        errorDetails = 'Erreur de communication lors de la recherche';
      }

      // Vérifier que response n'est pas null avant d'appeler .json()
      if (!response || !success) {
        setSeafoodOrders([]);
        return;
      }

      try {
        const data = await response.json();
        
        // Pour le traitement des commandes
        const processedOrders = data.map((order: any) => {
          
          // Vérifier la structure exacte de l'objet pour accéder correctement aux prix
          let fixedTotalPrice = 0;
          
          // Traiter les plateaux
          const processedPlateaux = Array.isArray(order.plateaux) 
            ? order.plateaux.map((plateau: any) => {
                // Examiner la structure du plateau
                
                // Extraire le prix correct du plateau
                let plateauPrice = 0;
                if (plateau.price !== undefined) {
                  plateauPrice = convertToNumber(plateau.price);
                } else if (plateau.unitPrice !== undefined) {
                  plateauPrice = convertToNumber(plateau.unitPrice);
                }
                
                // Extraire la quantité
                const quantity = convertToNumber(plateau.quantity);
                
                // Ajouter au total
                fixedTotalPrice += plateauPrice * quantity;
                
                return {
                  ...plateau,
                  price: plateauPrice,
                  quantity: quantity
                };
              }) 
            : [];
          
          // Traiter les items
          const processedItems = Array.isArray(order.items) 
            ? order.items.map((item: any) => {
                
                // Extraire le prix correct de l'item
                let itemPrice = 0;
                if (item.price !== undefined) {
                  itemPrice = convertToNumber(item.price);
                } else if (item.unitPrice !== undefined) {
                  itemPrice = convertToNumber(item.unitPrice);
                }
                
                // Extraire la quantité
                const quantity = convertToNumber(item.quantity);
                
                // Ajouter au total
                fixedTotalPrice += itemPrice * quantity;
                
                return {
                  ...item,
                  price: itemPrice,
                  quantity: quantity
                };
              }) 
            : [];
          
          // Si le totalPrice n'est pas correct dans l'objet, utiliser notre calcul
          const finalPrice = (typeof order.totalPrice === 'number' && order.totalPrice > 0) 
            ? order.totalPrice 
            : fixedTotalPrice;
            
          return {
            ...order,
            totalPrice: finalPrice,
            plateaux: processedPlateaux,
            items: processedItems
          };
        });
        setSeafoodOrders(processedOrders);
      } catch (error) {
        console.error('Erreur lors du parsing des données JSON:', error);
        // En cas d'erreur de parsing, initialiser avec un tableau vide
        setSeafoodOrders([]);
      }
    } catch (error: any) {
      console.error('Erreur globale lors de la récupération des commandes:', error);
      // On initialise avec un tableau vide plutôt que d'afficher une erreur
      setSeafoodOrders([]);
    }
  }, [user]);

  // Fonction utilitaire pour convertir en nombre
  const convertToNumber = (value: any): number => {
    if (typeof value === 'number' && !isNaN(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
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

  // Modifier handleEditSubmit pour utiliser la même approche que pour les commandes de fruits de mer
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = await getToken();
      
      // Formatage identique à celui des commandes de fruits de mer
      const reservationData = {
        customerName: editingReservation?.customerName || "",
        customerEmail: editingReservation?.customerEmail || "",
        customerPhone: editingReservation?.customerPhone || "",
        numberOfGuests: editFormData.guests,
        reservationDateTime: `${editFormData.date}T${editFormData.time}:00.000Z`,
        specialRequests: editFormData.specialRequests || "",
        userId: editingReservation?.userId || 1,
        isEvent: false
      };

      console.log("Données envoyées à l'API:", JSON.stringify(reservationData));
      
      const response = await fetch(`/api/reservations/${editFormData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(reservationData)
      });

      // Réutiliser le code des commandes de fruits de mer pour la gestion de la réponse
      const statusCode = response.status;
      const statusText = await response.text();
      console.log(`Réponse API: ${statusCode} - ${statusText}`);

      if (!response.ok) {
        let message = "Erreur lors de la modification de la réservation";
        try {
          const errorData = JSON.parse(statusText);
          message = errorData.message || message;
        } catch (e) {
          console.error("Erreur lors du parsing de la réponse:", e);
        }
        throw new Error(message);
      }

      // Mise à jour identique à celle des commandes de fruits de mer
      setReservations(prevReservations => 
        prevReservations.map(res => {
          if (res.id === editFormData.id) {
            // Mettre à jour la réservation avec exactement les valeurs du formulaire
            return {
              ...res,
              date: editFormData.date,
              time: editFormData.time,
              guests: editFormData.guests,
              specialRequests: editFormData.specialRequests || res.specialRequests
            };
          }
          return res;
        })
      );
      
      // Important: NE PAS recharger les réservations
      // fetchUserReservations();
      
      setShowEditModal(false);
      toast.success("Réservation modifiée avec succès");
      
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la modification de la réservation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (reservationId: number) => {
    // Ouvrir la confirmation au lieu de supprimer directement
    setConfirmingDelete(reservationId);
  };
  
  // Fonction pour effectuer la suppression après confirmation
  const confirmDelete = async () => {
    if (confirmingDelete === null) return;
    
    const reservationId = confirmingDelete;
    
    try {
      
      // Récupérer le token depuis localStorage
      const tokenToUse = localStorage.getItem('token');
      
      if (!tokenToUse) {
        toast.error('Vous devez être connecté pour annuler une réservation');
        setConfirmingDelete(null);
        return;
      }
      
      // Utiliser l'API locale au lieu d'appeler directement le backend
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenToUse}`
        },
        // Inclure sendSms dans le corps de la requête DELETE
        body: JSON.stringify({ sendSms: sendNotification })
      });
      
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

  // Mise à jour de la fonction formatDate qui évite les conversions de fuseau horaire
  const formatDate = (dateString: string) => {
    try {
      // Si le format n'est pas YYYY-MM-DD, retourner tel quel
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      // Tableaux de noms en français
      const weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
      
      // Extraire année, mois, jour
      const [year, month, day] = dateString.split('-').map(Number);
      
      // Créer un objet Date en UTC pour éviter les conversions de fuseau horaire
      // On utilise l'objet Date uniquement pour obtenir le jour de la semaine
      const date = new Date(Date.UTC(year, month - 1, day));
      const weekday = weekdays[date.getUTCDay()];
      
      // Retourner la date formatée manuellement
      return `${weekday} ${day} ${months[month - 1]} ${year}`;
    } catch (e) {
      console.error("Erreur lors du formatage de la date:", e);
      return dateString; // Retourner la date originale en cas d'erreur
    }
  };

  // Mise à jour de la fonction formatTime pour éviter toute conversion
  const formatTime = (timeString: string) => {
    try {
      // Si c'est déjà au format HH:MM, on le retourne directement
      if (/^\d{2}:\d{2}$/.test(timeString)) {
        return timeString;
      }
      
      // Si c'est une date ISO complète (comme 2023-05-15T19:30:00Z)
      if (timeString.includes('T')) {
        // Extraire directement les heures et minutes sans créer d'objet Date
        const timePart = timeString.split('T')[1];
        // Prendre seulement HH:MM
        return timePart.substring(0, 5);
      }
      
      // Format par défaut
      return timeString;
    } catch (e) {
      console.error("Erreur lors du formatage de l'heure:", e);
      return timeString; // Retourner l'heure originale en cas d'erreur
    }
  };

  // Fonction pour filtrer les réservations passées
  const filterPastReservations = (reservations: Reservation[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialise l'heure à minuit pour comparer uniquement les dates
    
    return reservations.filter(reservation => {
      const reservationDate = new Date(reservation.date);
      
      // Si la date est antérieure à aujourd'hui, c'est une réservation passée
      if (reservationDate < today) {
        return false;
      }
      
      // Si c'est aujourd'hui, vérifier l'heure
      if (reservationDate.getDate() === today.getDate() &&
          reservationDate.getMonth() === today.getMonth() &&
          reservationDate.getFullYear() === today.getFullYear()) {
        
        // Comparer l'heure actuelle avec l'heure de la réservation
        const now = new Date();
        const [hours, minutes] = reservation.time.split(':').map(Number);
        
        // Si l'heure de la réservation est passée, ne pas l'afficher
        if (hours < now.getHours() || (hours === now.getHours() && minutes < now.getMinutes())) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Fonction pour filtrer les commandes passées
  const filterPastOrders = (orders: SeafoodOrder[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialise l'heure à minuit
    
    return orders.filter(order => {
      const pickupDate = new Date(order.pickupDate);
      
      // Si la date est antérieure à aujourd'hui, c'est une commande passée
      if (pickupDate < today) {
        return false;
      }
      
      // Si c'est aujourd'hui, vérifier l'heure
      if (pickupDate.getDate() === today.getDate() &&
          pickupDate.getMonth() === today.getMonth() &&
          pickupDate.getFullYear() === today.getFullYear()) {
        
        // Comparer l'heure actuelle avec l'heure de retrait
        const now = new Date();
        const [hours, minutes] = order.pickupTime.split(':').map(Number);
        
        // Si l'heure de retrait est passée, ne pas l'afficher
        if (hours < now.getHours() || (hours === now.getHours() && minutes < now.getMinutes())) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Fonctions manquantes pour gérer les commandes de fruits de mer
  // Ouvrir le modal de modification d'une commande de fruits de mer
  const handleEditOrder = (order: SeafoodOrder) => {
    setEditingOrder(order);
    setEditOrderData({
      id: order.id,
      pickupDate: order.pickupDate,
      pickupTime: order.pickupTime,
      specialRequests: order.specialRequests || '',
      isPickup: order.isPickup,
      sendSms: true
    });
    
    setShowEditOrderModal(true);
  };

  // Gérer les changements dans le formulaire de modification de commande
  const handleEditOrderFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'isPickup') {
      setEditOrderData(prev => ({
        ...prev,
        [name]: value === 'true'
      }));
    } else {
      setEditOrderData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Soumettre les modifications de commande
  const handleEditOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = await getToken();
      
      // Créer la structure exacte comme dans la documentation Swagger
      const orderData = {
        status: "pending",
        comment: "Modification par le client",
        pickupDate: editOrderData.pickupDate,
        pickupTime: editOrderData.pickupTime,
        isPickup: editOrderData.isPickup,
        specialRequests: editOrderData.specialRequests || "",
      };

      console.log("Données de modification de commande:", orderData);

      const response = await fetch(`/api/seafood-orders/${editOrderData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(orderData)
      });

      console.log("Statut de la réponse de modification (token):", response.status);
      
      let responseData;
      let statusText = '';
      
      try {
        statusText = await response.text();
        if (statusText) {
          responseData = JSON.parse(statusText);
        }
      } catch (e) {
        console.error("Erreur lors du parsing de la réponse:", e);
      }
      
      if (!response.ok) {
        let message = "Erreur lors de la modification de la commande";
        if (responseData && responseData.message) {
          message = responseData.message;
        }
        throw new Error(message);
      }
      
      // Tentative alternative si besoin
      if (response.status === 401 || response.status === 403) {
        console.log("Tentative alternative avec email/téléphone");
        
        // Informations de contact déjà incluses dans orderData
        const alternativeResponse = await fetch(`/api/seafood-orders/update-by-contact/${editOrderData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });
        
        console.log("Statut de la réponse de la méthode alternative:", alternativeResponse.status);
        
        if (!alternativeResponse.ok) {
          const alternativeText = await alternativeResponse.text();
          let message = "Erreur lors de la modification de la commande";
          try {
            const errorData = JSON.parse(alternativeText);
            message = errorData.message || message;
          } catch (e) {
            console.error("Erreur lors du parsing de la réponse alternative:", e);
          }
          throw new Error(message);
        }
        
        try {
          const altText = await alternativeResponse.text();
          if (altText) {
            responseData = JSON.parse(altText);
          }
        } catch (e) {
          console.error("Erreur lors du parsing de la réponse alternative réussie:", e);
        }
      }

      // Extraire les données mises à jour
      const updatedPickupDate = responseData?.pickupDate || editOrderData.pickupDate;
      const updatedPickupTime = responseData?.pickupTime || editOrderData.pickupTime;
      const updatedIsPickup = responseData?.isPickup !== undefined ? responseData.isPickup : editOrderData.isPickup;
      const updatedSpecialRequests = responseData?.specialRequests || editOrderData.specialRequests;

      // Mettre à jour les deux états locaux (seafoodOrders et orders)
      const updateOrderState = (prevOrders: SeafoodOrder[]) => 
        prevOrders.map((order: SeafoodOrder) => {
          if (order.id === editOrderData.id) {
            return {
              ...order,
              pickupDate: updatedPickupDate,
              pickupTime: updatedPickupTime,
              specialRequests: updatedSpecialRequests,
              isPickup: updatedIsPickup
            };
          }
          return order;
        });
      
      // Mettre à jour les deux états
      setSeafoodOrders(updateOrderState);
      if (setOrders) {
        setOrders(updateOrderState);
      }
      
      setShowEditOrderModal(false);
      setShowSuccessToast(true);
      successMessage.current = "Commande modifiée avec succès";
      
      // Réinitialiser le formulaire
      setEditOrderData(initialEditOrderData);
    } catch (error) {
      console.error("Erreur complète:", error);
      setErrorToast({
        visible: true,
        message: error instanceof Error ? error.message : "Erreur lors de la modification de la commande"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demander la confirmation pour annuler une commande
  const handleCancelOrder = (orderId: string) => {
    setConfirmingOrderDelete(orderId);
  };
  
  // Confirmer la suppression d'une commande
  const confirmOrderDelete = async () => {
    if (confirmingOrderDelete === null) return;
    
    const orderId = confirmingOrderDelete;
    
    try {
      
      const tokenToUse = localStorage.getItem('token');
      
      if (!tokenToUse) {
        toast.error('Vous devez être connecté pour annuler une commande');
        setConfirmingOrderDelete(null);
        return;
      }
      
      const response = await fetch(`/api/seafood-orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenToUse}`
        },
        body: JSON.stringify({ sendSms: sendNotification })
      });
      
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

      // Mettre à jour l'état local
      setSeafoodOrders(prev => prev.filter(order => order.id !== orderId));
      toast.success('Commande annulée avec succès');
      
      // Recharger les commandes pour s'assurer que tout est à jour
      fetchUserSeafoodOrders();
      
    } catch (error: any) {
      console.error('Erreur complète:', error);
      toast.error(`Impossible d'annuler la commande: ${error.message || 'Erreur inconnue'}`);
      
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
      setConfirmingOrderDelete(null);
    }
  };
  
  // Fonction pour annuler la suppression d'une commande
  const cancelOrderDelete = () => {
    setConfirmingOrderDelete(null);
  };

  // Mise à jour de la fonction handleEdit pour éviter les conversions
  const handleEdit = (reservation: Reservation) => {
    console.log(">>> DÉBUT ÉDITION - Réservation originale:", reservation);
    
    // Conserver la réservation complète pour référence
    setEditingReservation(reservation);
    
    // IMPORTANT: Utiliser exactement les valeurs stockées sans conversion
    setEditFormData({
      id: reservation.id,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      specialRequests: reservation.specialRequests || '',
      sendSms: true
    });
    
    console.log(">>> Formulaire initialisé avec date exacte:", reservation.date, "et heure exacte:", reservation.time);
    
    // Charger les créneaux disponibles pour la date sélectionnée
    fetchAvailableTimeSlots(reservation.date);
    
    setShowEditModal(true);
  };

  // Fonction pour obtenir le token d'authentification
  const getToken = async (): Promise<string | null> => {
    if (token) return token;
    
    // Si pas de token, essayer depuis localStorage
    const localToken = localStorage.getItem('token');
    if (localToken) return localToken;
    
    // Si toujours pas de token, essayer de rafraîchir
    const success = await refreshLogin();
    return success ? localStorage.getItem('token') : null;
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
    <div className="min-h-screen bg-[#0f0f0f] text-white relative">
      {/* Background avec feuilles - limité à la zone principale */}
      <div className="absolute inset-0 flex z-0 overflow-hidden pointer-events-none">
        {/* Décoration gauche */}
        <div className="w-[15%] sm:w-[20%] md:w-[25%] relative">
          <Image
            src="/decorations/leavesleft.webp"
            alt="Décoration gauche"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-[#0f0f0f]" />
        </div>

        {/* Zone centrale */}
        <div className="flex-grow bg-[#0f0f0f]" />

        {/* Décoration droite */}
        <div className="w-[15%] sm:w-[20%] md:w-[25%] relative">
          <Image
            src="/decorations/leavesright.webp"
            alt="Décoration droite"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-l from-transparent to-[#0f0f0f]" />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 pt-24 sm:pt-28 pb-24">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-didot text-center text-[#C4B5A2] mb-12">Mes Réservations</h1>
          
          {/* Onglets pour switcher entre réservations et commandes */}
          <div className="flex justify-center mb-8">
            <div className="flex rounded-lg bg-[#2a2a2a]/70 p-1 border border-[#3a3a3a]/50">
              <button 
                onClick={() => setActiveTab('reservations')}
                className={`px-6 py-3 rounded-md transition-colors font-medium ${
                  activeTab === 'reservations' 
                    ? 'bg-[#C4B5A2] text-black' 
                    : 'text-gray-300 hover:text-white hover:bg-[#2a2a2a]'
                }`}
              >
                Tables
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 rounded-md transition-colors font-medium ${
                  activeTab === 'orders' 
                    ? 'bg-[#C4B5A2] text-black' 
                    : 'text-gray-300 hover:text-white hover:bg-[#2a2a2a]'
                }`}
              >
                Fruits de mer
              </button>
            </div>
          </div>
          
          {activeTab === 'reservations' ? (
            // Contenu pour les réservations de table
            reservations.length === 0 ? (
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
              <>
                {(() => {
                  const activeReservations = filterPastReservations(reservations);
                  
                  if (activeReservations.length === 0) {
                    return (
                      <div className="text-center py-12 bg-[#2a2a2a]/50 rounded-xl border border-[#3a3a3a]/50">
                        <h2 className="text-2xl font-medium text-gray-300 mb-4">Vous n'avez pas de réservations à venir</h2>
                        <p className="text-gray-400 mb-6">Réservez une table dès maintenant pour profiter de notre cuisine exotique !</p>
                        <button 
                          onClick={() => router.push('/reserver')}
                          className="bg-[#C4B5A2] hover:bg-[#A69783] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                          Faire une réservation
                        </button>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="grid gap-6 md:gap-8">
                      {activeReservations.map((reservation) => (
                        <div 
                          key={reservation.id} 
                          className="bg-[#2a2a2a]/50 rounded-xl border border-[#3a3a3a]/50 p-6 flex flex-col md:flex-row md:items-center justify-between"
                        >
                          <div className="flex-grow mb-4 md:mb-0">
                            <div className="flex items-center mb-2">
                              <span className="text-[#C4B5A2] text-xl font-semibold">{formatDate(reservation.date)}</span>
                              <span className="ml-2 px-2 py-1 bg-[#C4B5A2]/20 rounded text-sm text-[#C4B5A2]">
                                {reservation.time} {/* Afficher l'heure exacte sans aucun formatage */}
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
                              onClick={() => {
                                console.log("Modification de la réservation:", reservation);
                                handleEdit(reservation);
                              }}
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
                  );
                })()}
              </>
            )
          ) : (
            // Contenu pour les commandes de fruits de mer
            seafoodOrders.length === 0 ? (
              <div className="text-center py-12 bg-[#2a2a2a]/50 rounded-xl border border-[#3a3a3a]/50">
                <h2 className="text-2xl font-medium text-gray-300 mb-4">Vous n'avez pas encore de commandes de fruits de mer</h2>
                <p className="text-gray-400 mb-6">Commandez dès maintenant nos plateaux et compositions de fruits de mer !</p>
                <button 
                  onClick={() => router.push('/commander')}
                  className="bg-[#C4B5A2] hover:bg-[#A69783] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Commander des fruits de mer
                </button>
              </div>
            ) : (
              <>
                {(() => {
                  const activeOrders = filterPastOrders(seafoodOrders);
                  
                  if (activeOrders.length === 0) {
                    return (
                      <div className="text-center py-12 bg-[#2a2a2a]/50 rounded-xl border border-[#3a3a3a]/50">
                        <h2 className="text-2xl font-medium text-gray-300 mb-4">Vous n'avez pas de commandes à venir</h2>
                        <p className="text-gray-400 mb-6">Commandez dès maintenant nos plateaux et compositions de fruits de mer !</p>
                        <button 
                          onClick={() => router.push('/commander')}
                          className="bg-[#C4B5A2] hover:bg-[#A69783] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                          Commander des fruits de mer
                        </button>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="grid gap-6 md:gap-8">
                      {activeOrders.map((order) => (
                        <div 
                          key={order.id} 
                          className="bg-[#2a2a2a]/50 rounded-xl border border-[#3a3a3a]/50 p-6"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div className="flex-grow mb-4 md:mb-0">
                              <div className="flex items-center mb-2">
                                <span className="text-[#C4B5A2] text-xl font-semibold">{formatDate(order.pickupDate)}</span>
                                <span className="ml-2 px-2 py-1 bg-[#C4B5A2]/20 rounded text-sm text-[#C4B5A2]">
                                  {formatTime(order.pickupTime)}
                                </span>
                                <span className="ml-2 px-2 py-1 bg-green-500/20 rounded text-sm text-green-400">
                                  {order.isPickup ? 'À emporter' : 'Livraison'}
                                </span>
                              </div>
                              <p className="text-gray-300">
                                <span className="font-medium">Total:</span> {
                                  (() => {
                                    // Vérifier si le prix est un nombre valide
                                    const price = typeof order.totalPrice === 'number' && !isNaN(order.totalPrice) 
                                      ? order.totalPrice
                                      : 0;
                                    
                                    // Formater avec 2 décimales
                                    return `${price.toFixed(2)} €`;
                                  })()
                                }
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => handleEditOrder(order)}
                                className="px-4 py-2 border border-blue-500/70 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                              >
                                Modifier
                              </button>
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="px-4 py-2 border border-red-500/70 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                          
                          {/* Détails de la commande */}
                          <div className="mt-4 pt-4 border-t border-[#3a3a3a]">
                            {order.plateaux.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-lg font-medium text-[#C4B5A2] mb-2">Plateaux</h4>
                                <div className="space-y-2">
                                  {order.plateaux.map((plateau, idx) => (
                                    <div key={idx} className="flex justify-between">
                                      <span>
                                        {plateau.quantity} × {plateau.name}
                                      </span>
                                      <span className="text-gray-400">
                                        {(convertToNumber(plateau.quantity) * convertToNumber(plateau.price)).toFixed(2)} €
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {order.items.length > 0 && (
                              <div>
                                <h4 className="text-lg font-medium text-[#C4B5A2] mb-2">Fruits de mer à l'unité</h4>
                                <div className="space-y-2">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between">
                                      <span>
                                        {item.quantity} × {item.name} {item.half ? '(demi-douzaine)' : ''}
                                      </span>
                                      <span className="text-gray-400">
                                        {(convertToNumber(item.quantity) * convertToNumber(item.price)).toFixed(2)} €
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {order.specialRequests && (
                              <div className="mt-4 text-gray-400 text-sm">
                                <span className="font-medium">Demandes spéciales:</span> {order.specialRequests}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </>
            )
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
            
            <div className="mb-4 pl-11">
              <label className="flex items-center text-gray-300">
                <input 
                  type="checkbox" 
                  checked={sendNotification}
                  onChange={(e) => setSendNotification(e.target.checked)}
                  className="h-4 w-4 bg-[#3a3a3a] border-[#4a4a4a] rounded mr-2"
                />
                M'envoyer un SMS de confirmation
              </label>
            </div>
            
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

      {/* Modal de confirmation de suppression de commande */}
      {confirmingOrderDelete !== null && (
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
              Êtes-vous sûr de vouloir annuler cette commande de fruits de mer ? Cette action est irréversible.
            </p>
            
            <div className="mb-4 pl-11">
              <label className="flex items-center text-gray-300">
                <input 
                  type="checkbox" 
                  checked={sendNotification}
                  onChange={(e) => setSendNotification(e.target.checked)}
                  className="h-4 w-4 bg-[#3a3a3a] border-[#4a4a4a] rounded mr-2"
                />
                M'envoyer un SMS de confirmation
              </label>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={cancelOrderDelete}
                className="px-5 py-2 rounded bg-transparent border border-gray-500 hover:bg-gray-700 transition-colors"
              >
                Non, garder
              </button>
              <button 
                onClick={confirmOrderDelete}
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
              
              <div>
                <label className="flex items-center text-gray-300">
                  <input 
                    type="checkbox" 
                    checked={sendNotification}
                    onChange={(e) => setSendNotification(e.target.checked)}
                    className="h-4 w-4 bg-[#3a3a3a] border-[#4a4a4a] rounded mr-2"
                  />
                  M'envoyer un SMS de confirmation
                </label>
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

      {/* Modal de modification de commande de fruits de mer */}
      {showEditOrderModal && (
        <Modal 
          title={`Commande de fruits de mer du ${new Date(editOrderData.pickupDate).toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}`}
          onClose={() => setShowEditOrderModal(false)}
        >
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Modifier votre commande</h3>
            
            <form onSubmit={handleEditOrderSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date de retrait*</label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={editOrderData.pickupDate}
                    onChange={handleEditOrderFormChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 rounded bg-[#333333] border border-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#C4B5A2]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Heure de retrait*</label>
                  <select
                    name="pickupTime"
                    value={editOrderData.pickupTime}
                    onChange={handleEditOrderFormChange}
                    className="w-full p-2 rounded bg-[#333333] border border-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#C4B5A2]"
                    required
                  >
                    {[
                      '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
                      '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
                    ].map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Mode de récupération*</label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isPickup"
                      value="true"
                      checked={editOrderData.isPickup === true}
                      onChange={handleEditOrderFormChange}
                      className="h-4 w-4 mr-2"
                    />
                    <span>À emporter</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isPickup"
                      value="false"
                      checked={editOrderData.isPickup === false}
                      onChange={handleEditOrderFormChange}
                      className="h-4 w-4 mr-2"
                    />
                    <span>Livraison</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Demandes spéciales</label>
                <textarea
                  name="specialRequests"
                  value={editOrderData.specialRequests || ''}
                  onChange={handleEditOrderFormChange}
                  className="w-full p-2 rounded bg-[#333333] border border-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#C4B5A2] min-h-[100px]"
                  placeholder="Instructions particulières pour votre commande..."
                />
              </div>
              
              <div>
                <label className="flex items-center text-gray-300">
                  <input 
                    type="checkbox" 
                    checked={sendNotification}
                    onChange={(e) => setSendNotification(e.target.checked)}
                    className="h-4 w-4 bg-[#3a3a3a] border-[#4a4a4a] rounded mr-2"
                  />
                  M'envoyer un SMS de confirmation
                </label>
              </div>
              
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditOrderModal(false)}
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
