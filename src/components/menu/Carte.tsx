"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Pencil, Trash2, Plus, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imagePath: string;
  category: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tiki-resto.onrender.com';

export default function Carte() {
  const { user, token } = useAuth();
  const [activeCategory, setActiveCategory] = useState('entrees');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [menuItems, setMenuItems] = useState<Record<string, MenuItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Détection du mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chargement des données
  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const response = await fetch(`${API_URL}/carte`);
      if (!response.ok) throw new Error('Failed to load menu items');
      const data = await response.json();
      
      // Trier les éléments par prix croissant dans chaque catégorie
      const sortedData: Record<string, MenuItem[]> = {};
      for (const category in data) {
        sortedData[category] = [...data[category]].sort((a, b) => a.price - b.price);
      }
      
      setMenuItems(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load menu items:', error);
      toast.error('Erreur lors du chargement du menu');
      setIsLoading(false);
    }
  };

  const [newItemData, setNewItemData] = useState({
    name: "",
    description: "",
    price: "",
    imagePath: "",
    category: activeCategory,
  });
  const [isUploading, setIsUploading] = useState(false);

  // When activeCategory changes, update newItemData.category
  useEffect(() => {
    if (!isEditing) {
      setNewItemData(prev => ({...prev, category: activeCategory}));
    }
  }, [activeCategory, isEditing]);

  const uploadImage = async (file: File) => {
    if (!file) return null;
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_URL}/uploads/image`, {
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

  const handleAddItem = async () => {
    try {
      // Si une image est en attente d'upload mais pas encore traitée
      if (isUploading) {
        toast.error('Upload d\'image en cours, veuillez patienter');
        return;
      }
      
      const response = await fetch(`${API_URL}/carte`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newItemData.name,
          description: newItemData.description,
          price: parseFloat(newItemData.price),
          imagePath: newItemData.imagePath,
          category: newItemData.category,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add menu item');
      }

      await loadMenuItems();
      setIsAddingItem(false);
      setActiveCategory(newItemData.category);
      setNewItemData({
        name: "",
        description: "",
        price: "",
        imagePath: "",
        category: newItemData.category,
      });
      toast.success('Plat ajouté avec succès');
    } catch (error) {
      console.error('Failed to add menu item:', error);
      toast.error('Erreur lors de l\'ajout du plat');
    }
  };

  const handleEditItem = async (item: MenuItem) => {
    setEditingItem(item);
    setNewItemData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      imagePath: item.imagePath || "",
      category: item.category,
    });
    setIsEditing(true);
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`${API_URL}/carte/${editingItem.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newItemData.name,
          description: newItemData.description,
          price: parseFloat(newItemData.price),
          imagePath: newItemData.imagePath,
          category: newItemData.category,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update menu item');
      }

      await loadMenuItems();
      setIsEditing(false);
      setEditingItem(null);
      toast.success('Plat mis à jour avec succès');
    } catch (error) {
      console.error('Failed to update menu item:', error);
      toast.error('Erreur lors de la mise à jour du plat');
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) return;

    try {
      const response = await fetch(`${API_URL}/carte/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete menu item');
      }

      await loadMenuItems();
      toast.success('Plat supprimé avec succès');
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      toast.error('Erreur lors de la suppression du plat');
    }
  };

  const [categories] = useState([
    { id: 'entrees', name: 'Entrées' },
    { id: 'plats', name: 'Plats' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'boissons', name: 'Boissons' }
  ]);

  // Gestionnaires de navigation du carrousel
  const handleNextSlide = () => {
    if (isTransitioning || !menuItems[activeCategory] || menuItems[activeCategory].length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === menuItems[activeCategory].length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handlePrevSlide = () => {
    if (isTransitioning || !menuItems[activeCategory] || menuItems[activeCategory].length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? menuItems[activeCategory].length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Gestionnaires tactiles
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextSlide();
    }
    if (isRightSwipe) {
      handlePrevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/image2.png';
    if (imagePath.startsWith('http')) return imagePath;
    if (!imagePath.startsWith('/uploads/')) {
      return `${API_URL}/uploads${imagePath}`;
    }
    return `${API_URL}${imagePath}`;
  };

  const hasImage = (imagePath: string) => {
    return imagePath && imagePath !== '';
  };

  const renderForm = () => (
    <div className="bg-[#2a2a2a] rounded-xl p-8 border-2 border-[#C4B5A2] mb-8">
      <input
        className="w-full mb-4 p-2 bg-gray-800 rounded"
        placeholder="Nom du plat"
        value={newItemData.name}
        onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
      />
      <textarea
        className="w-full mb-4 p-2 bg-gray-800 rounded"
        placeholder="Description"
        value={newItemData.description}
        onChange={(e) => setNewItemData({ ...newItemData, description: e.target.value })}
      />
      <input
        className="w-full mb-4 p-2 bg-gray-800 rounded"
        placeholder="Prix (ex: 14)"
        type="number"
        value={newItemData.price}
        onChange={(e) => setNewItemData({ ...newItemData, price: e.target.value })}
      />
      <div className="mb-4">
        <input
          className="w-full p-2 bg-gray-800 rounded"
          placeholder="Chemin de l'image (ex: entrees/salade.jpg)"
          value={newItemData.imagePath}
          onChange={(e) => setNewItemData({ ...newItemData, imagePath: e.target.value })}
        />
        <div className="mt-2 relative border-2 border-dashed border-gray-600 rounded p-4">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={async (e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const imagePath = await uploadImage(file);
                
                if (imagePath) {
                  setNewItemData({ ...newItemData, imagePath });
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
                {newItemData.imagePath && (
                  <p className="text-green-500 mt-2">Image sélectionnée: {newItemData.imagePath.split('/').pop()}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <select
        className="w-full mb-4 p-2 bg-gray-800 rounded"
        value={newItemData.category}
        onChange={(e) => setNewItemData({ ...newItemData, category: e.target.value })}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={isEditing ? handleUpdateItem : handleAddItem}
          className="flex items-center gap-2 bg-green-600 px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={isUploading}
        >
          <Check size={20} />
          {isEditing ? "Mettre à jour" : "Ajouter"}
        </button>
        <button
          onClick={() => {
            setIsAddingItem(false);
            setIsEditing(false);
            setEditingItem(null);
          }}
          className="flex items-center gap-2 bg-red-600 px-6 py-2 rounded hover:bg-red-700"
        >
          <X size={20} />
          Annuler
        </button>
      </div>
    </div>
  );

  const renderMobileView = () => {
    if (!menuItems[activeCategory] || menuItems[activeCategory].length === 0) {
      return (
        <div className="bg-[#2a2a2a] rounded-xl p-8 text-center">
          <p>Aucun plat disponible dans cette catégorie.</p>
        </div>
      );
    }
    
    const currentItem = menuItems[activeCategory][currentIndex];
    
    return (
      <div 
        className="relative bg-[#2a2a2a] rounded-xl shadow-lg overflow-hidden border border-[#C4B5A2]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {hasImage(currentItem.imagePath) && (
          <div className="relative h-64 overflow-hidden">
            <div className="absolute inset-0 bg-black/30 z-10" />
            <div className={`relative h-full transition-transform duration-300 ease-in-out ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
              <Image
                src={getImageUrl(currentItem.imagePath)}
                alt={currentItem.name}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>

            {/* Navigation buttons */}
            <button 
              onClick={handlePrevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70"
            >
              <ChevronRight size={24} />
            </button>

            {/* Pagination dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {menuItems[activeCategory].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold flex-1 pr-4">
              {currentItem.name}
            </h3>
            <span className="text-lg font-bold text-[#C4B5A2] whitespace-nowrap">
              {Number(currentItem.price).toFixed(2).replace('.', ',')} €
            </span>
          </div>
          <p className="text-gray-400">
            {currentItem.description}
          </p>
          
          {user?.role === 'admin' && (
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={() => handleEditItem(currentItem)}
                className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
              >
                <Pencil size={20} />
                Modifier
              </button>
              <button
                onClick={() => handleDeleteItem(currentItem.id)}
                className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                <Trash2 size={20} />
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDesktopView = () => {
    if (!menuItems[activeCategory] || menuItems[activeCategory].length === 0) {
      return (
        <div className="bg-[#2a2a2a] rounded-xl p-8 text-center">
          <p>Aucun plat disponible dans cette catégorie.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems[activeCategory].map((item, index) => (
          <div
            key={index}
            className="bg-[#2a2a2a] rounded-xl shadow-lg overflow-hidden border border-[#C4B5A2]"
          >
            {hasImage(item.imagePath) && (
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-black/30 z-10" />
                <Image
                  src={getImageUrl(item.imagePath)}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold flex-1 pr-4">{item.name}</h3>
                <span className="text-lg font-bold text-[#C4B5A2] whitespace-nowrap">{Number(item.price).toFixed(2).replace('.', ',')} €</span>
              </div>
              <p className="text-gray-400">{item.description}</p>
              
              {user?.role === 'admin' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                  >
                    <Pencil size={20} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                  >
                    <Trash2 size={20} />
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section>
      <div className="text-center mb-10">
        <h2 className="text-4xl font-didot-bold mb-4">Notre Carte</h2>
        <div className="w-24 h-1 bg-[#C4B5A2] mx-auto mb-8"></div>
        <p className="text-gray-400">Découvrez notre sélection de plats exotiques</p>
      </div>

      <div className="flex justify-center mb-12 overflow-x-auto">
        <div className="inline-flex rounded-lg border border-[#C4B5A2] bg-[#2a2a2a] p-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setCurrentIndex(0);
              }}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-[#C4B5A2] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {user?.role === 'admin' && !isAddingItem && !isEditing && (
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setIsAddingItem(true)}
            className="flex items-center gap-2 bg-[#C4B5A2] text-black px-4 py-2 rounded-md hover:bg-[#a39482]"
          >
            <Plus size={20} />
            Ajouter un plat
          </button>
        </div>
      )}

      {(isAddingItem || isEditing) && renderForm()}

      {isMobile ? renderMobileView() : renderDesktopView()}
    </section>
  );
}