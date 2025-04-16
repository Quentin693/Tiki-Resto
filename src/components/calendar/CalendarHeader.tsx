"use client"

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarHeader({ currentDate, onPrevMonth, onNextMonth }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button 
        onClick={onPrevMonth}
        className="p-2 bg-[#1a1a1a] rounded-lg hover:bg-[#3a3a3a]"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <h2 className="text-xl font-semibold">
        {format(currentDate, 'MMMM yyyy', { locale: fr })}
      </h2>
      
      <button 
        onClick={onNextMonth}
        className="p-2 bg-[#1a1a1a] rounded-lg hover:bg-[#3a3a3a]"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
} 