"use client"

import { Reservation } from '@/types/reservation';

interface RecentReservationsProps {
  reservations: Reservation[];
}

// Interface étendue pour gérer les différents formats de données
interface ReservationWithRawData extends Reservation {
  created_at?: string; // Propriété directement du backend
  updated_at?: string; // Propriété pour la dernière modification
  modifiedAt?: string; // Alternative pour la date de modification
  [key: string]: any; // Pour permettre tout accès dynamique supplémentaire
}

export default function RecentReservations({ reservations }: RecentReservationsProps) {
  // Fonction pour récupérer la date la plus récente (création ou modification)
  const getMostRecentDate = (reservation: ReservationWithRawData): Date => {
    const dates: Date[] = [];
    
    // Dates de création
    if (reservation.createdAt) {
      dates.push(new Date(reservation.createdAt));
    }
    if (reservation.created_at) {
      dates.push(new Date(reservation.created_at));
    }
    
    // Dates de modification
    if (reservation.updatedAt) {
      dates.push(new Date(reservation.updatedAt));
    }
    if (reservation.updated_at) {
      dates.push(new Date(reservation.updated_at));
    }
    if (reservation.modifiedAt) {
      dates.push(new Date(reservation.modifiedAt));
    }
    
    // Si aucune date de création ou modification, utiliser la date de réservation
    if (dates.length === 0) {
      if (reservation.date && reservation.time) {
        dates.push(new Date(`${reservation.date}T${reservation.time}`));
      } else if (reservation.reservationDateTime) {
        dates.push(new Date(reservation.reservationDateTime));
      } else {
        // Fallback sur la date actuelle
        console.warn("Aucune date trouvée pour la réservation:", reservation.id);
        dates.push(new Date());
      }
    }
    
    // Retourner la date la plus récente
    return new Date(Math.max(...dates.map(date => date.getTime())));
  };
  
  // Récupérer les 10 dernières réservations créées ou modifiées
  const getRecentReservations = () => {
    console.log("Réservations reçues:", reservations);
    
    // Accéder aux données potentiellement brutes
    const reservationsWithRawData = reservations as ReservationWithRawData[];
    
    // Tri par date la plus récente (création ou modification)
    return [...reservationsWithRawData]
      .sort((a, b) => {
        const dateA = getMostRecentDate(a);
        const dateB = getMostRecentDate(b);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 10);
  };

  // Formater la date de réservation
  const formatReservationDate = (reservation: Reservation) => {
    try {
      if (reservation.date && reservation.time) {
        return new Date(`${reservation.date}T${reservation.time}`).toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        return new Date(reservation.reservationDateTime).toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error("Erreur de formatage de date", error);
      return "Date invalide";
    }
  };

  // Récupérer le nombre de convives
  const getGuestCount = (reservation: Reservation) => {
    return reservation.guests || reservation.numberOfGuests;
  };

  // Fonction pour calculer le temps écoulé
  const getElapsedTime = (reservation: ReservationWithRawData) => {
    // Récupérer la date la plus récente (création ou modification)
    const mostRecentDate = getMostRecentDate(reservation);
    
    const now = new Date();
    const minutesElapsed = Math.round((now.getTime() - mostRecentDate.getTime()) / 60000);
    
    return minutesElapsed < 1 ? "À l'instant" : 
           minutesElapsed < 60 ? `Il y a ${minutesElapsed} min` :
           minutesElapsed < 1440 ? `Il y a ${Math.floor(minutesElapsed/60)}h${minutesElapsed%60}` :
           `Il y a ${Math.floor(minutesElapsed/1440)}j`;
  };

  return (
    <div className="mt-8 bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
      <h2 className="text-xl font-bold mb-6">Dernières réservations (10 plus récentes)</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#C4B5A2]/30">
              <th className="text-left py-4">Client</th>
              <th className="text-left py-4">Date et Heure</th>
              <th className="text-left py-4">Personnes</th>
              <th className="text-left py-4">Contact</th>
              <th className="text-left py-4">Reçue il y a</th>
              <th className="text-left py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getRecentReservations().length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-400">
                  Aucune réservation trouvée
                </td>
              </tr>
            ) : (
              getRecentReservations().map(reservation => (
                <tr key={reservation.id} className="border-b border-[#C4B5A2]/10">
                  <td className="py-4">{reservation.customerName}</td>
                  <td className="py-4">
                    {formatReservationDate(reservation)}
                  </td>
                  <td className="py-4">{getGuestCount(reservation)}</td>
                  <td className="py-4">
                    <div className="text-sm text-gray-400">
                      <div>{reservation.customerPhone}</div>
                      <div>{reservation.customerEmail}</div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm text-gray-400">
                      {getElapsedTime(reservation as ReservationWithRawData)}
                    </div>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => window.location.href=`/reservations/${reservation.id}`}
                      className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 