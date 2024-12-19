<<<<<<< HEAD
"use client"

export default function Menu() {

  const specialMenus = [
=======
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Pencil, Edit, Trash2, Plus, X, Check } from 'lucide-react';

export default function Menu() {
  const { user } = useAuth();
  const [specialMenus, setSpecialMenus] = useState([
>>>>>>> Quentin-AdminPart
    {
      name: "Menu Grenouilles à Volonté",
      price: "35€",
      items: [
        "Entrée au choix parmi la carte",
        "Grenouilles à volonté persillées ou sauce crémeuse",
        "Dessert au choix parmi la carte"
      ],
      info: "les soirs uniquement",
<<<<<<< HEAD
      highlight: true // Pour le mettre en évidence
=======
      highlight: true
>>>>>>> Quentin-AdminPart
    },
    {
      name: "Menu Affaires",
      price: "24€",
      items: [
        "Entrée au choix parmi la carte",
        "Plat au choix parmi la carte",
        "Dessert au choix parmi la carte"
      ],
      info: "Du lundi au vendredi midi uniquement"
    }
<<<<<<< HEAD
  ];

  return (
    <section className="mb-20">
        <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Nos Menus</h2>
        <div className="w-24 h-1 bg-[#C4B5A2] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {specialMenus.map((menu, index) => (
            <div 
            key={index}
            className={`
                bg-[#2a2a2a] rounded-xl p-8 border-2
                ${menu.highlight 
                ? 'border-[#C4B5A2] shadow-lg shadow-[#C4B5A2]/10' 
                : 'border-gray-800'
                }
            `}
            >
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold">{menu.name}</h3>
                <span className="text-2xl font-bold text-[#C4B5A2]">{menu.price}</span>
            </div>
            
            <ul className="space-y-3 mb-6">
                {menu.items.map((item, idx) => (
                <li key={idx} className="flex items-baseline gap-2">
                    <span className="text-[#C4B5A2]">•</span>
                    <span className="text-gray-300">{item}</span>
                </li>
                ))}
            </ul>

            {menu.info && (
                <p className="text-sm text-gray-400 italic mt-4 border-t border-#C4B5A2 pt-4">
                {menu.info}
                </p>
            )}
            </div>
        ))}
        </div>
=======
  ]);

  const [editingMenu, setEditingMenu] = useState(null);
  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [newMenu, setNewMenu] = useState({
    name: "",
    price: "",
    items: [""],
    info: "",
    highlight: false
  });

  const handleEditMenu = (index) => {
    setEditingMenu(index);
    setNewMenu(specialMenus[index]);
  };

  const handleSaveMenu = (index) => {
    const updatedMenus = [...specialMenus];
    updatedMenus[index] = newMenu;
    setSpecialMenus(updatedMenus);
    setEditingMenu(null);
  };

  const handleDeleteMenu = (index) => {
    const updatedMenus = specialMenus.filter((_, idx) => idx !== index);
    setSpecialMenus(updatedMenus);
  };

  const handleAddMenu = () => {
    setSpecialMenus([...specialMenus, newMenu]);
    setIsAddingMenu(false);
    setNewMenu({
      name: "",
      price: "",
      items: [""],
      info: "",
      highlight: false
    });
  };

  const handleAddMenuItem = () => {
    setNewMenu({
      ...newMenu,
      items: [...newMenu.items, ""]
    });
  };

  const handleRemoveMenuItem = (index) => {
    setNewMenu({
      ...newMenu,
      items: newMenu.items.filter((_, idx) => idx !== index)
    });
  };

  return (
    <section className="mb-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Nos Menus</h2>
        <div className="w-24 h-1 bg-[#C4B5A2] mx-auto"></div>
      </div>

      {user?.role === 'admin' && !isAddingMenu && (
        <button
          onClick={() => setIsAddingMenu(true)}
          className="mb-8 flex items-center gap-2 bg-[#C4B5A2] text-black px-4 py-2 rounded-md hover:bg-[#a39482]"
        >
          <Plus size={20} />
          Ajouter un menu
        </button>
      )}

      {isAddingMenu && (
        <div className="mb-8 bg-[#2a2a2a] rounded-xl p-8 border-2 border-[#C4B5A2]">
          <input
            className="w-full mb-4 p-2 bg-gray-800 rounded"
            placeholder="Nom du menu"
            value={newMenu.name}
            onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
          />
          <input
            className="w-full mb-4 p-2 bg-gray-800 rounded"
            placeholder="Prix"
            value={newMenu.price}
            onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
          />
          {newMenu.items.map((item, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                className="flex-1 p-2 bg-gray-800 rounded"
                placeholder="Item du menu"
                value={item}
                onChange={(e) => {
                  const newItems = [...newMenu.items];
                  newItems[idx] = e.target.value;
                  setNewMenu({ ...newMenu, items: newItems });
                }}
              />
              <button
                onClick={() => handleRemoveMenuItem(idx)}
                className="p-2 bg-red-600 rounded hover:bg-red-700"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddMenuItem}
            className="fixed bottom-4 right-4 z-40 p-4 rounded-full bg-[#C4B5A2] text-black hover:bg-[#a39582] transition-colors shadow-lg"
          >
            <Edit className="w-6 h-6" />
          </button>
          <input
            className="w-full mb-4 p-2 bg-gray-800 rounded"
            placeholder="Information supplémentaire"
            value={newMenu.info}
            onChange={(e) => setNewMenu({ ...newMenu, info: e.target.value })}
          />
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={newMenu.highlight}
              onChange={(e) => setNewMenu({ ...newMenu, highlight: e.target.checked })}
            />
            <label>Mettre en évidence</label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddMenu}
              className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              <Check size={20} />
              Sauvegarder
            </button>
            <button
              onClick={() => setIsAddingMenu(false)}
              className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              <X size={20} />
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {specialMenus.map((menu, index) => (
          <div
            key={index}
            className={`
              bg-[#2a2a2a] rounded-xl p-8 border-2
              ${menu.highlight 
                ? 'border-[#C4B5A2] shadow-lg shadow-[#C4B5A2]/10' 
                : 'border-gray-800'
              }
            `}
          >
            {editingMenu === index ? (
              <div>
                <input
                  className="w-full mb-4 p-2 bg-gray-800 rounded"
                  value={newMenu.name}
                  onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                />
                <input
                  className="w-full mb-4 p-2 bg-gray-800 rounded"
                  value={newMenu.price}
                  onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
                />
                {newMenu.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      className="flex-1 p-2 bg-gray-800 rounded"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...newMenu.items];
                        newItems[idx] = e.target.value;
                        setNewMenu({ ...newMenu, items: newItems });
                      }}
                    />
                    <button
                      onClick={() => handleRemoveMenuItem(idx)}
                      className="p-2 bg-red-600 rounded hover:bg-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddMenuItem}
                  className="mb-4 flex items-center gap-2 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                >
                  <Plus size={20} />
                  Ajouter un item
                </button>
                <input
                  className="w-full mb-4 p-2 bg-gray-800 rounded"
                  value={newMenu.info}
                  onChange={(e) => setNewMenu({ ...newMenu, info: e.target.value })}
                />
                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newMenu.highlight}
                    onChange={(e) => setNewMenu({ ...newMenu, highlight: e.target.checked })}
                  />
                  <label>Mettre en évidence</label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveMenu(index)}
                    className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                  >
                    <Check size={20} />
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => setEditingMenu(null)}
                    className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                  >
                    <X size={20} />
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold">{menu.name}</h3>
                  <span className="text-2xl font-bold text-[#C4B5A2]">{menu.price}</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {menu.items.map((item, idx) => (
                    <li key={idx} className="flex items-baseline gap-2">
                      <span className="text-[#C4B5A2]">•</span>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>

                {menu.info && (
                  <p className="text-sm text-gray-400 italic mt-4 border-t border-[#C4B5A2] pt-4">
                    {menu.info}
                  </p>
                )}

                {user?.role === 'admin' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => handleEditMenu(index)}
                      className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                    >
                      <Pencil size={20} />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteMenu(index)}
                      className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                    >
                      <Trash2 size={20} />
                      Supprimer
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
>>>>>>> Quentin-AdminPart
    </section>
  );
}