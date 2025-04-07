"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Pencil, Edit, Trash2, Plus, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface WinePrice {
  bottle: string;
  glass?: string;
}

interface Wine {
  id: number;
  name: string;
  region: string;
  price: WinePrice;
  category: string;
}

interface WineData {
  [category: string]: Wine[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Wines() {
  const { user, token } = useAuth();
  const [wines, setWines] = useState<WineData>({});
  const [editingWine, setEditingWine] = useState<{ category: string | null, index: number | null }>({ category: null, index: null });
  const [isAddingWine, setIsAddingWine] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('rouges');
  const [isLoading, setIsLoading] = useState(true);
  const [newWine, setNewWine] = useState({
    name: "",
    region: "",
    price: {
      bottle: "",
      glass: ""
    },
    category: "rouges"
  });

  const categories = {
    rouges: "Vins Rouges",
    blancs: "Vins Blancs",
    roses: "Vins Rosés",
    champagnes: "Champagnes"
  };

  // Chargement des données
  useEffect(() => {
    loadWines();
  }, []);

  const loadWines = async () => {
    try {
      const response = await fetch(`${API_URL}/wines`);
      if (!response.ok) throw new Error('Failed to load wines');
      const data = await response.json();
      setWines(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load wines:', error);
      toast.error('Erreur lors du chargement des vins');
      setIsLoading(false);
    }
  };

  const handleEditWine = (category: string, index: number) => {
    const wine = wines[category][index];
    setEditingWine({ category, index });
    setNewWine({
      name: wine.name,
      region: wine.region,
      price: {
        bottle: wine.price.bottle,
        glass: wine.price.glass || ""
      },
      category: wine.category
    });
  };

  const handleSaveWine = async (category: string, index: number) => {
    try {
      const wineToUpdate = wines[category][index];
      
      const wineData = {
        name: newWine.name,
        region: newWine.region,
        bottlePrice: newWine.price.bottle,
        glassPrice: newWine.price.glass || null,
        category: newWine.category
      };
      
      const response = await fetch(`${API_URL}/wines/${wineToUpdate.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(wineData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update wine');
      }

      await loadWines();
      setEditingWine({ category: null, index: null });
      toast.success('Vin mis à jour avec succès');
    } catch (error) {
      console.error('Failed to update wine:', error);
      toast.error('Erreur lors de la mise à jour du vin');
    }
  };

  const handleDeleteWine = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce vin ?')) return;

    try {
      const response = await fetch(`${API_URL}/wines/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete wine');
      }

      await loadWines();
      toast.success('Vin supprimé avec succès');
    } catch (error) {
      console.error('Failed to delete wine:', error);
      toast.error('Erreur lors de la suppression du vin');
    }
  };

  const handleAddWine = async () => {
    try {
      const wineData = {
        name: newWine.name,
        region: newWine.region,
        bottlePrice: newWine.price.bottle,
        glassPrice: newWine.price.glass || null,
        category: selectedCategory
      };
      
      const response = await fetch(`${API_URL}/wines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(wineData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add wine');
      }

      await loadWines();
      setIsAddingWine(false);
      setNewWine({
        name: "",
        region: "",
        price: {
          bottle: "",
          glass: ""
        },
        category: selectedCategory
      });
      toast.success('Vin ajouté avec succès');
    } catch (error) {
      console.error('Failed to add wine:', error);
      toast.error('Erreur lors de l\'ajout du vin');
    }
  };

  const renderWineForm = () => (
    <div className="bg-[#2a2a2a] rounded-xl p-8 border-2 border-[#C4B5A2] mb-8">
      <input
        className="w-full mb-4 p-2 bg-gray-800 rounded"
        placeholder="Nom du vin"
        value={newWine.name}
        onChange={(e) => setNewWine({ ...newWine, name: e.target.value })}
      />
      <input
        className="w-full mb-4 p-2 bg-gray-800 rounded"
        placeholder="Région"
        value={newWine.region}
        onChange={(e) => setNewWine({ ...newWine, region: e.target.value })}
      />
      <input
        className="w-full mb-4 p-2 bg-gray-800 rounded"
        placeholder="Prix bouteille (ex: 35€)"
        value={newWine.price.bottle}
        onChange={(e) => setNewWine({
          ...newWine,
          price: { ...newWine.price, bottle: e.target.value }
        })}
      />
      <input
        className="w-full mb-4 p-2 bg-gray-800 rounded"
        placeholder="Prix verre (ex: 6€)"
        value={newWine.price.glass}
        onChange={(e) => setNewWine({
          ...newWine,
          price: { ...newWine.price, glass: e.target.value }
        })}
      />
      <div className="flex gap-2">
        <button
          onClick={handleAddWine}
          className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          <Check size={20} />
          Sauvegarder
        </button>
        <button
          onClick={() => setIsAddingWine(false)}
          className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          <X size={20} />
          Annuler
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-8">Chargement des vins...</div>;
  }

  return (
    <section className="mb-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Notre Carte des Vins</h2>
        <div className="w-24 h-1 bg-[#C4B5A2] mx-auto mb-8"></div>
      </div>

      {user?.role === 'admin' && !isAddingWine && (
        <div className="mb-8">
          <select
            className="mr-4 p-2 bg-gray-800 rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {Object.entries(categories).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
          <button
            onClick={() => setIsAddingWine(true)}
            className="flex items-center gap-2 bg-[#C4B5A2] text-black px-4 py-2 rounded-md hover:bg-[#a39482]"
          >
            <Plus size={20} />
            Ajouter un vin
          </button>
        </div>
      )}

      {isAddingWine && renderWineForm()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {Object.entries(wines).map(([category, categoryWines]) => (
          <div key={category}>
            <h3 className="text-2xl font-bold mb-6 text-[#C4B5A2]">{categories[category]}</h3>
            <div className="space-y-6">
              {categoryWines.map((wine, index) => (
                <div key={wine.id} className="border-b border-[#C4B5A2]/20 pb-4">
                  {editingWine.category === category && editingWine.index === index ? (
                    <div className="space-y-4">
                      <input
                        className="w-full p-2 bg-gray-800 rounded"
                        value={newWine.name}
                        onChange={(e) => setNewWine({ ...newWine, name: e.target.value })}
                      />
                      <input
                        className="w-full p-2 bg-gray-800 rounded"
                        value={newWine.region}
                        onChange={(e) => setNewWine({ ...newWine, region: e.target.value })}
                      />
                      <input
                        className="w-full p-2 bg-gray-800 rounded"
                        value={newWine.price.bottle}
                        onChange={(e) => setNewWine({
                          ...newWine,
                          price: { ...newWine.price, bottle: e.target.value }
                        })}
                      />
                      <input
                        className="w-full p-2 bg-gray-800 rounded"
                        value={newWine.price.glass}
                        onChange={(e) => setNewWine({
                          ...newWine,
                          price: { ...newWine.price, glass: e.target.value }
                        })}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveWine(category, index)}
                          className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                        >
                          <Check size={20} />
                          Sauvegarder
                        </button>
                        <button
                          onClick={() => setEditingWine({ category: null, index: null })}
                          className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                        >
                          <X size={20} />
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold">{wine.name}</h4>
                          <p className="text-gray-400 text-sm">{wine.region}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#C4B5A2]">
                            {wine.price.bottle && !wine.price.bottle.includes('€') ? `${wine.price.bottle} €` : wine.price.bottle}
                          </p>
                          {wine.price.glass && (
                            <p className="text-sm text-gray-400">
                              Verre : {wine.price.glass && !wine.price.glass.includes('€') ? `${wine.price.glass} €` : wine.price.glass}
                            </p>
                          )}
                        </div>
                      </div>
                      {user?.role === 'admin' && (
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleEditWine(category, index)}
                            className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                          >
                            <Pencil size={20} />
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteWine(wine.id)}
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
          </div>
        ))}
      </div>
    </section>
  );
}