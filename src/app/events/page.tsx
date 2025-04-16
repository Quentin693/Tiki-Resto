"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { eventsApi, Event } from '@/services/api';
import Header from '../../components/events/Header';
import PartnerCarousel from '../../components/events/PartnerCarousel';
import EventForm from '../../components/events/EventForm';
import EventCard from '../../components/events/EventCard';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleAddEvent = async (newEvent: NewEvent) => {
    try {
      let finalImagePath = newEvent.imagePath;
      if (selectedFile) {
        const uploadedPath = await uploadImage();
        if (uploadedPath) {
          finalImagePath = uploadedPath;
        }
      }
      
      const { id, ...eventData } = newEvent;
      
      const createdEvent = await eventsApi.create({
        ...eventData,
        imagePath: finalImagePath
      });
      
      setEvents(prev => [...prev, createdEvent]);
      setIsAddingEvent(false);
      setSelectedFile(null);
    } catch (err) {
      console.error('Erreur lors de la création de l\'événement:', err);
      alert('Impossible de créer l\'événement. Veuillez réessayer plus tard.');
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEditing(true);
  };

  const handleUpdateEvent = async (updatedEvent: NewEvent) => {
    if (editingEvent) {
      try {
        let finalImagePath = updatedEvent.imagePath;
        if (selectedFile) {
          const uploadedPath = await uploadImage();
          if (uploadedPath) {
            finalImagePath = uploadedPath;
          }
        }
        
        const { id, ...updateData } = updatedEvent;
        const updated = await eventsApi.update(editingEvent.id, {
          ...updateData,
          imagePath: finalImagePath
        });
        
        setEvents(prev => 
          prev.map(event => event.id === editingEvent.id ? updated : event)
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

  // Grouper les événements par mois
  const groupedEvents = useMemo<GroupedEvents>(() => {
    return events.reduce((groups: GroupedEvents, event) => {
      const date = new Date(event.date);
      const monthYear = date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(event);
      
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
      <div className="space-y-10 sm:space-y-12 md:space-y-16 mb-10 sm:mb-12 md:mb-16">
        {sortedMonths.map((monthYear) => (
          <div key={monthYear} className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-2 sm:gap-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#C4B5A2] capitalize">{monthYear}</h2>
              <div className="flex-grow h-0.5 bg-[#C4B5A2]/20"></div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {groupedEvents[monthYear].map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  isAdmin={user?.role === 'admin'}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#141414] text-white">
      <Header />
      
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
            <PartnerCarousel />

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

            {(isAddingEvent || isEditing) && (
              <EventForm
                isEditing={isEditing}
                editingEvent={editingEvent}
                onCancel={() => {
                  setIsAddingEvent(false);
                  setIsEditing(false);
                  setEditingEvent(null);
                  setSelectedFile(null);
                }}
                onSubmit={isEditing ? handleUpdateEvent : handleAddEvent}
                isUploading={isUploading}
              />
            )}

            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}