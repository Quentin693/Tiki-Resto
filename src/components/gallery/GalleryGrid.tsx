import { GalleryItem } from '@/services/api';
import GalleryImageCard from './GalleryImageCard';

interface GalleryGridProps {
  images: GalleryItem[];
  isAdmin: boolean;
  onImageClick: (image: GalleryItem) => void;
  onEdit: (image: GalleryItem) => void;
  onDelete: (id: number) => void;
}

export default function GalleryGrid({ 
  images, 
  isAdmin, 
  onImageClick, 
  onEdit, 
  onDelete 
}: GalleryGridProps) {
  if (images.length === 0) {
    return (
      <div className="text-center p-8 bg-[#2a2a2a]/50 rounded-lg">
        <p className="text-gray-400">Aucune image trouvée pour cette catégorie</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {images.map((image) => (
        <GalleryImageCard
          key={image.id}
          image={image}
          isAdmin={isAdmin}
          onImageClick={onImageClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
} 