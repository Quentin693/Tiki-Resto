"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Pencil, Edit, Trash2, Plus, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MenuItem {
  id: number;
  name: string;
  price: string;
  items: string[];
  info?: string;
  highlight?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Menu() {
  const { user, token } = useAuth();
  const [specialMenus, setSpecialMenus] = useState<MenuItem[]>([]);
  const [editingMenu, setEditingMenu] = useState<number | null>(null);
  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newMenu, setNewMenu] = useState({
    name: "",
    price: "",
    items: [""],
    info: "",
    highlight: false
  });

  // Chargement des données
  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      const response = await fetch(`${API_URL}/menus`);
      if (!response.ok) throw new Error('Failed to load menus');
      const data = await response.json();
      setSpecialMenus(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load menus:', error);
      toast.error('Erreur lors du chargement des menus');
      setIsLoading(false);
    }
  };

  const handleEditMenu = (index: number) => {
    const menu = specialMenus[index];
    setEditingMenu(index);
    setNewMenu({
      name: menu.name,
      price: menu.price,
      items: [...menu.items],
      info: menu.info || "",
      highlight: menu.highlight || false
    });
  };

  const handleSaveMenu = async (index: number) => {
    try {
      const menuToUpdate = specialMenus[index];
      const response = await fetch(`${API_URL}/menus/${menuToUpdate.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newMenu),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update menu');
      }

      await loadMenus();
      setEditingMenu(null);
      toast.success('Menu mis à jour avec succès');
    } catch (error) {
      console.error('Failed to update menu:', error);
      toast.error('Erreur lors de la mise à jour du menu');
    }
  };

  const handleDeleteMenu = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce menu ?')) return;

    try {
      const response = await fetch(`${API_URL}/menus/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete menu');
      }

      await loadMenus();
      toast.success('Menu supprimé avec succès');
    } catch (error) {
      console.error('Failed to delete menu:', error);
      toast.error('Erreur lors de la suppression du menu');
    }
  };

  const handleAddMenu = async () => {
    try {
      const response = await fetch(`${API_URL}/menus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newMenu),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add menu');
      }

      await loadMenus();
      setIsAddingMenu(false);
      setNewMenu({
        name: "",
        price: "",
        items: [""],
        info: "",
        highlight: false
      });
      toast.success('Menu ajouté avec succès');
    } catch (error) {
      console.error('Failed to add menu:', error);
      toast.error('Erreur lors de l\'ajout du menu');
    }
  };

  const handleAddMenuItem = () => {
    setNewMenu({
      ...newMenu,
      items: [...newMenu.items, ""]
    });
  };

  const handleRemoveMenuItem = (index: number) => {
    setNewMenu({
      ...newMenu,
      items: newMenu.items.filter((_, idx) => idx !== index)
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des menus...</div>;
  }

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
            className="mb-4 flex items-center gap-2 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
          >
            <Plus size={20} />
            Ajouter un item
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
            key={menu.id}
            className={`
              bg-[#2a2a2a] rounded-xl p-8 border-2
              ${menu.highlight 
                ? 'border-[#C4B5A2] shadow-lg shadow-[#C4B5A2]/10' 
                : 'border-[#736655]'
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
                  <span className="text-2xl font-bold text-[#C4B5A2]">
                    {menu.price && !menu.price.includes('€') ? `${menu.price} €` : menu.price}
                  </span>
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
                      onClick={() => handleDeleteMenu(menu.id)}
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
    </section>
  );
}