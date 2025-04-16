"use client"

import { Users, Phone, Mail } from 'lucide-react';

export default function ContactSection() {
  return (
    <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border border-[#C4B5A2]/20 shadow-xl mt-16">
      <div className="text-center mb-8">
        <Users className="w-12 h-12 text-[#C4B5A2] mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Contactez notre équipe</h2>
        <p className="text-gray-400">Pour toute demande spéciale ou information complémentaire</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
        <a href="tel:+123456789" className="flex items-center gap-2 bg-[#C4B5A2] hover:bg-[#A69783] text-black font-medium px-6 py-3 rounded-lg transition-colors">
          <Phone className="w-4 h-4" />
          Appeler le restaurant
        </a>
        <a href="mailto:contact@restaurant.com" className="flex items-center gap-2 bg-[#C4B5A2] hover:bg-[#A69783] text-black font-medium px-6 py-3 rounded-lg transition-colors">
          <Mail className="w-4 h-4" />
          Envoyer un email
        </a>
      </div>
    </div>
  );
} 