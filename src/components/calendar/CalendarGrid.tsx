"use client"

import { startOfMonth, endOfMonth, getDay, getDaysInMonth } from 'date-fns';
import CalendarDay from './CalendarDay';

interface Reservation {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfGuests: number;
  reservationDateTime: string;
  specialRequests?: string;
  createdAt?: string;
}

// Interface pour les événements
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
}

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date | null;
  reservations: Reservation[];
  events?: Event[];
  seafoodOrders?: Array<any>;
  onSelectDate: (date: Date) => void;
}

export default function CalendarGrid({ currentDate, selectedDate, reservations, events = [], seafoodOrders = [], onSelectDate }: CalendarGridProps) {
  // Tableau des noms de jours en français
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Ajouter une fonction pour regrouper les événements
  const groupEventReservations = (reservations: Reservation[]): Event[] => {
    const groupedEvents: Event[] = [];
    const eventGroups: { [key: string]: Reservation[] } = {};
    
    // Identifier les réservations d'événements et les regrouper par identifiant
    reservations.forEach(res => {
      if (res.specialRequests && res.specialRequests.includes('ÉVÉNEMENT')) {
        // Extraire l'identifiant de l'événement (format: "ÉVÉNEMENT #X/Y (Z pers. total)")
        const eventIdMatch = res.specialRequests.match(/ÉVÉNEMENT #\d+\/\d+ \((\d+) pers\. total\)/);
        const eventTypeMatch = res.specialRequests.match(/Type: (special|private|public|seafood)/);
        
        if (eventIdMatch) {
          const totalPersons = eventIdMatch[1];
          const eventType = eventTypeMatch ? eventTypeMatch[1] : 'special';
          // Utiliser la date comme clé de regroupement au lieu de la combinaison nom+date+total
          // Format: "2025-04-25T04:58:00.000Z" -> "2025-04-25-04:58"
          const resDate = new Date(res.reservationDateTime);
          const dateKey = `${resDate.getFullYear()}-${String(resDate.getMonth() + 1).padStart(2, '0')}-${String(resDate.getDate()).padStart(2, '0')}-${String(resDate.getHours()).padStart(2, '0')}:${String(resDate.getMinutes()).padStart(2, '0')}`;
          const eventKey = `${res.customerName}-${dateKey}-${eventType}`;
          
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
        const eventTypeMatch = firstRes.specialRequests?.match(/Type: (special|private|public|seafood)/);
        const detailsMatch = firstRes.specialRequests?.match(/- (.*)/);
        
        // Calculer le nombre total réel de personnes avec une priorité sur l'information la plus fiable
        let totalPersons = 0;
        
        // 1. Si le nombre est explicitement mentionné dans le message spécial, c'est la source la plus fiable
        if (eventIdMatch && !isNaN(parseInt(eventIdMatch[1]))) {
          totalPersons = parseInt(eventIdMatch[1]);
        } 
        // 2. Sinon, additionner les invités de toutes les réservations du groupe
        else {
          totalPersons = group.reduce((sum, res) => sum + res.numberOfGuests, 0);
        }
        
        // Assurer que c'est toujours un nombre valide
        totalPersons = Math.max(totalPersons, 1);
        
        const eventType = eventTypeMatch ? eventTypeMatch[1] as 'special' | 'private' | 'public' | 'seafood' : 'special';
        const details = detailsMatch ? detailsMatch[1] : '';
        
        // Déterminer le titre et la couleur en fonction du type d'événement
        let title = '';
        let color = '';
        
        switch(eventType) {
          case 'private':
            title = `Événement privé (${totalPersons} pers.)`;
            color = "#4CAF50"; // Vert
            break;
          case 'seafood':
            title = `${totalPersons} article${totalPersons > 1 ? 's' : ''}`;
            color = "#FF9370"; // Orange saumon
            break;
          case 'public':
            title = `Événement public (${totalPersons} pers.)`;
            color = "#FF9800"; // Orange
            break;
          case 'special':
          default:
            title = `Événement spécial (${totalPersons} pers.)`;
            color = "#2196F3"; // Bleu
        }
        
        const resDate = new Date(firstRes.reservationDateTime);
        const hours = resDate.getHours().toString().padStart(2, '0');
        const minutes = resDate.getMinutes().toString().padStart(2, '0');
        
        // Créer un événement unique pour ce groupe
        groupedEvents.push({
          id: firstRes.id,
          title: title,
          description: details,
          eventDate: `${resDate.getFullYear()}-${String(resDate.getMonth() + 1).padStart(2, '0')}-${String(resDate.getDate()).padStart(2, '0')}`,
          startTime: `${hours}:${minutes}`,
          endTime: '',
          maxGuests: totalPersons,
          type: eventType,
          color: color
        });
      }
    });
    
    return groupedEvents;
  };

  // Combinez les événements explicites et les réservations marquées comme événements
  const combinedEvents = [...events, ...groupEventReservations(reservations)];

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const startDay = getDay(monthStart) || 7; // Convertir 0 (dimanche) en 7 pour le calendrier français
    const daysInMonth = getDaysInMonth(currentDate);
    
    const days = [];
    
    // Ajouter des jours vides pour aligner avec le bon jour de la semaine
    for (let i = 1; i < startDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 bg-[#2a2a2a]/50 border border-[#3a3a3a]" />
      );
    }

    // Date actuelle pour désactiver les jours passés
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ajouter les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isPast = date < today;
      
      // Formater la date au format YYYY-MM-DD pour vérifier les événements
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      // Filtrer explicitement pour ce jour spécifique
      const eventsForThisDay = combinedEvents.filter(event => {
        // Pour les événements seafood, on vérifie simplement par jour
        if (event.type === 'seafood') {
          // Extraire le jour du format YYYY-MM-DD
          try {
            const eventDay = parseInt(event.eventDate.split('-')[2]);
            return eventDay === day;
          } catch (e) {
            console.error("Erreur lors de l'extraction du jour:", e);
            return false;
          }
        }
        
        // Pour les autres événements, on utilise la correspondance exacte
        return event.eventDate === formattedDate;
      });

      days.push(
        <CalendarDay
          key={day}
          day={day}
          date={date}
          isSelected={isSelected || false}
          isPast={isPast}
          reservations={reservations}
          events={eventsForThisDay}
          seafoodOrders={seafoodOrders}
          onClick={() => onSelectDate(date)}
        />
      );
    }

    return days;
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {/* Jours de la semaine */}
      {weekDays.map(day => (
        <div key={day} className="text-center py-2 text-[#C4B5A2] font-medium">
          {day}
        </div>
      ))}
      
      {/* Jours du mois */}
      {renderCalendar()}
    </div>
  );
} 