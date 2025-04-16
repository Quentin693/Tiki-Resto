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

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date | null;
  reservations: Reservation[];
  onSelectDate: (date: Date) => void;
}

export default function CalendarGrid({ currentDate, selectedDate, reservations, onSelectDate }: CalendarGridProps) {
  // Tableau des noms de jours en français
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

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

      days.push(
        <CalendarDay
          key={day}
          day={day}
          date={date}
          isSelected={isSelected}
          isPast={isPast}
          reservations={reservations}
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