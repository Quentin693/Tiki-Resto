"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Pencil, Trash2, Plus, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Carte() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('entrees');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Détection du mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [categories] = useState([
    { id: 'entrees', name: 'Entrées' },
    { id: 'plats', name: 'Plats' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'boissons', name: 'Boissons' }
  ]);

  const [menuItems, setMenuItems] = useState({
    entrees: [
      {
          name: "Salade Lyonnaise",
          description: "Mélange exotique de mangue, avocat et crevettes",
          price: "14€",
          imagePath: "/entrees/saladeLyonnaise.png"
      },
      {
          name: "Ravioles aux cèpes",
          description: "Saumon frais mariné, riz vinaigré, légumes croquants",
          price: "16€",
          imagePath: "/entrees/ravioles.jpeg"
      },
      {
          name: "Oeuf en meurette",
          description: "Légumes frais, vermicelles, menthe, sauce cacahuète",
          price: "12€",
          imagePath: "/entrees/oeufenmeurette.webp"
      },
      {
          name: "Salade Chèvre chaud",
          description: "Légumes frais, vermicelles, menthe, sauce cacahuète",
          price: "12€",
          imagePath: "/entrees/Salade-chevre-chaud.png"
      }
    ],
    plats: [
      {
        name: "Tataki de Thon",
        description: "Poisson grillé, sauce passion, légumes de saison",
        price: "28€",
        imagePath: "/plats/tatakiThon.jpeg"
      },
      {
        name: "Risotto St-Jacques",
        description: "Mariné aux épices exotiques, riz coco, légumes",
        price: "24€",
        imagePath: "/plats/risotto.jpg"
      },
      {
        name: "Magret de Canard",
        description: "Légumes, lait de coco, curry maison, riz jasmin",
        price: "22€",
        imagePath: "/plats/magret.jpg"
      },
      {
        name: "Onglet de Boeuf",
        description: "Mariné aux épices exotiques, riz coco, légumes",
        price: "24€",
        imagePath: "/plats/onglet.webp"
      },
      {
        name: "Tomahawk de Veau",
        description: "Mariné aux épices exotiques, riz coco, légumes",
        price: "24€",
        imagePath: "/plats/Tomahawk_low.jpg"
      },
      {
        name: "Grenouilles comme en Dombes",
        description: "Mariné aux épices exotiques, riz coco, légumes",
        price: "24€",
        imagePath: "/plats/grenouilles.jpg"
      }
    ],
    desserts: [
      {
        name: "Brioche Perdue",
        description: "Caramélisé au miel, glace coco, crumble",
        price: "10€",
        imagePath: "/dessert/brioche-perdue.jpg"
      },
      {
        name: "Crème Brûlée",
        description: "Coulis exotique, fruits frais, coco râpée",
        price: "12€",
        imagePath: "/dessert/creme-brulee.jpeg"
      },
      {
        name: "Moelleux Chocolat",
        description: "Caramélisé au miel, glace coco, crumble",
        price: "10€",
        imagePath: "/dessert/moelleux.jpg"
      },
      {
        name: "Cafe Gourmand",
        description: "Caramélisé au miel, glace coco, crumble",
        price: "10€",
        imagePath: "/dessert/cafe-gourmand.jpg"
      }
    ],
    boissons: [
      {
        name: "Sex On The Beach",
        description: "Rhum, jus fruits exotiques, sirop maison",
        price: "12€",
        imagePath: "/cocktails/Sexonthebeach.jpg"
      },
      {
        name: "Espresso Martini",
        description: "Mélange de jus frais sans alcool",
        price: "8€",
        imagePath: "/cocktails/espresso-Martini.webp"
      }
    ]
  });

  // Gestionnaires de navigation du carrousel
  const handleNextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === menuItems[activeCategory].length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handlePrevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? menuItems[activeCategory].length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Gestionnaires tactiles
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
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

  // Gestionnaires CRUD
  const handleAddItem = () => {
    const updatedMenuItems = {
      ...menuItems,
      [activeCategory]: [...menuItems[activeCategory], newItem]
    };
    setMenuItems(updatedMenuItems);
    setIsAddingItem(false);
    setNewItem({
      name: "",
      description: "",
      price: "",
      imagePath: ""
    });
  };

  const handleEditItem = (item, index) => {
    setEditingItem({ ...item, index });
    setNewItem(item);
    setIsEditing(true);
  };

  const handleUpdateItem = () => {
    const updatedMenuItems = {
      ...menuItems,
      [activeCategory]: menuItems[activeCategory].map((item, index) =>
        index === editingItem.index ? newItem : item
      )
    };
    setMenuItems(updatedMenuItems);
    setIsEditing(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (index) => {
    const updatedMenuItems = {
      ...menuItems,
      [activeCategory]: menuItems[activeCategory].filter((_, idx) => idx !== index)
    };
    setMenuItems(updatedMenuItems);
  };

  // Gestion des données du formulaire
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    imagePath: ""
  });

  const renderForm = () => (
    <div className="bg-[#2a2a2a] rounded-xl p-8 border-2 border-[#C4B5A2] mb-8">
      <input
        className="w-full mb-4 p-2 bg-gray-800 rounded"
        placeholder="Nom du plat"
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
      />
      <textarea
        className="w-full mb-4 p-2 bg-gray-800 rounded"
        placeholder="Description"
        value={newItem.description}
        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
      />
      <input
        className="w-full mb-4 p-2 bg-gray-800 rounded"
        placeholder="Prix (ex: 14€)"
        value={newItem.price}
        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
      />
      <input
        className="w-full mb-4 p-2 bg-gray-800 rounded"
        placeholder="Chemin de l'image (ex: /entrees/image.jpg)"
        value={newItem.imagePath}
        onChange={(e) => setNewItem({ ...newItem, imagePath: e.target.value })}
      />
      <div className="flex gap-2">
        <button
          onClick={isEditing ? handleUpdateItem : handleAddItem}
          className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
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
          className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          <X size={20} />
          Annuler
        </button>
      </div>
    </div>
  );

  const renderMobileView = () => (
    <div 
      className="relative bg-[#2a2a2a] rounded-xl shadow-lg overflow-hidden border border-[#C4B5A2]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className={`relative h-full transition-transform duration-300 ease-in-out ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
          <Image
            src={menuItems[activeCategory][currentIndex].imagePath}
            alt={menuItems[activeCategory][currentIndex].name}
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

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">
            {menuItems[activeCategory][currentIndex].name}
          </h3>
          <span className="text-lg font-bold text-[#C4B5A2]">
            {menuItems[activeCategory][currentIndex].price}
          </span>
        </div>
        <p className="text-gray-400">
          {menuItems[activeCategory][currentIndex].description}
        </p>
        
        {user?.role === 'admin' && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={() => handleEditItem(menuItems[activeCategory][currentIndex], currentIndex)}
              className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              <Pencil size={20} />
              Modifier
            </button>
            <button
              onClick={() => handleDeleteItem(currentIndex)}
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

  const renderDesktopView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {menuItems[activeCategory]?.map((item, index) => (
        <div
          key={index}
          className="bg-[#2a2a2a] rounded-xl shadow-lg overflow-hidden border border-[#C4B5A2]"
        >
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-black/30 z-10" />
            <Image
              src={item.imagePath}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <span className="text-lg font-bold text-[#C4B5A2]">{item.price}</span>
            </div>
            <p className="text-gray-400">{item.description}</p>
            
            {user?.role === 'admin' && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                <button
                  onClick={() => handleEditItem(item, index)}
                  className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                >
                  <Pencil size={20} />
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteItem(index)}
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

  return (
    <section>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Notre Carte</h2>
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