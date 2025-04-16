"use client"

import { Clock } from 'lucide-react';
import { isSameDay } from 'date-fns';

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

interface CalendarDayProps {
  day: number;
  date: Date;
  isSelected: boolean;
  isPast: boolean;
  reservations: Reservation[];
  onClick: () => void;
}

export default function CalendarDay({ day, date, isSelected, isPast, reservations, onClick }: CalendarDayProps) {
  // Trouver les réservations pour ce jour
  const dayReservations = reservations.filter(res => {
    const resDate = new Date(res.reservationDateTime);
    return isSameDay(resDate, date);
  });

  return (
    <div
      onClick={!isPast ? onClick : undefined}
      className={`h-24 bg-[#2a2a2a] border border-[#3a3a3a] p-2 transition-colors
        ${isSelected ? 'ring-2 ring-[#C4B5A2]' : 'hover:bg-[#3a3a3a]'}
        ${isPast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium">{day}</span>
        {dayReservations.length > 0 && (
          <span className="text-xs px-2 py-1 rounded-full bg-[#C4B5A2] text-black">
            {dayReservations.reduce((sum, res) => sum + res.numberOfGuests, 0)} pers.
          </span>
        )}
      </div>
      {dayReservations.length > 0 && (
        <div className="mt-2 space-y-1">
          {dayReservations.slice(0, 2).map(reservation => {
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
          {dayReservations.length > 2 && (
            <div className="text-xs text-gray-500">
              +{dayReservations.length - 2} autres
            </div>
          )}
        </div>
      )}
    </div>
  );
} 