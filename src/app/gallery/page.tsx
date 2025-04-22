"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { galleryApi, GalleryItem } from '@/services/api';
import { toast } from 'react-hot-toast';
import GalleryHeader from '@/components/gallery/GalleryHeader';
import GalleryFilters from '@/components/gallery/GalleryFilters';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import GalleryImageModal from '@/components/gallery/GalleryImageModal';
import GalleryImageForm from '@/components/gallery/GalleryImageForm';

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

  const [categories] = useState([
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

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setIsLoading(true);
        const galleryData = activeCategory === 'all' 
          ? await galleryApi.getAll()
          : await galleryApi.getByCategory(activeCategory);
        setImages(galleryData);
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

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isPlaying && selectedImage) {
      interval = setInterval(handleNext, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedImage]);

  const filteredImages = activeCategory === 'all' 
    ? images 
    : images.filter(img => img.category === activeCategory);

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
      
      if (!response.ok) throw new Error('Erreur lors de l\'upload de l\'image');
      
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

  const handleUpdateImage = async () => {
    try {
      if (!editingImage) return;
      
      if (!newImage.title || !newImage.imagePath) {
        toast.error('Le titre et l\'image sont requis');
        return;
      }

      const updatedImage = await galleryApi.update(editingImage.id, newImage);
      setImages(images.map(img => img.id === editingImage.id ? updatedImage : img));
      setIsEditing(false);
      setEditingImage(null);
      toast.success('Image mise à jour avec succès');
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      toast.error('Erreur lors de la mise à jour de l\'image');
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;
    
    try {
      await galleryApi.delete(id);
      setImages(images.filter(img => img.id !== id));
      if (selectedImage?.id === id) setSelectedImage(null);
      toast.success('Image supprimée avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression de l\'image');
    }
  };

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

        <div className="relative max-w-6xl mt-40 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <GalleryHeader
            isAdmin={user?.role === 'admin'}
            onAddImage={() => setIsAddingImage(true)}
            isAddingImage={isAddingImage}
            isEditing={isEditing}
          />

          {(isAddingImage || isEditing) && (
            <GalleryImageForm
              isEditing={isEditing}
              newImage={newImage}
              categories={categories}
              onClose={() => {
                setIsAddingImage(false);
                setIsEditing(false);
                setEditingImage(null);
              }}
              onSubmit={isEditing ? handleUpdateImage : handleAddImage}
              onChange={(field, value) => setNewImage({ ...newImage, [field]: value })}
              onImageUpload={uploadImage}
              isUploading={isUploading}
            />
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg mb-8">
              <p>{error}</p>
            </div>
          )}

          <GalleryFilters
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <GalleryGrid
            images={filteredImages}
            isAdmin={user?.role === 'admin'}
            onImageClick={setSelectedImage}
            onEdit={(image) => {
              setEditingImage(image);
              setNewImage(image);
              setIsEditing(true);
              setSelectedImage(null);
            }}
            onDelete={handleDeleteImage}
          />

          {selectedImage && (
            <GalleryImageModal
              image={selectedImage}
              isAdmin={user?.role === 'admin'}
              isPlaying={isPlaying}
              onClose={() => setSelectedImage(null)}
              onPrevious={handlePrev}
              onNext={handleNext}
              onPlayToggle={() => setIsPlaying(!isPlaying)}
              onEdit={(image) => {
                setSelectedImage(null);
                setEditingImage(image);
                setNewImage(image);
                setIsEditing(true);
              }}
              onDelete={(id) => {
                setSelectedImage(null);
                handleDeleteImage(id);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}