import React, { useState, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { Event } from '@/services/api';

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

type EventFormProps = {
  isEditing: boolean;
  editingEvent: Event | null;
  onCancel: () => void;
  onSubmit: (event: NewEvent) => Promise<void>;
  isUploading: boolean;
};

export default function EventForm({ isEditing, editingEvent, onCancel, onSubmit, isUploading }: EventFormProps) {
  const [newEvent, setNewEvent] = useState<NewEvent>({
    id: editingEvent?.id || null,
    title: editingEvent?.title || "",
    description: editingEvent?.description || "",
    date: editingEvent?.date || "",
    time: editingEvent?.time || "",
    capacity: editingEvent?.capacity || "",
    imagePath: editingEvent?.imagePath || "",
    type: editingEvent?.type as 'brasero' | 'tapas' | 'afterwork' | 'anniversaire' | 'fête' | 'autre' || "brasero"
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      const fileName = files[0].name;
      const safeName = fileName.toLowerCase().replace(/[^a-z0-9.]/g, '-');
      setNewEvent({ ...newEvent, imagePath: `events/${safeName}` });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(newEvent);
  };

  return (
    <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-[#C4B5A2]/30 shadow-xl mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-[#C4B5A2] mb-6">
        {isEditing ? "Modifier l'événement" : "Ajouter un nouvel événement"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Titre</label>
            <input
              className="w-full p-3 bg-[#1a1a1a] rounded-lg text-white border border-[#C4B5A2]/20 focus:border-[#C4B5A2] focus:ring-1 focus:ring-[#C4B5A2] transition duration-200"
              placeholder="Soirée Brasero"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Type d'événement</label>
            <select
              className="w-full p-3 bg-[#1a1a1a] rounded-lg text-white border border-[#C4B5A2]/20 focus:border-[#C4B5A2] focus:ring-1 focus:ring-[#C4B5A2] transition duration-200"
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
              required
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
            required
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
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Heure</label>
            <input
              type="time"
              className="w-full p-3 bg-[#1a1a1a] rounded-lg text-white border border-[#C4B5A2]/20 focus:border-[#C4B5A2] focus:ring-1 focus:ring-[#C4B5A2] transition duration-200"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Capacité</label>
            <input
              className="w-full p-3 bg-[#1a1a1a] rounded-lg text-white border border-[#C4B5A2]/20 focus:border-[#C4B5A2] focus:ring-1 focus:ring-[#C4B5A2] transition duration-200"
              placeholder="120 places"
              value={newEvent.capacity}
              onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
              required
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
                <div className="text-xs text-gray-400">{Math.round(selectedFile.size / 1024)} KB</div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400">Sélectionnez une image à télécharger ou entrez un chemin existant</p>
        </div>
        
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
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
            type="button"
            onClick={onCancel}
            disabled={isUploading}
            className={`flex items-center justify-center gap-2 bg-transparent hover:bg-[#3a3a3a] border border-[#C4B5A2]/30 px-4 py-3 rounded-lg transition-colors text-sm sm:text-base ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <X className="w-5 h-5" />
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
} 