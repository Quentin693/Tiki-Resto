import Image from 'next/image';
import { CalendarDays, Clock, Users, Pencil, Trash2 } from 'lucide-react';
import { Event } from '@/services/api';

type EventCardProps = {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: number) => void;
  isAdmin: boolean;
};

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '/events/default.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  if (!imagePath.startsWith('/uploads/')) {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/uploads${imagePath}`;
  }
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${imagePath}`;
};

// Fonction pour vérifier si l'événement est à venir prochainement (dans les 7 prochains jours)
const isUpcoming = (eventDate: string): boolean => {
  const today = new Date();
  const date = new Date(eventDate);
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7;
};

export default function EventCard({ event, onEdit, onDelete, isAdmin }: EventCardProps) {
  const upcoming = isUpcoming(event.date);
  
  return (
    <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-[#C4B5A2]/20 hover:border-[#C4B5A2]/40 transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="relative h-48 md:h-full group overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-black/40 transition-colors duration-300" />
          <Image
            src={getImageUrl(event.imagePath)}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 z-20 bg-[#1a1a1a]/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
            {event.type}
          </div>
          
          {/* Badge pour événements proches */}
          {upcoming && (
            <div className="absolute top-3 left-3 z-20 bg-red-600/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium animate-pulse">
              Bientôt
            </div>
          )}
        </div>
        
        <div className="p-4 md:p-6 flex flex-col col-span-2">
          <div className="flex-grow">
            <h2 className="text-xl font-bold mb-2 text-[#C4B5A2]">{event.title}</h2>
            <p className="text-gray-400 text-sm line-clamp-2 mb-4">{event.description}</p>
          </div>
          
          <div className="flex-shrink-0">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="flex items-center text-gray-300 text-xs">
                <CalendarDays className="w-4 h-4 text-[#C4B5A2] mr-1 flex-shrink-0" />
                <span className="truncate">
                  {new Date(event.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center text-gray-300 text-xs">
                <Clock className="w-4 h-4 text-[#C4B5A2] mr-1 flex-shrink-0" />
                <span className="truncate">{event.time}</span>
              </div>
              <div className="flex items-center text-gray-300 text-xs">
                <Users className="w-4 h-4 text-[#C4B5A2] mr-1 flex-shrink-0" />
                <span className="truncate">{event.capacity}</span>
              </div>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(event)}
                  className="flex-1 flex items-center justify-center gap-1 bg-blue-600/80 hover:bg-blue-600 px-2 py-1.5 rounded text-xs transition-colors"
                >
                  <Pencil size={12} />
                  Modifier
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-600/80 hover:bg-red-600 px-2 py-1.5 rounded text-xs transition-colors"
                >
                  <Trash2 size={12} />
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 