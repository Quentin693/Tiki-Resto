"use client"

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Share2, Instagram, Facebook, Pencil, Trash2, Plus, Check } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { galleryApi, GalleryItem } from '@/services/api';
import { toast } from 'react-hot-toast';

export default function GalleryPage() {
  const { user, token } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryItem | null>(null);
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState([
    { id: 'all', name: 'Tout' },
    { id: 'restaurant', name: 'Restaurant' },
    { id: 'dishes', name: 'Plats' },
    { id: 'events', name: 'Événements' }
  ]);

  const [images, setImages] = useState<GalleryItem[]>([]);

  const [newImage, setNewImage] = useState<Partial<GalleryItem>>({
    title: '',
    description: '',
    category: 'restaurant',
    imagePath: '',
    isActive: true
  });

  // Charger les données du backend
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setIsLoading(true);
        // Récupérer les catégories et les images
        
        if (activeCategory === 'all') {
          const galleryData = await galleryApi.getAll();
          setImages(galleryData);
        } else {
          const galleryData = await galleryApi.getByCategory(activeCategory);
          setImages(galleryData);
        }
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des images:', err);
        setError('Une erreur est survenue lors du chargement des images');
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryData();
  }, [activeCategory]);

  const filteredImages = activeCategory === 'all' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isPlaying && selectedImage) {
      interval = setInterval(() => {
        handleNext();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedImage]);

  const uploadImage = async (file: File) => {
    if (!file) return null;
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/uploads/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image');
      }
      
      const data = await response.json();
      setIsUploading(false);
      
      return data.imagePath;
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
      setIsUploading(false);
      return null;
    }
  };

  const handleNext = () => {
    if (!selectedImage || filteredImages.length === 0) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    setSelectedImage(filteredImages[(currentIndex + 1) % filteredImages.length]);
  };

  const handlePrev = () => {
    if (!selectedImage || filteredImages.length === 0) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    setSelectedImage(filteredImages[(currentIndex - 1 + filteredImages.length) % filteredImages.length]);
  };

  const handleAddImage = async () => {
    try {
      if (!newImage.title || !newImage.imagePath) {
        toast.error('Le titre et l\'image sont requis');
        return;
      }

      const createdImage = await galleryApi.create(newImage as Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>);
      setImages([...images, createdImage]);
      setIsAddingImage(false);
      toast.success('Image ajoutée avec succès');
      
      // Réinitialiser le formulaire
      setNewImage({
        title: '',
        description: '',
        category: 'restaurant',
        imagePath: '',
        isActive: true
      });
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      toast.error('Erreur lors de l\'ajout de l\'image');
    }
  };

  const handleEditImage = (image: GalleryItem) => {
    setEditingImage(image);
    setNewImage(image);
    setIsEditing(true);
    setSelectedImage(null);
  };

  const handleUpdateImage = async () => {
    try {
      if (!editingImage) return;
      
      if (!newImage.title || !newImage.imagePath) {
        toast.error('Le titre et l\'image sont requis');
        return;
      }

      const updatedImage = await galleryApi.update(editingImage.id, newImage);
      
      // Mettre à jour l'image dans le tableau
      setImages(images.map(img => img.id === editingImage.id ? updatedImage : img));
      
      setIsEditing(false);
      setEditingImage(null);
      toast.success('Image mise à jour avec succès');
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      toast.error('Erreur lors de la mise à jour de l\'image');
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;
    
    try {
      await galleryApi.delete(imageId);
      setImages(images.filter(img => img.id !== imageId));
      if (selectedImage?.id === imageId) {
        setSelectedImage(null);
      }
      toast.success('Image supprimée avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression de l\'image');
    }
  };

  // Formulaire d'édition/ajout d'image
  const renderImageForm = () => (
    <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-4 sm:p-8 border-2 border-[#C4B5A2] mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#C4B5A2]">
          {isEditing ? 'Modifier une image' : 'Ajouter une image'}
        </h3>
        <button onClick={() => {
          setIsAddingImage(false);
          setIsEditing(false);
          setEditingImage(null);
        }} className="text-white hover:text-[#C4B5A2]">
          <X size={24} />
        </button>
      </div>
      
      <input
        className="w-full mb-4 p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
        placeholder="Titre de l'image"
        value={newImage.title || ''}
        onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
      />
      <textarea
        className="w-full mb-4 p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
        placeholder="Description"
        value={newImage.description || ''}
        onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
      />
      <select
        className="w-full mb-4 p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
        value={newImage.category || 'restaurant'}
        onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
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
            ref={fileInputRef}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={async (e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const imagePath = await uploadImage(file);
                
                if (imagePath) {
                  setNewImage({ ...newImage, imagePath });
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
          onClick={isEditing ? handleUpdateImage : handleAddImage}
          className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          disabled={isUploading}
        >
          <Check size={20} />
          {isEditing ? "Mettre à jour" : "Ajouter"}
        </button>
        <button
          onClick={() => {
            setIsAddingImage(false);
            setIsEditing(false);
            setEditingImage(null);
          }}
          className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          disabled={isUploading}
        >
          <X size={20} />
          Annuler
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#141414] text-white items-center justify-center">
        <div className="p-8 bg-[#2a2a2a]/80 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Chargement...</h2>
          <p>Nous récupérons les images de la galerie</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#141414] text-white">
      <main className="flex-grow relative w-full">
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" />
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

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Galerie Photos</h1>
            <div className="w-24 h-1 bg-[#C4B5A2] mx-auto mb-4"></div>
            <p className="text-gray-300">Plongez dans l'ambiance unique de notre restaurant</p>
          </div>

          {user?.role === 'admin' && !isAddingImage && !isEditing && (
            <div className="mb-8 flex justify-center">
              <button
                onClick={() => setIsAddingImage(true)}
                className="flex items-center gap-2 bg-[#C4B5A2] text-black px-4 py-2 rounded-md hover:bg-[#a39482]"
              >
                <Plus size={20} />
                Ajouter une photo
              </button>
            </div>
          )}

          {(isAddingImage || isEditing) && renderImageForm()}

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg mb-8">
              <p>{error}</p>
            </div>
          )}

          {/* Filtres de catégories responsive */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 sm:px-6 py-2 rounded-full border-2 text-sm sm:text-base transition-colors ${
                  activeCategory === category.id
                    ? 'border-[#C4B5A2] bg-[#C4B5A2] text-black'
                    : 'border-[#C4B5A2]/30 hover:border-[#C4B5A2] text-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center p-8 bg-[#2a2a2a]/50 rounded-lg">
              <p className="text-gray-400">Aucune image trouvée pour cette catégorie</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredImages.map((image) => (
                <div 
                  key={image.id}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-[#C4B5A2]/20 shadow-xl bg-[#2a2a2a]/90 backdrop-blur-md"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  <div className="relative h-64">
                    <Image
                      src={image.imagePath?.startsWith('http')
                        ? image.imagePath
                        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${image.imagePath}` || '/images/default.jpg'}
                      alt={image.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <h3 className="text-lg font-semibold">{image.title}</h3>
                    <p className="text-sm text-gray-300 line-clamp-2">{image.description}</p>
                    
                    {user?.role === 'admin' && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditImage(image);
                          }}
                          className="flex items-center gap-1 bg-blue-600 px-2 py-1 rounded text-xs sm:text-sm hover:bg-blue-700"
                        >
                          <Pencil size={14} className="hidden sm:block" />
                          Modifier
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image.id);
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
              ))}
            </div>
          )}

          {selectedImage && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center">
              <div className="absolute top-4 right-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-[#C4B5A2] text-white hover:bg-[#A69783] transition-colors text-sm"
                >
                  {isPlaying ? 'Pause' : 'Lecture auto'}
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-white hover:text-[#C4B5A2] transition-colors mx-auto sm:mx-0"
                >
                  <X className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              </div>
              
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 text-white hover:text-[#C4B5A2] transition-colors"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              
              <div className="h-screen w-screen flex flex-col items-center justify-center px-8 sm:px-16">
                <div className="w-full h-[60vh] sm:h-[80vh] relative">
                  <Image
                    src={selectedImage.imagePath?.startsWith('http')
                      ? selectedImage.imagePath
                      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${selectedImage.imagePath}` || '/images/default.jpg'}
                    alt={selectedImage.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="w-full text-center mt-4">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">{selectedImage.title}</h2>
                  <p className="text-gray-300 mb-4 text-sm sm:text-base px-4">{selectedImage.description}</p>
                  <div className="flex flex-wrap justify-center gap-2 sm:space-x-4">
                    {user?.role === 'admin' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            handleEditImage(selectedImage);
                          }}
                          className="flex items-center gap-1 bg-blue-600 px-3 py-1 sm:px-4 sm:py-2 rounded text-sm hover:bg-blue-700"
                        >
                          <Pencil size={16} className="hidden sm:block" />
                          Modifier
                        </button>
                        <button
                          onClick={() => {
                            const id = selectedImage.id;
                            setSelectedImage(null);
                            handleDeleteImage(id);
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
                onClick={handleNext}
                className="absolute right-2 sm:right-4 text-white hover:text-[#C4B5A2] transition-colors"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}