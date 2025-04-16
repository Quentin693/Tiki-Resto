"use client"

import { Reservation } from '@/types/reservation';

interface RecentReservationsProps {
  reservations: Reservation[];
}

// Interface étendue pour gérer les différents formats de données
interface ReservationWithRawData extends Reservation {
  created_at?: string; // Propriété directement du backend
  [key: string]: any; // Pour permettre tout accès dynamique supplémentaire
}

export default function RecentReservations({ reservations }: RecentReservationsProps) {
  // Fonction pour récupérer la date de création pour le tri
  const getCreationDate = (reservation: ReservationWithRawData): Date => {
    // Vérifier toutes les possibilités de dates de création
    if (reservation.createdAt) {
      return new Date(reservation.createdAt);
    }
    if (reservation.created_at) {
      return new Date(reservation.created_at);
    }
    
    // Si aucune date de création, utiliser la date de réservation
    if (reservation.date && reservation.time) {
      return new Date(`${reservation.date}T${reservation.time}`);
    }
    if (reservation.reservationDateTime) {
      return new Date(reservation.reservationDateTime);
    }
    
    // Fallback sur la date actuelle
    console.warn("Aucune date trouvée pour la réservation:", reservation.id);
    return new Date();
  };
  
  // Récupérer les 10 dernières réservations créées
  const getRecentReservations = () => {
    console.log("Réservations reçues:", reservations);
    
    // Accéder aux données potentiellement brutes
    const reservationsWithRawData = reservations as ReservationWithRawData[];
    
    // Vérifier si nous avons des dates de création sous n'importe quelle forme
    const hasCreationDates = reservationsWithRawData.some(res => !!res.createdAt || !!res.created_at);
    
    if (hasCreationDates) {
      console.log("Tri des réservations par date de création");
      // Tri par date de création
      return [...reservationsWithRawData]
        .sort((a, b) => {
          const dateA = getCreationDate(a);
          const dateB = getCreationDate(b);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 10);
    } else {
      console.log("Tri des réservations par date de réservation");
      // Tri par date de réservation
      return [...reservationsWithRawData]
        .sort((a, b) => {
          // Utiliser soit date + time, soit reservationDateTime
          const dateA = a.date && a.time 
            ? new Date(`${a.date}T${a.time}`) 
            : new Date(a.reservationDateTime);
          const dateB = b.date && b.time 
            ? new Date(`${b.date}T${b.time}`) 
            : new Date(b.reservationDateTime);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 10);
    }
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
    let creationDate = null;
    
    // Essayer toutes les possibilités de dates de création
    if (reservation.createdAt) {
      creationDate = new Date(reservation.createdAt);
    } else if (reservation.created_at) {
      creationDate = new Date(reservation.created_at);
    }
    
    // Si pas de date de création, retourner un message générique
    if (!creationDate) {
      return "Date inconnue";
    }

    const now = new Date();
    const minutesElapsed = Math.round((now.getTime() - creationDate.getTime()) / 60000);
    
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