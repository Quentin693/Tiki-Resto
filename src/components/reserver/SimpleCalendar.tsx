"use client"

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface SimpleCalendarProps {
  selectedDate: Date | null;
  onChange: (date: Date) => void;
}

export default function SimpleCalendar({ selectedDate, onChange }: SimpleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Obtenir le nombre de jours dans le mois courant
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Obtenir le jour de la semaine du premier jour du mois (0 = Dimanche, 1 = Lundi, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Formater la date pour l'affichage
  const formatDate = (date: Date | null) => {
    if (!date) return "Aucune date sélectionnée";
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Navigation vers le mois précédent
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };
  
  // Navigation vers le mois suivant
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };
  
  // Sélectionner une date
  const selectDate = (day: number) => {
    // Créer une nouvelle date avec le jour sélectionné
    const newDate = new Date(currentYear, currentMonth, day);
    
    // Régler les heures à midi pour éviter les problèmes de changement de jour dû au fuseau horaire
    newDate.setHours(12, 0, 0, 0);
    
    // Appeler le callback avec la nouvelle date
    onChange(newDate);
  };
  
  // Générer le calendrier
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const calendar = [];
    
    // Ajuster pour commencer la semaine par lundi
    let startDay = firstDay === 0 ? 6 : firstDay - 1;
    
    // Jours vides du début du mois
    for (let i = 0; i < startDay; i++) {
      calendar.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }
    
    // Date du jour
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.getTime() === today.getTime();
      const isSelected = selectedDate ? (
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentMonth && 
        selectedDate.getFullYear() === currentYear
      ) : false;
      const isPast = date < today;
      
      calendar.push(
        <button
          key={day}
          disabled={isPast}
          onClick={() => !isPast && selectDate(day)}
          className={`h-9 w-9 rounded-full flex items-center justify-center text-sm
            ${isSelected ? 'bg-[#C4B5A2] text-black font-medium' : ''}
            ${isToday && !isSelected ? 'border border-[#C4B5A2]' : ''}
            ${isPast ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#3a3a3a] cursor-pointer'}
          `}
        >
          {day}
        </button>
      );
    }
    
    return calendar;
  };
  
  return (
    <div className="p-4 w-[320px] bg-[#2a2a2a] rounded-lg shadow-lg border border-[#C4B5A2]/20">
      {/* En-tête avec navigation */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-[#3a3a3a] rounded-full">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-medium">
          {new Date(currentYear, currentMonth).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="p-1 hover:bg-[#3a3a3a] rounded-full">
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['L', 'M', 'Me', 'J', 'V', 'S', 'D'].map((day, index) => (
          <div key={`day-header-${index}`} className="h-9 w-9 flex items-center justify-center text-xs text-gray-400">
            {day}
          </div>
        ))}
      </div>
      
      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>
      
      {/* Affichage de la date sélectionnée */}
      <div className="mt-4 pt-4 border-t border-[#3a3a3a] text-center">
        <p className="text-sm text-gray-400">Date sélectionnée:</p>
        <p className="text-[#C4B5A2]">{formatDate(selectedDate)}</p>
      </div>
    </div>
  );
} 