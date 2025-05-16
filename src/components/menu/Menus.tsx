import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Pencil, Edit, Trash2, Plus, X, Check, Image } from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
// URL de l'API en production pour les images
const PROD_API_URL = 'https://tiki-resto-api.onrender.com';

// Fonction de débogage pour journaliser des informations utiles
const debug = (message: string, data?: any) => {
  console.log(`[DEBUG] ${message}`, data || '');
};

// Définition de l'interface Menu
interface Menu {
  id: number;
  name: string;
  price: string;
  items: string[] | null;
  info?: string;
  highlight: boolean;
  imageUrl?: string;
}

export default function Menu() {
  const { user, token } = useAuth();
  const [specialMenus, setSpecialMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [editingMenu, setEditingMenu] = useState<number | null>(null);
  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [newMenu, setNewMenu] = useState<Omit<Menu, 'id'>>({
    name: "",
    price: "",
    items: [""],
    info: "",
    highlight: false,
    imageUrl: ""
  });

  // Chargement des données au chargement du composant
  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/menus`);
      if (!response.ok) throw new Error('Failed to load menus');
      const data = await response.json();
      console.log('Menus chargés depuis l\'API:', data); // Log pour déboguer
      setSpecialMenus(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load menus:', error);
      toast.error('Erreur lors du chargement des menus');
      setIsLoading(false);
    }
  };

  const handleEditMenu = (index: number) => {
    setEditingMenu(index);
    const menuToEdit = specialMenus[index];
    setNewMenu({
      name: menuToEdit.name,
      price: menuToEdit.price,
      items: menuToEdit.items ? [...menuToEdit.items] : [""],
      info: menuToEdit.info || "",
      highlight: menuToEdit.highlight,
      imageUrl: menuToEdit.imageUrl || ""
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

      if (!response.ok) throw new Error('Failed to update menu');
      
      await loadMenus(); // Recharger les menus depuis le backend
      setEditingMenu(null);
      toast.success('Menu mis à jour avec succès');
    } catch (error) {
      console.error('Error updating menu:', error);
      toast.error('Erreur lors de la mise à jour du menu');
    }
  };

  const handleDeleteMenu = async (index: number) => {
    try {
      const menuToDelete = specialMenus[index];
      
      const response = await fetch(`${API_URL}/menus/${menuToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete menu');
      
      await loadMenus(); // Recharger les menus depuis le backend
      toast.success('Menu supprimé avec succès');
    } catch (error) {
      console.error('Error deleting menu:', error);
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

      if (!response.ok) throw new Error('Failed to create menu');
      
      await loadMenus(); // Recharger les menus depuis le backend
      setIsAddingMenu(false);
      setNewMenu({
        name: "",
        price: "",
        items: [""],
        info: "",
        highlight: false,
        imageUrl: ""
      });
      toast.success('Menu ajouté avec succès');
    } catch (error) {
      console.error('Error creating menu:', error);
      toast.error('Erreur lors de la création du menu');
    }
  };

  const handleAddMenuItem = () => {
    setNewMenu({
      ...newMenu,
      items: newMenu.items ? [...newMenu.items, ""] : [""]
    });
  };

  const handleRemoveMenuItem = (index: number) => {
    if (!newMenu.items) return;
    
    setNewMenu({
      ...newMenu,
      items: newMenu.items.filter((_, idx) => idx !== index)
    });
  };

  // Fonction pour upload d'image
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null;
    
    setIsUploading(true);
    toast.loading('Téléchargement de l\'image en cours...');
    
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
        const errorText = await response.text();
        console.error('Erreur serveur:', errorText);
        throw new Error(`Erreur lors du téléchargement de l'image (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Données reçues:', data);
      
      toast.dismiss();
      toast.success('Image téléchargée avec succès');
      
      // Convertir le chemin de l'image en URL
      return data.imagePath;
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      toast.dismiss();
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Téléchargement échoué'}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Afficher un indicateur de chargement
  if (isLoading) {
    return (
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Nos Menus</h2>
          <div className="w-24 h-1 bg-[#C4B5A2] mx-auto"></div>
        </div>
        <div className="text-center text-gray-400">Chargement des menus...</div>
      </section>
    );
  }

  return (
    <section className="mb-20">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-didot-bold mb-4">Nos Menus</h2>
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
          {newMenu.items && newMenu.items.map((item, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                className="flex-1 p-2 bg-gray-800 rounded"
                placeholder="Item du menu"
                value={item}
                onChange={(e) => {
                  if (!newMenu.items) return;
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
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">Image du menu (optionnel)</label>
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
                      setNewMenu({ ...newMenu, imageUrl: imagePath });
                    }
                  }
                }}
              />
              <div className="text-center text-gray-400">
                {isUploading ? (
                  <p>Upload en cours...</p>
                ) : (
                  <>
                    <div className="flex justify-center mb-2">
                      <Image size={40} className="text-gray-500" />
                    </div>
                    <p>Déposez votre image ici ou cliquez pour sélectionner</p>
                    {newMenu.imageUrl && (
                      <div className="mt-4">
                        <p className="text-green-500 mb-2">Image sélectionnée: {newMenu.imageUrl.split('/').pop()}</p>
                        <img 
                          src={`${API_URL}${newMenu.imageUrl}`} 
                          alt="Aperçu" 
                          className="max-h-40 mx-auto rounded" 
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
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
              disabled={isUploading}
            >
              <Check size={20} />
              Sauvegarder
            </button>
            <button
              onClick={() => setIsAddingMenu(false)}
              className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              disabled={isUploading}
            >
              <X size={20} />
              Annuler
            </button>
          </div>
        </div>
      )}

      {specialMenus.length === 0 && !isAddingMenu && (
        <div className="text-center text-gray-400">
          Aucun menu disponible pour le moment.
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
                : 'border-[#5e5549]'
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
                {(newMenu.items || []).map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      className="flex-1 p-2 bg-gray-800 rounded"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...(newMenu.items || [])];
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
                <div className="mb-4">
                  <label className="block text-sm text-gray-300 mb-1">Image du menu (optionnel)</label>
                  <div className="mt-2 relative border-2 border-dashed border-gray-600 rounded p-4">
                    <input
                      type="file"
                      accept="image/*"
                      ref={editFileInputRef}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const imagePath = await uploadImage(file);
                          
                          if (imagePath) {
                            setNewMenu({ ...newMenu, imageUrl: imagePath });
                          }
                        }
                      }}
                    />
                    <div className="text-center text-gray-400">
                      {isUploading ? (
                        <p>Upload en cours...</p>
                      ) : (
                        <>
                          <div className="flex justify-center mb-2">
                            <Image size={40} className="text-gray-500" />
                          </div>
                          <p>Déposez votre image ici ou cliquez pour sélectionner</p>
                          {newMenu.imageUrl && (
                            <div className="mt-4">
                              <p className="text-green-500 mb-2">Image sélectionnée: {newMenu.imageUrl.split('/').pop()}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
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
                    disabled={isUploading}
                  >
                    <Check size={20} />
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => setEditingMenu(null)}
                    className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                    disabled={isUploading}
                  >
                    <X size={20} />
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{menu.name}</h3>
                  <span className="text-[#C4B5A2] font-bold">{menu.price}</span>
                </div>
                
                {menu.items && menu.items.length > 0 && (
                  <ul className="mb-4 space-y-2">
                    {menu.items.map((item, idx) => (
                      <li key={idx} className="text-gray-300">• {item}</li>
                    ))}
                  </ul>
                )}
                
                {menu.info && (
                  <p className="text-sm text-gray-400 italic mb-4">{menu.info}</p>
                )}

                {menu.imageUrl && (
                  <div className="mb-4">
                    <button
                      onClick={() => {
                        // Ouvrir l'image dans un nouvel onglet
                        window.open(`${API_URL}${menu.imageUrl}`, '_blank');
                      }}
                      className="flex items-center gap-2 bg-[#C4B5A2] text-black px-3 py-2 rounded-md hover:bg-[#a39482] inline-block"
                    >
                      <Image size={16} />
                      Consulter l'image du menu
                    </button>
                  </div>
                )}

                {user?.role === 'admin' && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditMenu(index)}
                      className="flex items-center gap-1 bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      <Pencil size={16} />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteMenu(index)}
                      className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      <Trash2 size={16} />
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