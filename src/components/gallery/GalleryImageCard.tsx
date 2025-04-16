import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';
import { GalleryItem } from '@/services/api';

interface GalleryImageCardProps {
  image: GalleryItem;
  isAdmin: boolean;
  onImageClick: (image: GalleryItem) => void;
  onEdit: (image: GalleryItem) => void;
  onDelete: (id: number) => void;
}

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '/images/default.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  if (!imagePath.startsWith('/uploads/')) {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/uploads${imagePath}`;
  }
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${imagePath}`;
};

export default function GalleryImageCard({ 
  image, 
  isAdmin, 
  onImageClick, 
  onEdit, 
  onDelete 
}: GalleryImageCardProps) {
  return (
    <div 
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-[#C4B5A2]/20 shadow-xl bg-[#2a2a2a]/90 backdrop-blur-md"
      onClick={() => onImageClick(image)}
    >
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
      <div className="relative h-64">
        <Image
          src={getImageUrl(image.imagePath)}
          alt={image.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <h3 className="text-lg font-semibold">{image.title}</h3>
        <p className="text-sm text-gray-300 line-clamp-2">{image.description}</p>
        
        {isAdmin && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(image);
              }}
              className="flex items-center gap-1 bg-blue-600 px-2 py-1 rounded text-xs sm:text-sm hover:bg-blue-700"
            >
              <Pencil size={14} className="hidden sm:block" />
              Modifier
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(image.id);
              }}
              className="flex items-center gap-1 bg-red-600 px-2 py-1 rounded text-xs sm:text-sm hover:bg-red-700"
            >
              <Trash2 size={14} className="hidden sm:block" />
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 