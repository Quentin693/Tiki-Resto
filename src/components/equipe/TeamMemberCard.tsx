"use client"

import Image from 'next/image';
import { Pencil, Trash2, UtensilsCrossed, GlassWater } from 'lucide-react';
import { Personnel } from '@/services/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '/images/default-person.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  if (!imagePath.startsWith('/uploads/')) {
    return `${API_URL}/uploads${imagePath}`;
  }
  return `${API_URL}${imagePath}`;
};

interface TeamMemberCardProps {
  member: Personnel;
  isAdmin: boolean;
  onEdit: (member: Personnel) => void;
  onDelete: (id: number) => void;
}

export default function TeamMemberCard({ member, isAdmin, onEdit, onDelete }: TeamMemberCardProps) {
  return (
    <div className="relative aspect-square rounded-xl shadow-xl overflow-hidden group">
      {/* Image */}
      <Image
        src={getImageUrl(member.imagePath)}
        alt={`${member.firstName} ${member.lastName}`}
        fill
        className="object-cover"
      />

      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      
      {/* Boutons d'administration */}
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(member)}
            className="bg-blue-600/80 p-2 rounded-full hover:bg-blue-700 transition-colors backdrop-blur-md"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(member.id)}
            className="bg-red-600/80 p-2 rounded-full hover:bg-red-700 transition-colors backdrop-blur-md"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Informations */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">{member.firstName} {member.lastName}</h2>
          {member.service === 'cuisine' ? (
            <UtensilsCrossed className="w-5 h-5 text-[#C4B5A2]" />
          ) : (
            <GlassWater className="w-5 h-5 text-[#C4B5A2]" />
          )}
        </div>
        <p className="text-[#C4B5A2] text-sm mb-2">{member.role}</p>
        <p className="text-gray-300 text-sm line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity">
          {member.description}
        </p>
      </div>
    </div>
  );
} 