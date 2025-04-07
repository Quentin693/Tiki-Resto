"use client"

import React from 'react';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';

const events = [
  {
    icon: <CalendarDays className="w-12 h-12 text-[#C4B5A2]" />,
    title: "Evenement 1",
    description: "TEST1",
    link: "/events",
    image: "/events/Polynesie.jpeg"
  },
  {
    icon: <CalendarDays className="w-12 h-12 text-[#C4B5A2]" />,
    title: "Evenement 2",
    description: "TEST2",
    link: "/events",
    image: "/events/cocktail.jpeg"
  },
  {
    icon: <CalendarDays className="w-12 h-12 text-[#C4B5A2]" />,
    title: "Evenement 3",
    description: "TEST3",
    link: "/events",
    image: "/events/dauphins.jpeg"
  }
];

export default function EventsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-4">
      {events.map((event, index) => (
        <Link 
          href={event.link} 
          key={index}
          className="group bg-[#1a1a1a] p-8 rounded-xl border-2 border-[#C4B5A2]/30 hover:border-[#C4B5A2] transition-all duration-300 flex flex-col items-center text-center"
        >
          <div className="w-full h-48 mb-6 overflow-hidden rounded-lg">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
          <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
            {event.icon} DATE
          </div>
          <span className="text-[#C4B5A2] group-hover:text-white transition-colors">
            En savoir plus →
          </span>
        </Link>
      ))}
    </div>
  );
}