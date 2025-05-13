"use client"

import { Clock, ShoppingBag } from 'lucide-react';
import { isSameDay, format, parse, isValid } from 'date-fns';

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

// Ajouter l'interface Event
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

// Propriétés des commandes de fruits de mer
interface SeafoodOrder {
  id: string;
  customerName: string;
  pickupDate: string;
  pickupTime: string;
  isPickup: boolean;
  totalPrice: number;
  plateaux?: any[];
  items?: any[];
}

interface CalendarDayProps {
  day: number;
  date: Date;
  isSelected: boolean;
  isPast: boolean;
  reservations: Reservation[];
  events?: Event[];
  seafoodOrders?: SeafoodOrder[];
  onClick: () => void;
}

// Fonction pour formatter une date au format YYYY-MM-DD
const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CalendarDay({ day, date, isSelected, isPast, reservations, events = [], seafoodOrders = [], onClick }: CalendarDayProps) {
  const formattedDate = formatDateToYYYYMMDD(date);
  const dayOfMonth = date.getDate();
  
  // Filtrer les événements pour cette date
  const dayEvents = events.filter(event => {
    // Assurer que eventDate est au format YYYY-MM-DD
    const eventDateFormatted = event.eventDate;
    return eventDateFormatted === formattedDate;
  });

  // Filtrer les réservations pour cette date
  const dayReservations = reservations.filter(reservation => {
    const reservationDate = new Date(reservation.reservationDateTime);
    return reservationDate.getDate() === dayOfMonth &&
           reservationDate.getMonth() === date.getMonth() &&
           reservationDate.getFullYear() === date.getFullYear();
  });

  // Filtrer les commandes de fruits de mer pour cette date
  const daySeafoodOrders = seafoodOrders.filter(order => {
    try {
      // Gérer les différents formats possibles pour pickupDate
      let orderFormattedDate = '';
      
      // Si la date est déjà au format YYYY-MM-DD
      if (typeof order.pickupDate === 'string' && order.pickupDate.match(/^\d{4}-\d{2}-\d{2}/)) {
        orderFormattedDate = order.pickupDate.split('T')[0]; // Gérer le cas YYYY-MM-DDThh:mm:ss
      }
      // Si la date est au format DD/MM/YYYY
      else if (typeof order.pickupDate === 'string' && order.pickupDate.includes('/')) {
        const [day, month, year] = order.pickupDate.split('/').map(Number);
        orderFormattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      } 
      // Essayer de convertir en Date
      else {
        const orderDate = new Date(order.pickupDate);
        if (!isNaN(orderDate.getTime())) {
          orderFormattedDate = formatDateToYYYYMMDD(orderDate);
        }
      }
      
      // Comparaison avec la date formatée du jour
      return orderFormattedDate === formattedDate;
    } catch (error) {
      console.error(`Erreur de format de date pour la commande ${order.id}:`, error);
      return false;
    }
  });

  // Filtrer les réservations ordinaires
  const normalReservations = dayReservations.filter(res => 
    !(res.specialRequests && (
      res.specialRequests.includes('ÉVÉNEMENT') || 
      res.specialRequests.includes('Événement')
    ))
  );

  // Nombre de commandes seafood pour ce jour
  const hasSeafoodOrders = daySeafoodOrders.length > 0;
  
  // Trouver les autres événements pour ce jour (utiliser la même logique simplifiée)
  const otherEvents = events.filter(event => {
    if (event.type === 'seafood') return false;
    
    try {
      // Extraire simplement le jour du mois
      let eventDay = null;
      
      if (typeof event.eventDate === 'string') {
        if (event.eventDate.includes('-')) {
          const parts = event.eventDate.split('-');
          if (parts.length >= 3) {
            eventDay = parseInt(parts[2].split('T')[0]);
          }
        } else {
          const eventDateObj = new Date(event.eventDate);
          if (!isNaN(eventDateObj.getTime())) {
            eventDay = eventDateObj.getDate();
          }
        }
      } else if (event.eventDate && typeof event.eventDate === 'object') {
        const eventDateObj = new Date(event.eventDate);
        if (!isNaN(eventDateObj.getTime())) {
          eventDay = eventDateObj.getDate();
        }
      }
      
      return eventDay === date.getDate();
    } catch (error) {
      return false;
    }
  });

  return (
    <div
      onClick={!isPast ? onClick : undefined}
      className={`h-24 bg-[#2a2a2a] border border-[#3a3a3a] p-2 transition-colors flex flex-col justify-between
        ${isSelected ? 'ring-2 ring-[#C4B5A2]' : 'hover:bg-[#3a3a3a]'}
        ${isPast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${hasSeafoodOrders ? 'border-l-4 border-l-[#FF9370]' : ''}
      `}
    >
      <div>
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium">{day}</span>
          <div className="flex gap-1">
            {/* Badge pour les commandes de fruits de mer */}
            {hasSeafoodOrders && (
              <span className="text-xs px-2 py-1 rounded-full bg-[#FF9370] text-black font-bold flex items-center gap-1" title="Commandes de fruits de mer">
                <ShoppingBag className="w-3 h-3" />
                {daySeafoodOrders.length}
              </span>
            )}
            
            {/* Indicateur du nombre total de personnes */}
            <span className="text-xs px-2 py-1 rounded-full bg-[#C4B5A2] text-black">
              {normalReservations.reduce((sum, res) => sum + res.numberOfGuests, 0) + 
              otherEvents.reduce((sum, event) => {
                const personMatch = event.title.match(/\((\d+) pers\.\)/);
                return sum + (personMatch ? parseInt(personMatch[1]) : event.maxGuests);
              }, 0)
              } pers.
            </span>
          </div>
        </div>
        
        {/* Afficher les événements spéciaux (sans les commandes fruits de mer) */}
        {otherEvents.length > 0 && (
          <div className="mt-1 space-y-1">
            {otherEvents.slice(0, 2).map(event => {
              return (
                <div 
                  key={`event-${event.id}`} 
                  className="text-xs px-1.5 py-0.5 rounded-sm" 
                  style={{ backgroundColor: event.color || '#4A6FA5', color: '#ffffff' }}
                >
                  {event.title}
                </div>
              );
            })}
            {otherEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{otherEvents.length - 2} événements
              </div>
            )}
          </div>
        )}
        
        {/* Afficher uniquement les réservations ordinaires (pas celles liées à des événements) */}
        {(() => {
          if (normalReservations.length === 0) return null;
          
          return (
            <div className="mt-1 space-y-1">
              {normalReservations.slice(0, 2).map(reservation => {
                const time = new Date(reservation.reservationDateTime).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                });
                return (
                  <div key={reservation.id} className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{time}</span>
                    <span>•</span>
                    <span>{reservation.numberOfGuests}p</span>
                  </div>
                );
              })}
              {normalReservations.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{normalReservations.length - 2} autres
                </div>
              )}
            </div>
          );
        })()}
      </div>
      
      {/* Case rectangulaire pour les commandes de fruits de mer en bas de la cellule */}
      {hasSeafoodOrders && (
        <div 
          className="text-xs px-2 py-1 rounded text-black font-bold mt-auto w-full text-center"
          style={{ backgroundColor: '#FF9370' }}
        >
          Fruits de mer ({daySeafoodOrders.length})
        </div>
      )}
    </div>
  );
} 