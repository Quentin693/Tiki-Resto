"use client"

import React from 'react';
import { Utensils, CalendarDays, Mail } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: <Utensils className="w-12 h-12 text-[#C4B5A2]" />,
    title: "Consultez notre menu",
    description: "Découvrez nos créations culinaires uniques",
    link: "/menu"
  },
  {
    icon: <CalendarDays className="w-12 h-12 text-[#C4B5A2]" />,
    title: "Réservez une table",
    description: "Planifiez votre expérience gastronomique",
    link: "/reserver"
  },
  {
    icon: <Mail className="w-12 h-12 text-[#C4B5A2]" />,
    title: "Contactez-nous",
    description: "Pour vos événements spéciaux",
    link: "/contact"
  }
];

export default function ServiceSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-4">
      {services.map((service, index) => (
        <Link 
          href={service.link} 
          key={index}
          className="group bg-[#1a1a1a] p-8 rounded-xl border-2 border-[#C4B5A2]/30 hover:border-[#C4B5A2] transition-all duration-300 flex flex-col items-center text-center"
        >
          <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
            {service.icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
          <p className="text-gray-400 mb-6">{service.description}</p>
          <span className="text-[#C4B5A2] group-hover:text-white transition-colors">
            En savoir plus →
          </span>
        </Link>
      ))}
    </div>
  );
}