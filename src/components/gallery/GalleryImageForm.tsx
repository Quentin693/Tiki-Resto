import { X, Check } from 'lucide-react';
import { GalleryItem } from '@/services/api';
import { toast } from 'react-hot-toast';

interface GalleryImageFormProps {
  isEditing: boolean;
  newImage: Partial<GalleryItem>;
  categories: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  onChange: (field: string, value: string) => void;
  onImageUpload: (file: File) => Promise<string | null>;
  isUploading: boolean;
}

export default function GalleryImageForm({
  isEditing,
  newImage,
  categories,
  onClose,
  onSubmit,
  onChange,
  onImageUpload,
  isUploading
}: GalleryImageFormProps) {
  return (
    <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-4 sm:p-8 border-2 border-[#C4B5A2] mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#C4B5A2]">
          {isEditing ? 'Modifier une image' : 'Ajouter une image'}
        </h3>
        <button onClick={onClose} className="text-white hover:text-[#C4B5A2]">
          <X size={24} />
        </button>
      </div>
      
      <input
        className="w-full mb-4 p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
        placeholder="Titre de l'image"
        value={newImage.title || ''}
        onChange={(e) => onChange('title', e.target.value)}
      />
      <textarea
        className="w-full mb-4 p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
        placeholder="Description"
        value={newImage.description || ''}
        onChange={(e) => onChange('description', e.target.value)}
      />
      <select
        className="w-full mb-4 p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
        value={newImage.category || 'restaurant'}
        onChange={(e) => onChange('category', e.target.value)}
      >
        {categories.filter(cat => cat.id !== 'all').map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      
      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-1">Image</label>
        <div className="mt-2 relative border-2 border-dashed border-gray-600 rounded p-4">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={async (e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const imagePath = await onImageUpload(file);
                
                if (imagePath) {
                  onChange('imagePath', imagePath);
                  toast.success('Image téléchargée avec succès');
                }
              }
            }}
          />
          <div className="text-center text-gray-400">
            {isUploading ? (
              <p>Upload en cours...</p>
            ) : (
              <>
                <p>Déposez votre image ici ou cliquez pour sélectionner</p>
                {newImage.imagePath && (
                  <p className="text-green-500 mt-2">Image sélectionnée: {newImage.imagePath.split('/').pop()}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          disabled={isUploading}
        >
          <Check size={20} />
          {isEditing ? "Mettre à jour" : "Ajouter"}
        </button>
        <button
          onClick={onClose}
          className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          disabled={isUploading}
        >
          <X size={20} />
          Annuler
        </button>
      </div>
    </div>
  );
} 