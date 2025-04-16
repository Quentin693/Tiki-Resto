import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Pencil, Trash2, Facebook, Instagram } from 'lucide-react';
import { GalleryItem } from '@/services/api';

interface GalleryImageModalProps {
  image: GalleryItem;
  isAdmin: boolean;
  isPlaying: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onPlayToggle: () => void;
  onEdit: (image: GalleryItem) => void;
  onDelete: (id: number) => void;
}

export default function GalleryImageModal({
  image,
  isAdmin,
  isPlaying,
  onClose,
  onPrevious,
  onNext,
  onPlayToggle,
  onEdit,
  onDelete
}: GalleryImageModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="absolute top-4 right-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
        <button
          onClick={onPlayToggle}
          className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-[#C4B5A2] text-white hover:bg-[#A69783] transition-colors text-sm"
        >
          {isPlaying ? 'Pause' : 'Lecture auto'}
        </button>
        <button
          onClick={onClose}
          className="text-white hover:text-[#C4B5A2] transition-colors mx-auto sm:mx-0"
        >
          <X className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>
      
      <button
        onClick={onPrevious}
        className="absolute left-2 sm:left-4 text-white hover:text-[#C4B5A2] transition-colors"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
      
      <div className="h-screen w-screen flex flex-col items-center justify-center px-8 sm:px-16">
        <div className="w-full h-[60vh] sm:h-[80vh] relative">
          <Image
            src={image.imagePath?.startsWith('http')
              ? image.imagePath
              : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${image.imagePath}` || '/images/default.jpg'}
            alt={image.title}
            fill
            className="object-contain"
          />
        </div>
        <div className="w-full text-center mt-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{image.title}</h2>
          <p className="text-gray-300 mb-4 text-sm sm:text-base px-4">{image.description}</p>
          <div className="flex flex-wrap justify-center gap-2 sm:space-x-4">
            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onEdit(image);
                  }}
                  className="flex items-center gap-1 bg-blue-600 px-3 py-1 sm:px-4 sm:py-2 rounded text-sm hover:bg-blue-700"
                >
                  <Pencil size={16} className="hidden sm:block" />
                  Modifier
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onDelete(image.id);
                  }}
                  className="flex items-center gap-1 bg-red-600 px-3 py-1 sm:px-4 sm:py-2 rounded text-sm hover:bg-red-700"
                >
                  <Trash2 size={16} className="hidden sm:block" />
                  Supprimer
                </button>
              </>
            )}
            <button className="flex items-center gap-1 text-[#C4B5A2] hover:text-white transition-colors">
              <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm">Facebook</span>
            </button>
            <button className="flex items-center gap-1 text-[#C4B5A2] hover:text-white transition-colors">
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm">Instagram</span>
            </button>
          </div>
        </div>
      </div>
      
      <button
        onClick={onNext}
        className="absolute right-2 sm:right-4 text-white hover:text-[#C4B5A2] transition-colors"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
    </div>
  );
} 