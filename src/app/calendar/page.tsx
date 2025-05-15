"use client"

import React, { useState, useEffect } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { toast } from 'react-hot-toast';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import ReservationList from '@/components/calendar/ReservationList';
import ReservationForm from '@/components/calendar/ReservationForm';
import ExportPhoneButton from '@/components/calendar/ExportPhoneButton';
import { Reservation, ReservationFormData, TimeSlot, ReservationForAdmin } from '@/types/reservation';
import { Calendar as CalendarIcon, CalendarPlus, Users, Package } from 'lucide-react';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import SeafoodOrdersList from '@/components/calendar/SeafoodOrdersList';
import SeafoodOrderForm from '@/components/calendar/SeafoodOrderForm';
import EventList from '@/components/calendar/EventList';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Étendre l'interface Reservation pour notre usage local
interface ExtendedReservation extends Reservation {
  tableNumber?: number;
  isArrived?: boolean;
}

// Type pour les événements spéciaux
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
  reservationIds?: number[]; // IDs des réservations associées pour les événements groupés
  isPickup: boolean;
}

// Interface pour les commandes de fruits de mer
interface SeafoodOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupDate: string;
  pickupTime: string;
  isPickup: boolean;
  plateaux: any[];
  items: any[];
  totalPrice: number;
  specialRequests?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Interface pour les plateaux de fruits de mer
