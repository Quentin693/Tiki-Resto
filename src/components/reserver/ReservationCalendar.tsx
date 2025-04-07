"use client"

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface ReservationCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  showCalendar: boolean;
  setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  calendarRef: React.RefObject<HTMLDivElement | null>;
}

export default function ReservationCalendar({
  selectedDate,
  onDateSelect,
  showCalendar,
  setShowCalendar,
  calendarRef
}: ReservationCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Synchroniser avec la date sélectionnée
  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate.getMonth());
      setCurrentYear(selectedDate.getFullYear());
    }
  }, [selectedDate]);

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (date: Date) => {
    console.log("Date clicked:", date);
    onDateSelect(date);
    setShowCalendar(false);
  };

  const renderCalendarDays = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = firstDayOfMonth(currentMonth, currentYear);
    const calendarDays = [];
    
    // Ajustement pour commencer par lundi (1) au lieu de dimanche (0)
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    
    // Jours vides du début du mois
    for (let i = 0; i < startOffset; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} className="py-3 px-2 text-center opacity-20"></div>
      );
    }
    
    // Date minimale (aujourd'hui)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Jours du mois
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentYear, currentMonth, day);
      date.setHours(0, 0, 0, 0);
      
      const isToday = date.getTime() === today.getTime();
      const isSelected = selectedDate && 
                         date.getDate() === selectedDate.getDate() && 
                         date.getMonth() === selectedDate.getMonth() && 
                         date.getFullYear() === selectedDate.getFullYear();
      const isPastDate = date < today;
      
      calendarDays.push(
        <button
          key={`day-${day}`}
          type="button"
          disabled={isPastDate}
          onClick={() => handleDateClick(date)}
          className={`
            py-3 px-2 text-center rounded-lg transition-colors
            ${isSelected ? 'bg-[#C4B5A2] text-black font-medium' : ''}
            ${isToday && !isSelected ? 'border border-[#C4B5A2]' : ''}
            ${isPastDate ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#3a3a3a] cursor-pointer'}
          `}
        >
          {day}
        </button>
      );
    }
    
    return calendarDays;
  };

  return (
    <div className="relative">
      <p className="text-sm text-gray-400 mb-2">Date</p>
      <div 
        className="bg-[#2a2a2a] rounded-lg p-4 border border-[#C4B5A2]/20 cursor-pointer hover:border-[#C4B5A2]/40 transition-colors"
        onClick={() => setShowCalendar(!showCalendar)}
        ref={calendarRef}
      >
        <div className="flex justify-between items-center">
          <span className="text-xl font-medium">
            {selectedDate ? formatDate(selectedDate) : "Sélectionner une date"}
          </span>
          <Calendar className="w-5 h-5 text-[#C4B5A2]" />
        </div>
      </div>
      
      {showCalendar && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#2a2a2a] rounded-lg border border-[#C4B5A2]/20 p-4 z-10 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-full hover:bg-[#3a3a3a]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-medium">
              {new Date(currentYear, currentMonth).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-full hover:bg-[#3a3a3a]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['L', 'M', 'Me', 'J', 'V', 'S', 'D'].map((day, index) => (
              <div key={`day-header-${index}`} className="text-center text-gray-400 text-sm py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>
        </div>
      )}
    </div>
  );
} 