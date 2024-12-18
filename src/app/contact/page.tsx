"use client"

import React, { useState } from 'react';
import { Phone, Mail, Clock, MapPin, Send, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#141414] text-white relative">
      {/* Background de base sombre */}
      <div className="fixed inset-0 bg-black/40" />

      {/* Contenu principal */}
      <main className="flex-grow relative">
        <div className="relative h-full">
          {/* Conteneur des feuilles et du contenu central */}
          <div className="absolute inset-0 flex">
            {/* Feuilles gauches avec une zone de transition */}
            <div className="w-[400px] relative">
              <Image
                src="/decorations/leavesleft.webp"
                alt="Décoration gauche"
                fill
                className="object-cover opacity-20"
                priority
              />
              {/* Dégradé de transition */}
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#141414]" />
            </div>

            {/* Zone centrale avec background très sombre */}
            <div className="flex-grow bg-[#141414]">
              <div className="max-w-6xl mx-auto px-8" />
            </div>

            {/* Feuilles droites avec une zone de transition */}
            <div className="w-[400px] relative">
              <Image
                src="/decorations/leavesright.webp"
                alt="Décoration droite"
                fill
                className="object-cover opacity-20"
                priority
              />
              {/* Dégradé de transition */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-l from-transparent to-[#141414]" />
            </div>
          </div>

          {/* Zone de contenu superposée */}
          <div className="relative max-w-6xl mx-auto px-8 py-8">
            {/* En-tête */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
              <div className="w-24 h-1 bg-[#C4B5A2] mx-auto mb-4"></div>
              <p className="text-gray-300">Nous sommes à votre écoute</p>
            </div>

            {/* Grille principale */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Colonne de gauche - Informations */}
              <div className="space-y-8">
                {/* Carte */}
                <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-[#C4B5A2]/20">
                  <div className="h-[400px] bg-gray-800">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=VOTRE_CLE_MAPS"
                      width="100%"
                      height="100%"
                      style={{border: 0}}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>

                {/* Informations de contact */}
                <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 space-y-6 border border-[#C4B5A2]/20 shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full border border-[#C4B5A2]">
                      <Phone className="w-6 h-6 text-[#C4B5A2]" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Téléphone</h3>
                      <p className="text-gray-400">04 78 49 02 39</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full border border-[#C4B5A2]">
                      <Mail className="w-6 h-6 text-[#C4B5A2]" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-400">contact@autiki.fr</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full border border-[#C4B5A2]">
                      <MapPin className="w-6 h-6 text-[#C4B5A2]" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Adresse</h3>
                      <p className="text-gray-400">Chemin du Pontet<br />69330 Decines</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full border border-[#C4B5A2]">
                      <Clock className="w-6 h-6 text-[#C4B5A2]" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Horaires d'ouverture</h3>
                      <div className="text-gray-400">
                        <p>Mardi - Dimanche : 12h - 14h30</p>
                        <p>Mercredi - Samedi : 19h - 22h30</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne de droite - Formulaire */}
              <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border border-[#C4B5A2]/20 shadow-xl">
                <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#1a1a1a] rounded-lg border border-[#C4B5A2]/30 focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#1a1a1a] rounded-lg border border-[#C4B5A2]/30 focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-[#1a1a1a] rounded-lg border border-[#C4B5A2]/30 focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white"
                      placeholder="Votre message..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#C4B5A2] hover:bg-[#A69783] text-black font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {submitted ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Message envoyé !
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}