interface Plateau {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

// Interface pour les articles individuels de fruits de mer
interface Item {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState<ReservationForAdmin[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedReservations, setSelectedReservations] = useState<ReservationForAdmin[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<ReservationForAdmin | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newReservation, setNewReservation] = useState<ReservationFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    numberOfGuests: 2,
    time: '',
    specialRequests: ''
  });
  const [newEvent, setNewEvent] = useState<any>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    numberOfGuests: 2,
    time: '',
    eventType: 'special',
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [seafoodOrders, setSeafoodOrders] = useState<SeafoodOrder[]>([]);
  const [showSeafoodOrderForm, setShowSeafoodOrderForm] = useState(false);
  const [editingSeafoodOrder, setEditingSeafoodOrder] = useState<SeafoodOrder | null>(null);
  const [isDeletingSeafoodOrder, setIsDeletingSeafoodOrder] = useState(false);
  const [isSubmittingSeafoodOrder, setIsSubmittingSeafoodOrder] = useState(false);
  const [availablePlateaux, setAvailablePlateaux] = useState<Plateau[]>([
    { id: 1, name: 'Plateau Royal', price: 85.0, quantity: 0 },
    { id: 2, name: 'Plateau Prestige', price: 65.0, quantity: 0 },
    { id: 3, name: 'Plateau Découverte', price: 45.0, quantity: 0 },
    { id: 4, name: 'Plateau Dégustation', price: 35.0, quantity: 0 }
  ]);
  const [availableItems, setAvailableItems] = useState<Item[]>([
    { id: 1, name: 'Huîtres (6 pièces)', price: 12.0, quantity: 0 },
    { id: 2, name: 'Crevettes (200g)', price: 8.0, quantity: 0 },
    { id: 3, name: 'Bulots (200g)', price: 6.0, quantity: 0 },
    { id: 4, name: 'Langoustines (4 pièces)', price: 14.0, quantity: 0 },
    { id: 5, name: 'Tourteau entier', price: 18.0, quantity: 0 },
    { id: 6, name: 'Homard (prix au kg)', price: 45.0, quantity: 0 }
  ]);

  useEffect(() => {
    fetchReservations();
    fetchEvents();
    fetchSeafoodOrders();
  }, []);

  // Effet qui se déclenche lorsque la date courante change
  useEffect(() => {
    fetchReservations();
    fetchEvents();
    fetchSeafoodOrders();
  }, [currentDate]);

  // Effet qui se déclenche lorsque selectedDate change
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
       (`📅 La date sélectionnée a changé: ${date.toLocaleDateString()}`);
      
      // Récupérer les données fraîches
      fetchReservations();
      fetchEvents();
      fetchSeafoodOrders();
      
      // Mise à jour avec un court délai pour s'assurer que les données sont chargées
      setTimeout(() => {
        updateDateData(date);
      }, 500);
    }
  }, [selectedDate]);

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${API_URL}/reservations`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des réservations');
      }
      const data = await response.json();
      
      // Charger d'abord les données de l'API
      let processedReservations = data as ReservationForAdmin[];
      
      // Essayer de charger les états administrateur depuis localStorage comme fallback
      processedReservations = loadReservationStatusFromLocalStorage(processedReservations);
      
      setReservations(processedReservations);

      if (selectedDate) {
        updateSelectedReservations(selectedDate);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Fonction pour récupérer les événements
  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`);
      if (!response.ok) {
        // Si l'API n'est pas encore implémentée, on utilise un tableau vide
        console.log('API événements non disponible, initialisation avec un tableau vide');
        setEvents([]);
        return;
      }
      
      const data = await response.json();
      setEvents(data);

      if (selectedDate) {
        updateSelectedEvents(selectedDate);
      }
    } catch (error) {
      console.error('Erreur:', error);
      // Initialiser avec un tableau vide en cas d'erreur
      setEvents([]);
    }
  };

  // Fonction pour récupérer les commandes de fruits de mer
  const fetchSeafoodOrders = async () => {
    try {
      // Obtenir le token d'authentification
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn("Pas de token d'authentification pour les commandes de fruits de mer");
        return;
      }
      
      const response = await fetch(`${API_URL}/seafood-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erreur API (${response.status}): ${errorText}`);
        throw new Error(`Erreur lors du chargement des commandes de fruits de mer: ${response.status}`);
      }
      
      const data = await response.json();
      setSeafoodOrders(data);

      if (selectedDate) {
        updateDateData(selectedDate);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes de fruits de mer:', error);
    }
  };

  // Filtrer les commandes de fruits de mer pour cette date
  const filterSeafoodOrdersByDate = (date: string, orders: SeafoodOrder[]) => {
    // Extraire le jour, mois, année de la date de filtrage
    const [filterYear, filterMonth, filterDay] = date.split('-').map(Number);
    
    const formattedOrders = orders.filter(order => {
      try {
        // Méthode 1: Correspondance exacte des chaînes
        if (typeof order.pickupDate === 'string' && order.pickupDate === date) {
          return true;
        }
        
        // Méthode 2: Extraire le jour et comparer uniquement le jour
        // C'est la méthode la plus simple et la plus robuste
        let orderDay: number | null = null;
        
        // Si c'est une string au format "YYYY-MM-DD" ou "YYYY-MM-DDT..."
        if (typeof order.pickupDate === 'string' && order.pickupDate.includes('-')) {
          const parts = order.pickupDate.split('-');
          if (parts.length >= 3) {
            // Le jour est la troisième partie, mais il peut contenir un 'T'
            orderDay = parseInt(parts[2].split('T')[0]);
            
            // Si on a aussi besoin de vérifier le mois et l'année
            const orderMonth = parseInt(parts[1]);
            const orderYear = parseInt(parts[0]);
            
            // Vérifier la correspondance complète (peut être décommentée si nécessaire)
            if (orderDay === filterDay && orderMonth === filterMonth && orderYear === filterYear) {
              return true;
            }
          }
        }
        // Si c'est au format DD/MM/YYYY
        else if (typeof order.pickupDate === 'string' && order.pickupDate.includes('/')) {
          const parts = order.pickupDate.split('/');
          if (parts.length === 3) {
            // Le format est probablement DD/MM/YYYY
            orderDay = parseInt(parts[0]);
            
            // Si on a aussi besoin de vérifier le mois et l'année
            const orderMonth = parseInt(parts[1]);
            const orderYear = parseInt(parts[2]);
            
            // Vérifier la correspondance complète
            if (orderDay === filterDay && orderMonth === filterMonth && orderYear === filterYear) {
              return true;
            }
          }
        }
        // Si c'est un objet Date ou peut être converti en Date
        else {
          try {
            const orderDate = new Date(order.pickupDate);
            if (!isNaN(orderDate.getTime())) {
              orderDay = orderDate.getDate();
              
              // Si on a aussi besoin de vérifier le mois et l'année
              const orderMonth = orderDate.getMonth() + 1;  // +1 car getMonth() retourne 0-11
              const orderYear = orderDate.getFullYear();
              
              // Vérifier la correspondance complète
              if (orderDay === filterDay && orderMonth === filterMonth && orderYear === filterYear) {
                return true;
              }
            }
          } catch (e) {
            console.error(`Erreur lors de la conversion de la date pour la commande ${order.id}:`, e);
          }
        }
        
        // Solution simple de secours: comparer UNIQUEMENT les jours
        if (orderDay === filterDay) {
          return true;
        }
        
        return false;
      } catch (error) {
        console.error(`Erreur de format de date pour la commande ${order.id}:`, error);
        return false;
      }
    });
    
    // Si aucune commande n'est trouvée avec la date exacte, essayer une version simplifiée
    // basée uniquement sur le jour
    if (formattedOrders.length === 0) {
      const dayOnlyOrders = orders.filter(order => {
        try {
          let orderDay = null;
          
          // Extraire le jour de différents formats possibles
          if (typeof order.pickupDate === 'string') {
            if (order.pickupDate.includes('-')) {
              // Format YYYY-MM-DD
              const parts = order.pickupDate.split('-');
              if (parts.length >= 3) {
                orderDay = parseInt(parts[2].split('T')[0]);
              }
            } else if (order.pickupDate.includes('/')) {
              // Format DD/MM/YYYY
              orderDay = parseInt(order.pickupDate.split('/')[0]);
            }
          }
          
          // Essayer de convertir en Date si ce n'est pas déjà fait
          if (orderDay === null) {
            const orderDate = new Date(order.pickupDate);
            if (!isNaN(orderDate.getTime())) {
              orderDay = orderDate.getDate();
            }
          }
          
          return orderDay === filterDay;
        } catch (error) {
          return false;
        }
      });
      
      // Si on trouve des commandes avec le filtrage par jour uniquement, les utiliser
      if (dayOnlyOrders.length > 0) {
        return dayOnlyOrders;
      }
    }
    
    return formattedOrders;
  };

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Ajouter une fonction pour regrouper les réservations d'événements
  const groupEventReservations = (reservations: ExtendedReservation[]): Event[] => {
    const groupedEvents: Event[] = [];
    const eventGroups: { [key: string]: ExtendedReservation[] } = {};
    
    // Identifier les réservations d'événements et les regrouper par identifiant
    reservations.forEach(res => {
      if (res.specialRequests && res.specialRequests.includes('ÉVÉNEMENT')) {
        // Extraire l'identifiant de l'événement (format: "ÉVÉNEMENT #X/Y (Z pers. total)")
        const eventIdMatch = res.specialRequests.match(/ÉVÉNEMENT #\d+\/\d+ \((\d+) pers\. total\)/);
        const eventTypeMatch = res.specialRequests.match(/Type: (special|private|public)/);
        
        if (eventIdMatch) {
          const totalPersons = eventIdMatch[1];
          const eventType = eventTypeMatch ? eventTypeMatch[1] : 'special';
          const eventKey = `${res.customerName}-${res.reservationDateTime}-${totalPersons}`;
          
          if (!eventGroups[eventKey]) {
            eventGroups[eventKey] = [];
          }
          
          eventGroups[eventKey].push(res);
        }
      }
    });
    
    // Convertir chaque groupe en un seul événement
    Object.entries(eventGroups).forEach(([key, group]) => {
      if (group.length > 0) {
        const firstRes = group[0];
        // Extraire les informations du premier élément du groupe
        const eventIdMatch = firstRes.specialRequests?.match(/ÉVÉNEMENT #\d+\/\d+ \((\d+) pers\. total\)/);
        const eventTypeMatch = firstRes.specialRequests?.match(/Type: (special|private|public)/);
        const detailsMatch = firstRes.specialRequests?.match(/- (.*)/);
        
        const totalPersons = eventIdMatch ? parseInt(eventIdMatch[1]) : group.reduce((sum, res) => sum + res.numberOfGuests, 0);
        const eventType = eventTypeMatch ? eventTypeMatch[1] as 'special' | 'private' | 'public' : 'special';
        const details = detailsMatch ? detailsMatch[1] : '';
        
        const resDate = new Date(firstRes.reservationDateTime);
        const hours = resDate.getHours().toString().padStart(2, '0');
        const minutes = resDate.getMinutes().toString().padStart(2, '0');
        
        // Créer un événement unique pour ce groupe
        groupedEvents.push({
          id: firstRes.id,
          title: `Événement ${eventType === 'private' ? 'privé' : 'spécial'} (${totalPersons} pers.)`,
          description: details,
          eventDate: `${resDate.getFullYear()}-${String(resDate.getMonth() + 1).padStart(2, '0')}-${String(resDate.getDate()).padStart(2, '0')}`,
          startTime: `${hours}:${minutes}`,
          endTime: '',
          maxGuests: totalPersons,
          type: eventType,
          color: eventType === 'private' ? "#4CAF50" : "#2196F3",
          customerName: firstRes.customerName,
          customerEmail: firstRes.customerEmail,
          customerPhone: firstRes.customerPhone,
          reservationIds: group.map(r => r.id),
          isPickup: false
        });
      }
    });
    
    return groupedEvents;
  };

  // Fonction pour mettre à jour toutes les données d'une date
  const updateDateData = (date: Date) => {
    // Filtrer pour ce jour spécifique
    const dayReservations = reservations.filter(res => {
      const resDate = new Date(res.reservationDateTime);
      return resDate.toDateString() === date.toDateString();
    });
    
    // Filtrer pour ne garder que les réservations ordinaires (qui ne font pas partie d'un événement)
    const normalReservations = dayReservations.filter(res => 
      !(res.specialRequests && (
        res.specialRequests.includes('ÉVÉNEMENT') || 
        res.specialRequests.includes('Événement')
      ))
    );
    
    // Mettre à jour les réservations normales
    setSelectedReservations(normalReservations);
    
    // Mettre à jour les événements et commandes de fruits de mer
    updateDateEvents(date, dayReservations);
  };

  const updateDateEvents = (date: Date, dayReservations: ExtendedReservation[]) => {
    // Format de la date YYYY-MM-DD pour correspondre au format stocké dans les événements
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // Filtrer les événements explicites
    const explicitDayEvents = events.filter(event => event.eventDate === formattedDate);
    
    // Ajouter les événements implicites (depuis les réservations)
    const eventReservations = groupEventReservations(dayReservations);
    
    // Filtrer les commandes de fruits de mer pour cette date
    const daySeafoodOrders = filterSeafoodOrdersByDate(formattedDate, seafoodOrders);
    
    // Nous ne convertissons plus les commandes de fruits de mer en événements pour l'affichage
    // Nous les traitons séparément plus bas dans l'interface
    
    // Combiner seulement les événements explicites et implicites (sans les fruits de mer)
    const allEvents = [...explicitDayEvents, ...eventReservations];
    
    setSelectedEvents(allEvents);
  };

  const updateSelectedReservations = (date: Date) => {
    // Mettre à jour la date sélectionnée
    setSelectedDate(date);
  };

  const updateSelectedEvents = (date: Date, dayReservations?: ExtendedReservation[]) => {
    // Format de la date YYYY-MM-DD pour correspondre au format stocké dans les événements
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // Filtrer les événements explicites
    const explicitDayEvents = events.filter(event => event.eventDate === formattedDate);
    
    // Ajouter les événements implicites (depuis les réservations)
    const reservationsForDate = dayReservations || selectedReservations;
    const eventReservations = groupEventReservations(reservationsForDate);
    
    // Filtrer les commandes de fruits de mer pour cette date
    const daySeafoodOrders = filterSeafoodOrdersByDate(formattedDate, seafoodOrders);
    
    // Nous ne convertissons plus les commandes de fruits de mer en événements pour l'affichage
    // Nous les traitons séparément plus bas dans l'interface
    
    // Combiner seulement les événements explicites et implicites (sans les fruits de mer)
    const allEvents = [...explicitDayEvents, ...eventReservations];
    
    setSelectedEvents(allEvents);
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

  const startEditReservation = (reservation: ExtendedReservation) => {
    console.log('startEditReservation appelé avec:', reservation);
    if (!reservation) {
      console.error('Réservation invalide:', reservation);
      return;
    }
    
    try {
      // Forcer la mise à jour de l'état en deux étapes
      // D'abord, définir les données
      setEditingReservation(reservation);
      const reservationDate = new Date(reservation.reservationDateTime);
      console.log('Date de réservation:', reservationDate);
      
      const formattedTime = `${reservationDate.getHours().toString().padStart(2, '0')}:${reservationDate.getMinutes().toString().padStart(2, '0')}`;
      console.log('Heure formatée:', formattedTime);
      
      const newReservationData = {
        customerName: reservation.customerName,
        customerEmail: reservation.customerEmail || '',
        customerPhone: reservation.customerPhone,
        numberOfGuests: reservation.numberOfGuests,
        time: formattedTime,
        specialRequests: reservation.specialRequests || ''
      };
      
      // Mise à jour synchrone
      setNewReservation(newReservationData);
      
      // Forcer la fermeture du formulaire d'événement
      setShowAddEventForm(false);
      
      // Forcer l'ouverture du formulaire avec un délai pour s'assurer que les états sont mis à jour
      setTimeout(() => {
        console.log('Affichage forcé du formulaire...');
        setShowAddForm(true);
      }, 100);
      
    } catch (error) {
      console.error('Erreur lors de la préparation de la modification:', error);
    }
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
      
      let result: ExtendedReservation;
      
      if (editingReservation) {
        console.log('Mise à jour de la réservation:', editingReservation.id);
        
        // Obtenir le token d'authentification
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error("❌ Pas de token d'authentification");
          setSubmitMessage({ type: 'error', text: 'Vous devez être connecté pour modifier une réservation' });
          setIsSubmitting(false);
          return;
        }
        
        const updateResponse = await fetch(`${API_URL}/reservations/${editingReservation.id}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(reservationData)
        });
        
        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          console.error('Réponse API d\'erreur:', errorText);
          throw new Error(`Erreur lors de la mise à jour de la réservation: ${updateResponse.status} ${errorText}`);
        }
        
        result = await updateResponse.json();
        console.log('Réservation mise à jour avec succès:', result);
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

  // Gestionnaire pour les changements dans le formulaire d'événement
  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent((prev: any) => ({
      ...prev,
      [name]: name === 'numberOfGuests' ? parseInt(value) : value
    }));
  };

  // Soumission du formulaire d'événement
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast.error('Veuillez sélectionner une date');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // S'assurer que la date est correctement formatée en YYYY-MM-DD
      const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      
      // Nombre total d'invités
      const totalGuests = parseInt(newEvent.numberOfGuests);
      
      // Si c'est un grand groupe (événement), on le divise en plusieurs réservations de 20 personnes max
      const isLargeGroup = totalGuests > 20;
      const numReservationsNeeded = isLargeGroup ? Math.ceil(totalGuests / 20) : 1;
      
       (`Création d'un événement avec ${totalGuests} personnes, nécessitant ${numReservationsNeeded} réservations`);
      
      // Réservation principale avec les détails complets
      const mainEventData = {
        customerName: newEvent.customerName,
        customerEmail: newEvent.customerEmail,
        customerPhone: newEvent.customerPhone,
        numberOfGuests: isLargeGroup ? 20 : totalGuests, // Max 20 pour la première réservation
        reservationDateTime: `${formattedDate}T${newEvent.time}:00.000Z`,
        specialRequests: `ÉVÉNEMENT #1/${numReservationsNeeded} (${totalGuests} pers. total) - Type: ${newEvent.eventType} - ${newEvent.specialRequests || ""}`,
        createdAt: new Date().toISOString(),
        isEvent: true // Ajouter le flag isEvent
      };
      
      let mainResult: any;
      
      if (editingEvent) {
        // Mettre à jour l'événement existant
        const response = await fetch(`${API_URL}/reservations/${editingEvent.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mainEventData)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erreur API:', errorText);
          throw new Error(`Erreur lors de la mise à jour de l'événement: ${response.status} ${errorText}`);
        }
        
        mainResult = await response.json();
        
      } else {
        // Créer l'événement principal
        const response = await fetch(`${API_URL}/reservations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mainEventData)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erreur API:', errorText);
          throw new Error(`Erreur lors de la création de l'événement: ${response.status} ${errorText}`);
        }
        
        mainResult = await response.json();
        
        // Si c'est un grand groupe, créer des réservations additionnelles
        if (isLargeGroup && numReservationsNeeded > 1) {
          const remainingGuests = totalGuests - 20;
          
          for (let i = 1; i < numReservationsNeeded; i++) {
            const guestsForThisReservation = Math.min(20, remainingGuests - (i-1) * 20);
            
            if (guestsForThisReservation <= 0) break;
            
            const additionalEventData = {
              customerName: newEvent.customerName,
              customerEmail: newEvent.customerEmail,
              customerPhone: newEvent.customerPhone,
              numberOfGuests: guestsForThisReservation,
              reservationDateTime: `${formattedDate}T${newEvent.time}:00.000Z`,
              specialRequests: `ÉVÉNEMENT #${i+1}/${numReservationsNeeded} (${totalGuests} pers. total) - Type: ${newEvent.eventType}`,
              createdAt: new Date().toISOString(),
              isEvent: true // Ajouter le flag isEvent
            };
            
            try {
              const additionalResponse = await fetch(`${API_URL}/reservations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(additionalEventData)
              });
              
              if (!additionalResponse.ok) {
                console.warn(`Avertissement: Impossible de créer la réservation additionnelle #${i+1}`);
                continue; // On continue même si une des réservations additionnelles échoue
              }
              
              const additionalResult = await additionalResponse.json();
            } catch (error) {
              console.warn(`Erreur pour la réservation additionnelle #${i+1}:`, error);
              // On ne fait pas échouer tout le processus pour une réservation additionnelle
            }
          }
        }
      }
      
      // Transformer le résultat en format d'événement pour l'affichage
      const createdEvent: Event = {
        id: mainResult.id,
        title: `${newEvent.eventType === 'private' ? 'Événement privé' : 'Événement spécial'} (${totalGuests} pers.)`,
        description: newEvent.specialRequests || "",
        eventDate: formattedDate,
        startTime: newEvent.time,
        endTime: "",
        maxGuests: totalGuests,
        type: newEvent.eventType as 'special' | 'private' | 'public' | 'seafood',
        color: newEvent.eventType === 'private' ? "#4CAF50" : "#2196F3",
        customerName: newEvent.customerName,
        customerEmail: newEvent.customerEmail,
        customerPhone: newEvent.customerPhone,
        reservationIds: [],
        isPickup: false
      };
      
      if (editingEvent) {
        setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? createdEvent : ev));
        setSelectedEvents(prev => prev.map(ev => ev.id === editingEvent.id ? createdEvent : ev));
        toast.success('Événement mis à jour avec succès');
      } else {
        setEvents(prev => [...prev, createdEvent]);
        setSelectedEvents(prev => [...prev, createdEvent]);
        toast.success('Événement ajouté avec succès');
      }
      
      // Réinitialiser le formulaire
      setNewEvent({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        numberOfGuests: 2,
        time: '',
        eventType: 'special',
        specialRequests: ''
      });
      
      setEditingEvent(null);
      setShowAddEventForm(false);

    } catch (error) {
      console.error('Erreur:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'lors de l\'opération'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Supprimer un événement
  const deleteEvent = async (eventId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        const eventToDelete = selectedEvents.find(ev => ev.id === eventId);
        
        if (!eventToDelete) {
          throw new Error('Événement non trouvé');
        }
        
        // Si c'est un événement groupé, supprimer toutes les réservations associées
        if (eventToDelete.reservationIds && eventToDelete.reservationIds.length > 0) {
           (`Suppression de l'événement groupé avec ${eventToDelete.reservationIds.length} réservations associées`);
          
          // Supprimer chaque réservation associée
          for (const resId of eventToDelete.reservationIds) {
            try {
              const response = await fetch(`${API_URL}/reservations/${resId}`, {
                method: 'DELETE',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              });
              
              if (!response.ok) {
                console.warn(`Avertissement: Impossible de supprimer la réservation associée #${resId}`);
              } else {
                 (`Réservation associée #${resId} supprimée avec succès`);
              }
            } catch (error) {
              console.warn(`Erreur lors de la suppression de la réservation associée #${resId}:`, error);
            }
          }
          
          // Mettre à jour l'état local après la suppression
          setReservations(prev => prev.filter(res => !eventToDelete.reservationIds?.includes(res.id)));
        } else {
          // C'est un événement standard, le supprimer normalement
          const response = await fetch(`${API_URL}/events/${eventId}`, {
            method: 'DELETE',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (!response.ok) {
            console.warn(`Avertissement: Impossible de supprimer l'événement #${eventId}`);
          }
        }
        
        // Mettre à jour l'état local des événements
        setEvents(prev => prev.filter(ev => ev.id !== eventId));
        setSelectedEvents(prev => prev.filter(ev => ev.id !== eventId));
        toast.success('Événement supprimé avec succès');
        
        // Rafraîchir complètement les données
        fetchReservations();
        
        // Au bout de 100ms, rafraîchir à nouveau pour s'assurer que tout est à jour
        setTimeout(() => {
          fetchReservations();
          if (selectedDate) {
            updateSelectedReservations(selectedDate);
          }
        }, 100);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors de la suppression de l\'événement');
      }
    }
  };

  // Commencer à modifier un événement
  const startEditEvent = (event: Event) => {
    setEditingEvent(event);
    
    // Si c'est un événement groupé (avec réservations associées)
    if (event.reservationIds && event.reservationIds.length > 0) {
      // Trouver les réservations associées à cet événement
      const eventReservations = reservations.filter(res => 
        event.reservationIds?.includes(res.id)
      );
      
      if (eventReservations.length > 0) {
         (`Modification d'un événement groupé avec ${eventReservations.length} réservations associées`);
      }
    }
    
    setNewEvent({
      customerName: event.customerName || '',
      customerEmail: event.customerEmail || '',
      customerPhone: event.customerPhone || '',
      numberOfGuests: event.maxGuests || 2,
      time: event.startTime || '',
      eventType: event.type,
      specialRequests: event.description || ''
    });
    setShowAddEventForm(true);
  };

  // Effet pour surveiller le changement de formulaire
  useEffect(() => {
    console.log('État des formulaires:', { showAddForm, showAddEventForm, editingReservation });
  }, [showAddForm, showAddEventForm, editingReservation]);

  // Modifier la fonction handleTableUpdate pour envoyer les mises à jour à l'API
  const handleTableUpdate = async (id: number, tableNumber: number, isArrived: boolean) => {
    try {
      // Obtenir le token d'authentification
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error("❌ Aucun token d'authentification trouvé");
        toast.error('Vous devez être connecté pour mettre à jour une réservation');
        return;
      }
      
      // Mettre à jour d'abord l'état local pour une expérience utilisateur réactive
      setReservations(prevReservations => {
        const updatedReservations = prevReservations.map(res => {
          if (res.id === id) {
            return { ...res, tableNumber, isArrived };
          }
          return res;
        });
        return updatedReservations;
      });
      
      setSelectedReservations(prevSelectedReservations => {
        const updatedSelected = prevSelectedReservations.map(res => {
          if (res.id === id) {
            return { ...res, tableNumber, isArrived };
          }
          return res;
        });
        return updatedSelected;
      });
      
      // Préparer les données pour la mise à jour API
      const updateData: Partial<ReservationForAdmin> = {
        tableNumber,
        isArrived
      };
      
      console.log(`Envoi des données à l'API: ${JSON.stringify(updateData)}`);
      
      // Effectuer la requête API pour persister les changements
      const response = await fetch(`${API_URL}/admin/reservations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        console.error(`❌ Erreur API (${response.status}): La réservation a été mise à jour localement mais pas sur le serveur`);
        toast.error('Mise à jour du statut sauvegardée localement uniquement');
        
        // Utiliser localStorage comme fallback si l'API échoue
        saveReservationStatusToLocalStorage([...reservations]);
        return;
      }
      
      // Notification de succès pour l'utilisateur
      toast.success(`Table ${tableNumber} ${isArrived ? 'arrivée' : 'non arrivée'}`);
      
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour:", error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Impossible de mettre à jour la réservation'}`);
      
      // Utiliser localStorage comme fallback en cas d'erreur
      saveReservationStatusToLocalStorage([...reservations]);
    }
  };

  // Fonction pour sauvegarder les états des réservations dans localStorage en cas de problème avec l'API
  const saveReservationStatusToLocalStorage = (reservations: ReservationForAdmin[]) => {
    try {
      // Créer un objet qui ne contient que les IDs, tableNumber et isArrived
      const statusMap = reservations.reduce((acc, res) => {
        if (res.tableNumber || res.isArrived) {
          acc[res.id] = {
            tableNumber: res.tableNumber,
            isArrived: res.isArrived
          };
        }
        return acc;
      }, {} as Record<number, { tableNumber?: number; isArrived?: boolean }>);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('reservation-status', JSON.stringify(statusMap));
      console.log('États des réservations sauvegardés dans localStorage:', statusMap);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans localStorage:', error);
    }
  };

  // Fonction pour charger les états des réservations depuis localStorage en cas de problème avec l'API
  const loadReservationStatusFromLocalStorage = (reservations: ReservationForAdmin[]): ReservationForAdmin[] => {
    try {
      const savedStatusJSON = localStorage.getItem('reservation-status');
      if (!savedStatusJSON) return reservations;
      
      const savedStatus = JSON.parse(savedStatusJSON) as Record<string, { tableNumber?: number; isArrived?: boolean }>;
      console.log('États des réservations chargés depuis localStorage:', savedStatus);
      
      // Appliquer les états sauvegardés aux réservations
      return reservations.map(res => {
        const savedReservation = savedStatus[res.id];
        if (savedReservation) {
          return {
            ...res,
            tableNumber: savedReservation.tableNumber,
            isArrived: savedReservation.isArrived
          };
        }
        return res;
      });
    } catch (error) {
      console.error('Erreur lors du chargement depuis localStorage:', error);
      return reservations;
    }
  };

  // Ajouter les trois fonctions pour gérer les commandes de fruits de mer
  const startEditSeafoodOrder = (order: SeafoodOrder) => {
    setEditingSeafoodOrder(order);
    setShowSeafoodOrderForm(true);
    setShowAddForm(false);
    setShowAddEventForm(false);
  };

  const deleteSeafoodOrder = async (orderId: string) => {
    try {
      setIsDeletingSeafoodOrder(true);
      
      // Obtenir le token d'authentification
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error("❌ Pas de token d'authentification");
        toast.error('Vous devez être connecté pour supprimer une commande');
        setIsDeletingSeafoodOrder(false);
        return;
      }
      
      const response = await fetch(`${API_URL}/seafood-orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Réponse API d\'erreur:', errorText);
        throw new Error(`Erreur lors de la suppression de la commande: ${response.status} ${errorText}`);
      }
      
      // Mettre à jour l'état local
      setSeafoodOrders(prev => prev.filter(order => order.id !== orderId));
      toast.success('Commande supprimée avec succès');
      
      // Rafraîchir les données
      fetchSeafoodOrders();
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'lors de la suppression'}`);
    } finally {
      setIsDeletingSeafoodOrder(false);
    }
  };

  const updateSeafoodOrderStatus = async (orderId: string, status: string) => {
    try {
      // Obtenir le token d'authentification
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error("❌ Pas de token d'authentification");
        toast.error('Vous devez être connecté pour mettre à jour une commande');
        return;
      }
      
      const response = await fetch(`${API_URL}/seafood-orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Réponse API d\'erreur:', errorText);
        throw new Error(`Erreur lors de la mise à jour du statut: ${response.status} ${errorText}`);
      }
      
      const updatedOrder = await response.json();
      
      // Mettre à jour l'état local
      setSeafoodOrders(prev => 
        prev.map(order => order.id === orderId ? updatedOrder : order)
      );
      
      toast.success(`Statut mis à jour: ${status}`);
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'lors de la mise à jour'}`);
    }
  };

  const submitSeafoodOrderForm = async (orderData: SeafoodOrder) => {
    try {
      setIsSubmittingSeafoodOrder(true);
      
      // Obtenir le token d'authentification
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error("❌ Pas de token d'authentification");
        toast.error('Vous devez être connecté pour gérer les commandes');
        setIsSubmittingSeafoodOrder(false);
        return;
      }
      
      // Déterminer si c'est une création ou une mise à jour
      const isEditing = !!editingSeafoodOrder;
      const url = isEditing 
        ? `${API_URL}/seafood-orders/${orderData.id}` 
        : `${API_URL}/seafood-orders`;
      
      const method = isEditing ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Réponse API d\'erreur:', errorText);
        throw new Error(`Erreur lors de l'opération: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      
      // Mettre à jour l'état local
      if (isEditing) {
        setSeafoodOrders(prev => 
          prev.map(order => order.id === result.id ? result : order)
        );
        toast.success('Commande mise à jour avec succès');
      } else {
        setSeafoodOrders(prev => [...prev, result]);
        toast.success('Commande créée avec succès');
      }
      
      // Réinitialiser le formulaire
      setEditingSeafoodOrder(null);
      setShowSeafoodOrderForm(false);
      
      // Rafraîchir les données
      fetchSeafoodOrders();
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'lors de l\'opération'}`);
    } finally {
      setIsSubmittingSeafoodOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mt-40 mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Calendrier des réservations</h1>
          <div className="flex space-x-4">
            <ExportPhoneButton reservations={reservations} />
          </div>
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
            events={events}
            seafoodOrders={seafoodOrders}
            onSelectDate={updateSelectedReservations}
          />
        </div>
        
        {selectedDate && (
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#C4B5A2]">
                {selectedDate.toLocaleDateString('fr-FR', { dateStyle: 'long' })}
              </h3>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddForm(!showAddForm);
                    setShowAddEventForm(false);
                    setShowSeafoodOrderForm(false);
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
                  className="px-4 py-2 bg-[#C4B5A2] text-black rounded-lg font-medium hover:bg-[#d8c7b2] transition-colors flex items-center gap-2"
                >
                  <CalendarIcon className="w-4 h-4" />
                  {showAddForm ? 'Annuler' : 'Réservation'}
                </button>

                <button
                  onClick={() => {
                    setShowAddEventForm(!showAddEventForm);
                    setShowAddForm(false);
                    setShowSeafoodOrderForm(false);
                    setEditingEvent(null);
                    setNewEvent({
                      customerName: '',
                      customerEmail: '',
                      customerPhone: '',
                      numberOfGuests: 2,
                      time: '',
                      eventType: 'special',
                      specialRequests: ''
                    });
                  }}
                  className="px-4 py-2 bg-[#2196F3] text-black rounded-lg font-medium hover:bg-[#64B5F6] transition-colors flex items-center gap-2"
                >
                  <CalendarPlus className="w-4 h-4" />
                  {showAddEventForm ? 'Annuler' : 'Événement'}
                </button>
                
                <button
                  onClick={() => {
                    setShowSeafoodOrderForm(!showSeafoodOrderForm);
                    setShowAddForm(false);
                    setShowAddEventForm(false);
                    setEditingSeafoodOrder(null);
                  }}
                  className="px-4 py-2 bg-[#FF9370] text-black rounded-lg font-medium hover:bg-[#FF8060] transition-colors flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  {showSeafoodOrderForm ? 'Annuler' : 'Fruits de mer'}
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

            {showAddEventForm && (
              <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6 border border-[#2196F3]/30">
                <h4 className="text-lg font-medium mb-4 text-[#2196F3]">
                  {editingEvent ? 'Modifier l\'événement' : 'Ajouter un événement'}
                </h4>
                <form onSubmit={handleEventSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom complet*</label>
                    <input
                      type="text"
                      name="customerName"
                      value={newEvent.customerName}
                      onChange={handleEventInputChange}
                      className="w-full p-2 bg-[#2a2a2a] border border-[#444] rounded focus:outline-none focus:border-[#2196F3]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email*</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={newEvent.customerEmail}
                      onChange={handleEventInputChange}
                      className="w-full p-2 bg-[#2a2a2a] border border-[#444] rounded focus:outline-none focus:border-[#2196F3]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone*</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={newEvent.customerPhone}
                      onChange={handleEventInputChange}
                      className="w-full p-2 bg-[#2a2a2a] border border-[#444] rounded focus:outline-none focus:border-[#2196F3]"
                      required
                      placeholder="07 09 08 07 06"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre de personnes*</label>
                    <input
                      type="number"
                      name="numberOfGuests"
                      value={newEvent.numberOfGuests}
                      onChange={handleEventInputChange}
                      min="1"
                      max="500"
                      className="w-full p-2 bg-[#2a2a2a] border border-[#444] rounded focus:outline-none focus:border-[#2196F3]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Heure*</label>
                    <input
                      type="time"
                      name="time"
                      value={newEvent.time}
                      onChange={handleEventInputChange}
                      className="w-full p-2 bg-[#2a2a2a] border border-[#444] rounded focus:outline-none focus:border-[#2196F3]"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Type d'événement</label>
                    <select
                      name="eventType"
                      value={newEvent.eventType || 'special'}
                      onChange={handleEventInputChange}
                      className="w-full p-2 bg-[#2a2a2a] border border-[#444] rounded focus:outline-none focus:border-[#2196F3]"
                    >
                      <option value="special">Événement spécial</option>
                      <option value="private">Événement privé</option>
                      <option value="public">Événement public</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Détails et demandes spéciales</label>
                    <textarea
                      name="specialRequests"
                      value={newEvent.specialRequests || ''}
                      onChange={handleEventInputChange}
                      rows={4}
                      className="w-full p-2 bg-[#2a2a2a] border border-[#444] rounded focus:outline-none focus:border-[#2196F3]"
                      placeholder="Détails sur votre événement, menu spécial, arrangement des tables, etc."
                    />
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-[#2196F3] text-white rounded-lg font-medium hover:bg-[#64B5F6] transition-colors"
                    >
                      {isSubmitting 
                        ? 'Enregistrement...' 
                        : (editingEvent ? 'Mettre à jour' : 'Ajouter l\'événement')
                      }
                    </button>
                  </div>
                </form>
              </div>
            )}

            {showSeafoodOrderForm && (
              <SeafoodOrderForm
                order={editingSeafoodOrder}
                onSubmit={submitSeafoodOrderForm}
                onCancel={() => {
                  setShowSeafoodOrderForm(false);
                  setEditingSeafoodOrder(null);
                }}
                isSubmitting={isSubmittingSeafoodOrder}
                availablePlateaux={availablePlateaux}
                availableItems={availableItems}
              />
            )}

            {/* Liste des événements du jour */}
            {selectedEvents.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4 text-[#2196F3] flex items-center">
                  <CalendarPlus className="w-5 h-5 mr-2" />
                  Événements
                </h4>
                <div className="space-y-3">
                  {selectedEvents.map(event => (
                    <div 
                      key={event.id} 
                      className="bg-[#1a1a1a] rounded-lg p-4 border-l-4"
                      style={{ borderLeftColor: event.color }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-white">{event.title}</h5>
                          <p className="text-sm text-gray-400">
                            {event.startTime} - {
                              event.type === 'seafood' && 'isPickup' in event 
                                ? (event.isPickup ? 'À emporter' : 'Sur place') 
                                : event.endTime
                            }
                          </p>
                          {event.description && (
                            <p className="text-sm text-gray-300 mt-2">{event.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {event.type !== 'seafood' && (
                            <>
                              <button 
                                onClick={() => startEditEvent(event)}
                                className="text-[#2196F3] hover:text-[#64B5F6]"
                              >
                                Modifier
                              </button>
                              <button 
                                onClick={() => deleteEvent(event.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                Supprimer
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center mt-2">
                        <Users className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-400">
                          {event.type === 'seafood' 
                            ? `${event.maxGuests} articles` 
                            : `${event.maxGuests} personnes max.`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Liste des réservations */}
            <h4 className="text-lg font-medium mb-4 text-[#C4B5A2] flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Réservations
            </h4>
            <ReservationList
              reservations={selectedReservations}
              onEdit={startEditReservation}
              onDelete={deleteReservation}
              onTableUpdate={handleTableUpdate}
              isDeleting={isDeleting}
            />

            {/* Section des événements */}
            <div className="mt-8 pt-6 border-t border-[#333]">
              <h4 className="text-lg font-medium mb-4 text-[#2196F3] flex items-center">
                <CalendarPlus className="w-5 h-5 mr-2" />
                Événements
              </h4>
              {selectedEvents.filter(event => event.type !== 'seafood').length > 0 ? (
                <EventList
                  events={selectedEvents.filter(event => event.type !== 'seafood')}
                  onEdit={startEditEvent}
                  onDelete={deleteEvent}
                  isDeleting={isDeleting}
                />
              ) : (
                <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#2196F3]/20 text-center">
                  <p className="text-gray-400">Aucun événement pour cette date</p>
                </div>
              )}
            </div>

            {/* Section des commandes de fruits de mer */}
            <div className="mt-8 pt-6 border-t border-[#333]">
              <h4 className="text-lg font-medium mb-4 text-[#FF9370] flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Commandes de fruits de mer
              </h4>
              <SeafoodOrdersList
                orders={seafoodOrders.filter(order => {
                  // Formater la date sélectionnée au format YYYY-MM-DD pour la comparaison
                  const formattedSelectedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
                  // Comparer les dates (jour uniquement)
                  return filterSeafoodOrdersByDate(formattedSelectedDate, [order]).length > 0;
                })}
                onEdit={startEditSeafoodOrder}
                onDelete={deleteSeafoodOrder}
                onStatusUpdate={updateSeafoodOrderStatus}
                isDeleting={isDeletingSeafoodOrder}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}