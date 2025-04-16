"use client"

import React, { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  imagePath: string;
}

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '/events/default.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  if (!imagePath.startsWith('/uploads/')) {
    return `${API_URL}/uploads${imagePath}`;
  }
  return `${API_URL}${imagePath}`;
};

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des événements');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C4B5A2]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-4">
      {events.map((event) => (
        <Link 
          href={`/events`}
          key={event.id}
          className="group bg-[#1a1a1a] p-8 rounded-xl border-2 border-[#C4B5A2]/30 hover:border-[#C4B5A2] transition-all duration-300 flex flex-col items-center text-center"
        >
          <div className="w-full h-48 mb-6 overflow-hidden rounded-lg relative">
            <Image
              src={getImageUrl(event.imagePath)}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
          <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-[#C4B5A2]" />
            <span className="text-[#C4B5A2]">
              {format(new Date(event.date), 'dd MMMM yyyy', { locale: fr })}
            </span>
          </div>
          <span className="text-[#C4B5A2] group-hover:text-white transition-colors">
            En savoir plus →
          </span>
        </Link>
      ))}
    </div>
  );
}