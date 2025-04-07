"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { CalendarDays, Clock, Users, Bell, Send, ArrowRight, Pencil, Trash2, Plus, X, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { eventsApi, Event } from '@/services/api';

type NewEvent = {
  id: number | null;
  title: string;
  description: string;
  date: string;
  time: string;
  capacity: string;
  imagePath: string;
  type: 'brasero' | 'tapas' | 'afterwork' | 'anniversaire' | 'fête' | 'autre';
};

type GroupedEvents = {
  [key: string]: Event[];
};

export default function EventsPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  // Logos pour le diaporama des partenaires
  const partnerLogos = [
    { id: 1, src: "/logos/Actu event.png", name: "Actu Event" },
    { id: 2, src: "/logos/EDF.png", name: "EDF" },
    { id: 3, src: "/logos/Logo France Frais.jpeg", name: "France Frais" },
    { id: 4, src: "/logos/fullsport.jpg", name: "Full sport" },
    { id: 5, src: "/logos/XPOlogistics.webp", name: "XPO logistics" },
    { id: 6, src: "/logos/Logo Plattard.jpg", name: "Plattard" },
  ];

  const [newEvent, setNewEvent] = useState<NewEvent>({
    id: null,
    title: "",
    description: "",
    date: "",
    time: "",
    capacity: "",
    imagePath: "",
    type: "brasero"
  });

  // Charger les événements depuis l'API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await eventsApi.getAll();
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des événements:', err);
        setError('Impossible de charger les événements. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Effet pour faire défiler automatiquement le diaporama de logos
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % partnerLogos.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Grouper les événements par mois
  const groupedEvents = useMemo<GroupedEvents>(() => {
    return events.reduce((groups: GroupedEvents, event) => {
      const date = new Date(event.date);
      const monthYear = date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(event);
      
      // Trier les événements au sein de chaque mois par date
      groups[monthYear].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      return groups;
    }, {});
  }, [events]);

  // Trier les mois chronologiquement
  const sortedMonths = useMemo(() => {
    return Object.keys(groupedEvents).sort((a, b) => {
      const monthA = a.split(' ')[0];
      const yearA = a.split(' ')[1];
      const monthB = b.split(' ')[0];
      const yearB = b.split(' ')[1];
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [groupedEvents]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail('');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      
      // Mettre à jour le chemin de l'image dans le formulaire
      // avec un nom temporaire basé sur le nom du fichier
      const fileName = files[0].name;
      const safeName = fileName.toLowerCase().replace(/[^a-z0-9.]/g, '-');
      setNewEvent({ ...newEvent, imagePath: `events/${safeName}` });
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return null;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Créer un XMLHttpRequest pour pouvoir suivre la progression
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/uploads/image`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.imagePath);
          } else {
            reject(new Error('Upload failed'));
          }
        };
        
        xhr.onerror = () => {
          reject(new Error('Network error'));
        };
        
        xhr.onloadend = () => {
          setIsUploading(false);
        };
        
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
      return null;
    }
  };

  const handleAddEvent = async () => {
    try {
      // Si un fichier est sélectionné, on l'upload d'abord
      let finalImagePath = newEvent.imagePath;
      if (selectedFile) {
        const uploadedPath = await uploadImage();
        if (uploadedPath) {
          finalImagePath = uploadedPath;
        }
      }
      
      // Convertir NewEvent en Omit<Event, 'id' | 'createdAt' | 'updatedAt'>
      const { id, ...eventData } = newEvent;
      
      const createdEvent = await eventsApi.create({
        ...eventData,
        imagePath: finalImagePath
      });
      
      setEvents(prev => [...prev, createdEvent]);
      setIsAddingEvent(false);
      setSelectedFile(null);
      setNewEvent({
        id: null,
        title: "",
        description: "",
        date: "",
        time: "",
        capacity: "",
        imagePath: "",
        type: "brasero"
      });
    } catch (err) {
      console.error('Erreur lors de la création de l\'événement:', err);
      alert('Impossible de créer l\'événement. Veuillez réessayer plus tard.');
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setNewEvent({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      capacity: event.capacity,
      imagePath: event.imagePath || '',
      type: event.type as 'brasero' | 'tapas' | 'afterwork' | 'anniversaire' | 'fête' | 'autre'
    });
    setIsEditing(true);
  };

  const handleUpdateEvent = async () => {
    if (editingEvent) {
      try {
        // Si un fichier est sélectionné, on l'upload d'abord
        let finalImagePath = newEvent.imagePath;
        if (selectedFile) {
          const uploadedPath = await uploadImage();
          if (uploadedPath) {
            finalImagePath = uploadedPath;
          }
        }
        
        const { id, ...updateData } = newEvent;
        const updatedEvent = await eventsApi.update(editingEvent.id, {
          ...updateData,
          imagePath: finalImagePath
        });
        
        setEvents(prev => 
          prev.map(event => event.id === editingEvent.id ? updatedEvent : event)
        );
        
        setIsEditing(false);
        setEditingEvent(null);
        setSelectedFile(null);
      } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'événement:', err);
        alert('Impossible de mettre à jour l\'événement. Veuillez réessayer plus tard.');
      }
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await eventsApi.delete(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'événement:', err);
      alert('Impossible de supprimer l\'événement. Veuillez réessayer plus tard.');
    }
  };

  const renderEventForm = () => (
    <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-[#C4B5A2]/30 shadow-xl mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-[#C4B5A2] mb-6">
        {isEditing ? "Modifier l'événement" : "Ajouter un nouvel événement"}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Titre</label>
          <input
            className="w-full p-3 bg-[#1a1a1a] rounded-lg text-white border border-[#C4B5A2]/20 focus:border-[#C4B5A2] focus:ring-1 focus:ring-[#C4B5A2] transition duration-200"
            placeholder="Soirée Brasero"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Type d'événement</label>
          <select
            className="w-full p-3 bg-[#1a1a1a] rounded-lg text-white border border-[#C4B5A2]/20 focus:border-[#C4B5A2] focus:ring-1 focus:ring-[#C4B5A2] transition duration-200"
            value={newEvent.type}
            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
          >
            <option value="brasero">Brasero</option>
            <option value="tapas">Tapas</option>
            <option value="afterwork">After Work</option>
            <option value="anniversaire">Anniversaire</option>
            <option value="fête">Fête</option>
            <option value="autre">Autre</option>
          </select>
        </div>
      </div>
      
      <div className="mb-6 space-y-2">
        <label className="block text-sm font-medium text-gray-300">Description</label>
        <textarea
          className="w-full p-3 bg-[#1a1a1a] rounded-lg text-white border border-[#C4B5A2]/20 focus:border-[#C4B5A2] focus:ring-1 focus:ring-[#C4B5A2] transition duration-200"
          placeholder="Décrivez votre événement"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          rows={4}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Date</label>
          <input
            type="date"
            className="w-full p-3 bg-[#1a1a1a] rounded-lg text-white border border-[#C4B5A2]/20 focus:border-[#C4B5A2] focus:ring-1 focus:ring-[#C4B5A2] transition duration-200"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Heure</label>
          <input
            type="time"
            className="w-full p-3 bg-[#1a1a1a] rounded-lg text-white border border-[#C4B5A2]/20 focus:border-[#C4B5A2] focus:ring-1 focus:ring-[#C4B5A2] transition duration-200"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Capacité</label>
          <input
            className="w-full p-3 bg-[#1a1a1a] rounded-lg text-white border border-[#C4B5A2]/20 focus:border-[#C4B5A2] focus:ring-1 focus:ring-[#C4B5A2] transition duration-200"
            placeholder="120 places"
            value={newEvent.capacity}
            onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
          />
        </div>
      </div>
      
      <div className="mb-6 space-y-2">
        <label className="block text-sm font-medium text-gray-300">Image</label>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <div className="flex">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 flex items-center justify-center gap-2 bg-[#1a1a1a] rounded-l-lg border border-r-0 border-[#C4B5A2]/20 px-4 py-3 hover:bg-[#252525] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                  <path d="M12 12v9"></path>
                  <path d="m16 16-4-4-4 4"></path>
                </svg>
                Choisir
              </button>
              <input
                className="flex-1 p-3 bg-[#1a1a1a] rounded-r-lg text-white border border-[#C4B5A2]/20 focus:border-[#C4B5A2] focus:ring-1 focus:ring-[#C4B5A2] transition duration-200"
                placeholder="Chemin ou nom de l'image"
                value={newEvent.imagePath}
                onChange={(e) => setNewEvent({ ...newEvent, imagePath: e.target.value })}
              />
            </div>
          </div>
          
          {selectedFile && (
            <div className="border border-[#C4B5A2]/20 rounded-lg p-3 flex-shrink-0 w-full md:w-1/4 bg-[#1a1a1a]">
              <div className="text-sm text-gray-300 truncate mb-1">{selectedFile.name}</div>
              {isUploading ? (
                <div className="w-full bg-[#252525] rounded-full h-2">
                  <div 
                    className="bg-[#C4B5A2] h-2 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              ) : (
                <div className="text-xs text-gray-400">{Math.round(selectedFile.size / 1024)} KB</div>
              )}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400">Sélectionnez une image à télécharger ou entrez un chemin existant</p>
      </div>
      
      <div className="flex gap-4 pt-2">
        <button
          onClick={isEditing ? handleUpdateEvent : handleAddEvent}
          disabled={isUploading}
          className={`flex-1 flex items-center justify-center gap-2 bg-[#C4B5A2] hover:bg-[#a39482] text-black font-medium px-4 py-3 rounded-lg transition-colors text-sm sm:text-base ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Téléchargement...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              {isEditing ? "Mettre à jour" : "Ajouter l'événement"}
            </>
          )}
        </button>
        <button
          onClick={() => {
            setIsAddingEvent(false);
            setIsEditing(false);
            setEditingEvent(null);
            setSelectedFile(null);
          }}
          disabled={isUploading}
          className={`flex items-center justify-center gap-2 bg-transparent hover:bg-[#3a3a3a] border border-[#C4B5A2]/30 px-4 py-3 rounded-lg transition-colors text-sm sm:text-base ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <X className="w-5 h-5" />
          Annuler
        </button>
      </div>
    </div>
  );

  // Fonction pour rendre le contenu principal de la page
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="loader">Chargement...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-600/20 border border-red-600 p-4 rounded-lg text-center my-8">
          <p className="text-white">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">Aucun événement à venir pour le moment.</p>
          {user?.role === 'admin' && (
            <button
              onClick={() => setIsAddingEvent(true)}
              className="flex items-center gap-2 bg-[#C4B5A2] text-black px-4 py-2 rounded-md hover:bg-[#a39482] mx-auto"
            >
              <Plus size={20} />
              Ajouter un événement
            </button>
          )}
        </div>
      );
    }

    return (
      // Affichage des événements par mois
      <div className="space-y-10 sm:space-y-12 md:space-y-16 mb-10 sm:mb-12 md:mb-16">
        {sortedMonths.map((monthYear) => (
          <div key={monthYear} className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-2 sm:gap-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#C4B5A2] capitalize">{monthYear}</h2>
              <div className="flex-grow h-0.5 bg-[#C4B5A2]/20"></div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {groupedEvents[monthYear].map((event) => (
                <div 
                  key={event.id}
                  className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-[#C4B5A2]/20"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-56 sm:h-64 md:h-80 lg:h-[500px]">
                      <div className="absolute inset-0 bg-black/30 z-10" />
                      <Image
                        src={event.imagePath?.startsWith('http')
                          ? event.imagePath
                          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${event.imagePath}` || '/events/default.jpg'}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4 z-20 bg-[#1a1a1a]/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                        {event.type}
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-6 md:p-8 flex flex-col">
                      <div className="flex-grow">
                        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">{event.title}</h2>
                        <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base line-clamp-3">{event.description}</p>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                          <div className="flex items-center text-gray-300 text-sm sm:text-base">
                            <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-[#C4B5A2] mr-2 sm:mr-3 flex-shrink-0" />
                            {new Date(event.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center text-gray-300 text-sm sm:text-base">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#C4B5A2] mr-2 sm:mr-3 flex-shrink-0" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-gray-300 text-sm sm:text-base">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#C4B5A2] mr-2 sm:mr-3 flex-shrink-0" />
                            {event.capacity}
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">

                          {user?.role === 'admin' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditEvent(event)}
                                className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-blue-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
                              >
                                <Pencil size={14} className="sm:w-5 sm:h-5 flex-shrink-0" />
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-red-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-red-700 text-sm sm:text-base"
                              >
                                <Trash2 size={14} className="sm:w-5 sm:h-5 flex-shrink-0" />
                                Supprimer
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#141414] text-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] sm:h-[60vh]">
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover"
          >
            <source src="/videoTiki.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <div>
            <img 
              src="/logo.png"
              alt="Tiki Logo"
              className="w-32 h-32 sm:w-auto sm:h-auto"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4">
            Événements à venir
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-4 sm:mb-8 max-w-2xl">
            Découvrez nos soirées exceptionnelles et moments uniques
          </p>
          <div className="w-16 sm:w-24 h-1 bg-[#C4B5A2]"></div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="relative flex-grow bg-[#141414]">
        <div className="relative">
          {/* Background avec feuilles */}
          <div className="absolute inset-0 flex">
            <div className="w-[150px] sm:w-[250px] md:w-[400px] relative">
              <Image
                src="/decorations/leavesleft.webp"
                alt="Décoration gauche"
                fill
                className="object-cover opacity-20"
                priority
              />
              <div className="absolute inset-y-0 right-0 w-12 sm:w-20 md:w-32 bg-gradient-to-r from-transparent to-[#141414]" />
            </div>

            <div className="flex-grow bg-[#141414]">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8" />
            </div>

            <div className="w-[150px] sm:w-[250px] md:w-[400px] relative">
              <Image
                src="/decorations/leavesright.webp"
                alt="Décoration droite"
                fill
                className="object-cover opacity-20"
                priority
              />
              <div className="absolute inset-y-0 left-0 w-12 sm:w-20 md:w-32 bg-gradient-to-l from-transparent to-[#141414]" />
            </div>
          </div>

          {/* Contenu */}
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
            {/* Diaporama des logos partenaires */}
            <div className="mb-16">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2">Ils nous ont fait confiance...</h2>
                <div className="w-16 h-0.5 bg-[#C4B5A2] mx-auto"></div>
              </div>
              
              <div className="relative h-28 overflow-hidden bg-[#1a1a1a]/60 rounded-xl border border-[#C4B5A2]/20 p-4">
                <div className="absolute inset-0 flex items-center">
                  <div 
                    className="flex items-center justify-around w-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${slideIndex * (100 / partnerLogos.length)}%)` }}
                  >
                    {partnerLogos.map((logo) => (
                      <div key={logo.id} className="flex-shrink-0 w-1/3 px-4">
                        <div className="flex flex-col items-center">
                          <div className="h-16 w-32 relative flex items-center justify-center">
                            <Image
                              src={logo.src}
                              alt={logo.name}
                              width={120}
                              height={60}
                              className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{logo.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-2 mt-2">
                  {partnerLogos.map((_, index) => (
                    <button 
                      key={index}
                      onClick={() => setSlideIndex(index)}
                      className={`w-2 h-2 rounded-full ${slideIndex === index ? 'bg-[#C4B5A2]' : 'bg-gray-600'}`}
                      aria-label={`Voir logo ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {user?.role === 'admin' && !isAddingEvent && !isEditing && (
              <div className="mb-6 sm:mb-8 flex justify-center">
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

            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}