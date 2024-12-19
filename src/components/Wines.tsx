import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Pencil, Edit, Trash2, Plus, X, Check } from 'lucide-react';

export default function Wine() {
  const { user } = useAuth();
  const [wines, setWines] = useState({
    rouges: [
      {
        name: "Côtes du Rhône",
        region: "Vallée du Rhône",
        price: {
          bottle: "28€",
          glass: "6€"
        }
      },
      {
        name: "Saint-Joseph",
        region: "Vallée du Rhône",
        price: {
          bottle: "45€",
          glass: "8€"
        }
      }
    ],
    blancs: [
      {
        name: "Pouilly-Fuissé",
        region: "Bourgogne",
        price: {
          bottle: "42€",
          glass: "8€"
        }
      }
    ],
    roses: [
      {
        name: "Côtes de Provence",
        region: "Provence",
        price: {
          bottle: "32€",
          glass: "6€"
        }
      }
    ],
    champagnes: [
      {
        name: "Moët & Chandon",
        region: "Champagne",
        price: {
          bottle: "85€",
          glass: "12€"
        }
      }
    ]
  });

  const [editingWine, setEditingWine] = useState({ category: null, index: null });
  const [isAddingWine, setIsAddingWine] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('rouges');
  const [newWine, setNewWine] = useState({
    name: "",
    region: "",
    price: {
      bottle: "",
      glass: ""
    }
  });

  const categories = {
    rouges: "Vins Rouges",
    blancs: "Vins Blancs",
    roses: "Vins Rosés",
    champagnes: "Champagnes"
  };

  const handleEditWine = (category, index) => {
    setEditingWine({ category, index });
    setNewWine(wines[category][index]);
  };

  const handleSaveWine = (category, index) => {
    const updatedWines = { ...wines };
    updatedWines[category][index] = newWine;
    setWines(updatedWines);
    setEditingWine({ category: null, index: null });
  };

  const handleDeleteWine = (category, index) => {
    const updatedWines = { ...wines };
    updatedWines[category] = updatedWines[category].filter((_, idx) => idx !== index);
    setWines(updatedWines);
  };

  const handleAddWine = () => {
    const updatedWines = { ...wines };
    updatedWines[selectedCategory] = [...updatedWines[selectedCategory], newWine];
    setWines(updatedWines);
    setIsAddingWine(false);
    setNewWine({
      name: "",
      region: "",
      price: {
        bottle: "",
        glass: ""
      }
    });
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
                <div key={index} className="border-b border-[#C4B5A2]/20 pb-4">
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
                          <p className="text-[#C4B5A2]">{wine.price.bottle}</p>
                          {wine.price.glass && (
                            <p className="text-sm text-gray-400">Verre : {wine.price.glass}</p>
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
                            onClick={() => handleDeleteWine(category, index)}
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