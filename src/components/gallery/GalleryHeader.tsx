import { Plus } from 'lucide-react';

interface GalleryHeaderProps {
  isAdmin: boolean;
  onAddImage: () => void;
  isAddingImage: boolean;
  isEditing: boolean;
}

export default function GalleryHeader({ isAdmin, onAddImage, isAddingImage, isEditing }: GalleryHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="font-dynapuff text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4">Galerie Photos</h1>
      <div className="w-24 h-1 bg-[#C4B5A2] mx-auto mb-4"></div>
      <p className="text-gray-300">Plongez dans l'ambiance unique de notre restaurant</p>

      {isAdmin && !isAddingImage && !isEditing && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onAddImage}
            className="flex items-center gap-2 bg-[#C4B5A2] text-black px-4 py-2 rounded-md hover:bg-[#a39482]"
          >
            <Plus size={20} />
            Ajouter une photo
          </button>
        </div>
      )}
    </div>
  );
} 