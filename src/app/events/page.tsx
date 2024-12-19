"use client"

import React, { useState } from 'react';
<<<<<<< HEAD
import { CalendarDays, Clock, Users, Bell, Send, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function EventsPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const events = [
=======
import { CalendarDays, Clock, Users, Bell, Send, ArrowRight, Pencil, Trash2, Plus, X, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function EventsPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const [events, setEvents] = useState([
>>>>>>> Quentin-AdminPart
    {
      id: 1,
      title: "Soirée Polynésienne",
      description: "Immergez-vous dans l'ambiance des îles avec nos danseuses traditionnelles, musiciens locaux et un buffet spécial aux saveurs du Pacifique.",
      date: "2024-12-24",
      time: "19:00",
      capacity: "120 places",
      imagePath: "/events/Polynesie.jpeg"
    },
    {
      id: 2,
<<<<<<< HEAD
      title: "Masterclass Cocktails Tiki",
      description: "Apprenez à réaliser nos cocktails signature avec notre chef barman. Dégustation et secrets de préparation inclus.",
      date: "2024-12-31",
      time: "18:30",
      capacity: "30 places",
=======
      title: "Soirée Cocktails",
      description: "Immergez-vous dans l'ambiance des îles avec nos danseuses traditionnelles, musiciens locaux et un buffet spécial aux saveurs du Pacifique.",
      date: "2024-12-24",
      time: "19:00",
      capacity: "120 places",
>>>>>>> Quentin-AdminPart
      imagePath: "/events/cocktail.jpeg"
    },
    {
      id: 3,
<<<<<<< HEAD
      title: "Dîner-Spectacle de dauphin",
      description: "Une soirée unique mêlant gastronomie raffinée et performances artistiques spectaculaires dans un cadre paradisiaque.",
      date: "2025-01-15",
      time: "20:00",
      capacity: "80 places",
      imagePath: "/events/dauphins.jpeg"
    }
  ];
=======
      title: "Soirée Dauphins",
      description: "Immergez-vous dans l'ambiance des îles avec nos danseuses traditionnelles, musiciens locaux et un buffet spécial aux saveurs du Pacifique.",
      date: "2024-12-24",
      time: "19:00",
      capacity: "120 places",
      imagePath: "/events/dauphins.jpeg"
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    id: null,
    title: "",
    description: "",
    date: "",
    time: "",
    capacity: "",
    imagePath: ""
  });
>>>>>>> Quentin-AdminPart

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail('');
  };

<<<<<<< HEAD
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
=======
  const handleAddEvent = () => {
    const eventWithId = {
      ...newEvent,
      id: events.length + 1
    };
    setEvents([...events, eventWithId]);
    setIsAddingEvent(false);
    setNewEvent({
      id: null,
      title: "",
      description: "",
      date: "",
      time: "",
      capacity: "",
      imagePath: ""
    });
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent(event);
    setIsEditing(true);
  };

  const handleUpdateEvent = () => {
    const updatedEvents = events.map(event =>
      event.id === editingEvent.id ? newEvent : event
    );
    setEvents(updatedEvents);
    setIsEditing(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
  };

  const renderEventForm = () => (
    <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border-2 border-[#C4B5A2] mb-8">
      <input
        className="w-full mb-4 p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
        placeholder="Titre de l'événement"
        value={newEvent.title}
        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
      />
      <textarea
        className="w-full mb-4 p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
        placeholder="Description"
        value={newEvent.description}
        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
        rows={4}
      />
      <input
        type="date"
        className="w-full mb-4 p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
        value={newEvent.date}
        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
      />
      <input
        type="time"
        className="w-full mb-4 p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
        value={newEvent.time}
        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
      />
      <input
        className="w-full mb-4 p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
        placeholder="Capacité (ex: 120 places)"
        value={newEvent.capacity}
        onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
      />
      <input
        className="w-full mb-4 p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
        placeholder="Chemin de l'image (ex: /events/image.jpg)"
        value={newEvent.imagePath}
        onChange={(e) => setNewEvent({ ...newEvent, imagePath: e.target.value })}
      />
      <div className="flex gap-2">
        <button
          onClick={isEditing ? handleUpdateEvent : handleAddEvent}
          className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          <Check size={20} />
          {isEditing ? "Mettre à jour" : "Ajouter"}
        </button>
        <button
          onClick={() => {
            setIsAddingEvent(false);
            setIsEditing(false);
            setEditingEvent(null);
          }}
          className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          <X size={20} />
          Annuler
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#141414] text-white relative">
      <div className="fixed inset-0 bg-black/40" />

      <main className="flex-grow relative">
        <div className="relative h-full">
          <div className="absolute inset-0 flex">
>>>>>>> Quentin-AdminPart
            <div className="w-[400px] relative">
              <Image
                src="/decorations/leavesleft.webp"
                alt="Décoration gauche"
                fill
                className="object-cover opacity-20"
                priority
              />
<<<<<<< HEAD
              {/* Dégradé de transition */}
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#141414]" />
            </div>

            {/* Zone centrale avec background très sombre */}
=======
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#141414]" />
            </div>

>>>>>>> Quentin-AdminPart
            <div className="flex-grow bg-[#141414]">
              <div className="max-w-6xl mx-auto px-8" />
            </div>

<<<<<<< HEAD
            {/* Feuilles droites avec une zone de transition */}
=======
>>>>>>> Quentin-AdminPart
            <div className="w-[400px] relative">
              <Image
                src="/decorations/leavesright.webp"
                alt="Décoration droite"
                fill
                className="object-cover opacity-20"
                priority
              />
<<<<<<< HEAD
              {/* Dégradé de transition */}
=======
>>>>>>> Quentin-AdminPart
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-l from-transparent to-[#141414]" />
            </div>
          </div>

<<<<<<< HEAD
          {/* Zone de contenu superposée */}
          <div className="relative max-w-6xl mx-auto px-8 py-8">
            {/* En-tête */}
=======
          <div className="relative max-w-6xl mx-auto px-8 py-8">
>>>>>>> Quentin-AdminPart
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Événements à venir</h1>
              <div className="w-24 h-1 bg-[#C4B5A2] mx-auto mb-4"></div>
              <p className="text-gray-300">Découvrez les soirées et événements spéciaux organisés dans notre restaurant</p>
            </div>

<<<<<<< HEAD
            {/* Liste des événements */}
=======
            {user?.role === 'admin' && !isAddingEvent && !isEditing && (
              <div className="mb-8 flex justify-center">
                <button
                  onClick={() => setIsAddingEvent(true)}
                  className="flex items-center gap-2 bg-[#C4B5A2] text-black px-4 py-2 rounded-md hover:bg-[#a39482]"
                >
                  <Plus size={20} />
                  Ajouter un événement
                </button>
              </div>
            )}

            {(isAddingEvent || isEditing) && renderEventForm()}

>>>>>>> Quentin-AdminPart
            <div className="space-y-8 mb-16">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-[#C4B5A2]/20"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 h-[500px]">
<<<<<<< HEAD
                    {/* Image container */}
=======
>>>>>>> Quentin-AdminPart
                    <div className="relative h-[500px] lg:h-full">
                      <div className="absolute inset-0 bg-black/30 z-10" />
                      <Image
                        src={event.imagePath}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
<<<<<<< HEAD
                    {/* Content container */}
=======
>>>>>>> Quentin-AdminPart
                    <div className="h-[500px] p-8 flex flex-col">
                      <div className="flex-grow">
                        <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
                        <p className="text-gray-400 mb-6 line-clamp-3">{event.description}</p>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-gray-300">
                            <CalendarDays className="w-5 h-5 text-[#C4B5A2] mr-3" />
                            {new Date(event.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Clock className="w-5 h-5 text-[#C4B5A2] mr-3" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Users className="w-5 h-5 text-[#C4B5A2] mr-3" />
                            {event.capacity}
                          </div>
                        </div>

<<<<<<< HEAD
                        <button className="w-full bg-[#C4B5A2] hover:bg-[#A69783] text-black font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                          Réserver votre place
                          <ArrowRight className="w-4 h-4" />
                        </button>
=======
                        <div className="space-y-3">
                          <button className="w-full bg-[#C4B5A2] hover:bg-[#A69783] text-black font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                            Réserver votre place
                            <ArrowRight className="w-4 h-4" />
                          </button>

                          {user?.role === 'admin' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditEvent(event)}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                              >
                                <Pencil size={20} />
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                              >
                                <Trash2 size={20} />
                                Supprimer
                              </button>
                            </div>
                          )}
                        </div>
>>>>>>> Quentin-AdminPart
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

<<<<<<< HEAD
            {/* Newsletter Section */}
=======
>>>>>>> Quentin-AdminPart
            <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border border-[#C4B5A2]/20 shadow-xl">
              <div className="text-center mb-8">
                <Bell className="w-12 h-12 text-[#C4B5A2] mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Ne manquez aucun événement</h2>
                <p className="text-gray-400">Inscrivez-vous à notre newsletter pour être informé de nos prochains événements</p>
              </div>

              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                <div className="flex gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="flex-1 px-4 py-3 bg-[#1a1a1a] rounded-lg border border-[#C4B5A2]/30 focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white"
                  />
                  <button
                    type="submit"
                    className="bg-[#C4B5A2] hover:bg-[#A69783] text-black font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {subscribed ? (
                      "Inscrit !"
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        S'inscrire
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}