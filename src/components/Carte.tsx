import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Pencil, Edit, Trash2, Plus, X, Check } from 'lucide-react';

export default function Carte() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('entrees');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const [categories, setCategories] = useState([
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
    },
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
    },
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

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    imagePath: ""
  });

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

  return (
    <section>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Notre Carte</h2>
        <div className="w-24 h-1 bg-[#C4B5A2] mx-auto mb-8"></div>
        <p className="text-gray-400">Découvrez notre sélection de plats exotiques</p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="inline-flex rounded-lg border border-[#C4B5A2] bg-[#2a2a2a] p-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
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
    </section>
  );
}


