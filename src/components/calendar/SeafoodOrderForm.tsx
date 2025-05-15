"use client"

import { useState, useEffect } from 'react';
import { X, Plus, Minus, Package } from 'lucide-react';

interface Plateau {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

interface Item {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

interface SeafoodOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupDate: string;
  pickupTime: string;
  isPickup: boolean;
  plateaux: Plateau[];
  items: Item[];
  totalPrice: number;
  specialRequests?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface SeafoodOrderFormProps {
  order: SeafoodOrder | null;
  onSubmit: (order: SeafoodOrder) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  availablePlateaux: Plateau[];
  availableItems: Item[];
}

export default function SeafoodOrderForm({
  order,
  onSubmit,
  onCancel,
  isSubmitting,
  availablePlateaux,
  availableItems
}: SeafoodOrderFormProps) {
  const [formData, setFormData] = useState<SeafoodOrder>({
    id: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    pickupDate: '',
    pickupTime: '',
    isPickup: true,
    plateaux: [],
    items: [],
    totalPrice: 0,
    specialRequests: '',
    status: 'pending',
    createdAt: '',
    updatedAt: ''
  });

  // Initialiser le formulaire avec les données de la commande si elles existent
  useEffect(() => {
    if (order) {
      setFormData({
        ...order,
        plateaux: [...order.plateaux],
        items: [...order.items]
      });
    }
  }, [order]);

  // Mettre à jour le prix total à chaque changement des articles
  useEffect(() => {
    const plateauxTotal = formData.plateaux.reduce((sum, plateau) => sum + (plateau.price * plateau.quantity), 0);
    const itemsTotal = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setFormData(prev => ({
      ...prev,
      totalPrice: plateauxTotal + itemsTotal
    }));
  }, [formData.plateaux, formData.items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'isPickup') {
      setFormData(prev => ({
        ...prev,
        isPickup: value === 'true'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  // Ajouter un plateau à la commande
  const addPlateau = (plateau: Plateau) => {
    const existingIndex = formData.plateaux.findIndex(p => p.id === plateau.id);
    
    if (existingIndex >= 0) {
      // Si le plateau existe déjà, augmenter la quantité
      const updatedPlateaux = [...formData.plateaux];
      updatedPlateaux[existingIndex] = {
        ...updatedPlateaux[existingIndex],
        quantity: updatedPlateaux[existingIndex].quantity + 1
      };
      
      setFormData(prev => ({
        ...prev,
        plateaux: updatedPlateaux
      }));
    } else {
      // Sinon, ajouter un nouveau plateau
      setFormData(prev => ({
        ...prev,
        plateaux: [...prev.plateaux, { ...plateau, quantity: 1 }]
      }));
    }
  };

  // Ajouter un article à la commande
  const addItem = (item: Item) => {
    const existingIndex = formData.items.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      // Si l'article existe déjà, augmenter la quantité
      const updatedItems = [...formData.items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + 1
      };
      
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }));
    } else {
      // Sinon, ajouter un nouvel article
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { ...item, quantity: 1 }]
      }));
    }
  };

  // Supprimer un plateau de la commande
  const removePlateau = (id: string | number) => {
    setFormData(prev => ({
      ...prev,
      plateaux: prev.plateaux.filter(p => p.id !== id)
    }));
  };

  // Supprimer un article de la commande
  const removeItem = (id: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== id)
    }));
  };

  // Mettre à jour la quantité d'un plateau
  const updatePlateauQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removePlateau(id);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      plateaux: prev.plateaux.map(p => 
        p.id === id ? { ...p, quantity } : p
      )
    }));
  };

  // Mettre à jour la quantité d'un article
  const updateItemQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(i => 
        i.id === id ? { ...i, quantity } : i
      )
    }));
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#FF9370]/30">
      <h4 className="text-xl font-medium mb-6 text-[#FF9370] flex items-center">
        <Package className="w-5 h-5 mr-2" />
        {order ? 'Modifier la commande de fruits de mer' : 'Nouvelle commande de fruits de mer'}
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Informations client */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Nom du client*</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                className="w-full p-2 bg-[#2a2a2a] border border-[#444] rounded focus:outline-none focus:border-[#FF9370]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Téléphone*</label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                required
                className="w-full p-2 bg-[#2a2a2a] border border-[#444] rounded focus:outline-none focus:border-[#FF9370]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail || ''}
                onChange={handleInputChange}
                className="w-full p-2 bg-[#2a2a2a] border border-[#444] rounded focus:outline-none focus:border-[#FF9370]"
              />
            </div>
          </div>
          
          {/* Informations de livraison */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Date de retrait*</label>
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleInputChange}
                required
                className="w-full p-2 bg-[#2a2a2a] border border-[#444] rounded focus:outline-none focus:border-[#FF9370]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Heure de retrait*</label>
              <input
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleInputChange}
                required
                className="w-full p-2 bg-[#2a2a2a] border border-[#444] rounded focus:outline-none focus:border-[#FF9370]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Type de commande*</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPickup"
                    value="true"
                    checked={formData.isPickup}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  À emporter
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPickup"
                    value="false"
                    checked={!formData.isPickup}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Sur place
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Statut*</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full p-2 bg-[#2a2a2a] border border-[#444] rounded focus:outline-none focus:border-[#FF9370]"
              >
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="preparing">En préparation</option>
                <option value="ready">Prête</option>
                <option value="completed">Livrée/Récupérée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Plateaux et articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plateaux */}
          <div>
            <h5 className="text-lg font-medium mb-3 text-[#FF9370]">Plateaux</h5>
            
            {/* Liste des plateaux sélectionnés */}
            <div className="mb-4 space-y-2">
              {formData.plateaux.map((plateau, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-[#2a2a2a] rounded border border-[#444]">
                  <div className="flex-grow">
                    <span className="text-sm font-medium">{plateau.name}</span>
                    <span className="ml-2 text-xs text-gray-400">{plateau.price.toFixed(2)}€</span>
                  </div>
                  
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => updatePlateauQuantity(plateau.id, plateau.quantity - 1)}
                      className="p-1 text-gray-400 hover:text-gray-200"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-2">{plateau.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updatePlateauQuantity(plateau.id, plateau.quantity + 1)}
                      className="p-1 text-gray-400 hover:text-gray-200"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removePlateau(plateau.id)}
                      className="ml-2 p-1 text-red-400 hover:text-red-300"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Sélection des plateaux disponibles */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Ajouter un plateau</label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 bg-[#2a2a2a] rounded">
                {availablePlateaux.map(plateau => (
                  <button
                    key={plateau.id}
                    type="button"
                    onClick={() => addPlateau(plateau)}
                    className="flex justify-between items-center p-2 text-left bg-[#1a1a1a] rounded hover:bg-[#333] transition-colors"
                  >
                    <span>{plateau.name}</span>
                    <span>{plateau.price.toFixed(2)}€</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Articles */}
          <div>
            <h5 className="text-lg font-medium mb-3 text-[#FF9370]">Articles</h5>
            
            {/* Liste des articles sélectionnés */}
            <div className="mb-4 space-y-2">
              {formData.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-[#2a2a2a] rounded border border-[#444]">
                  <div className="flex-grow">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="ml-2 text-xs text-gray-400">{item.price.toFixed(2)}€</span>
                  </div>
                  
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-gray-400 hover:text-gray-200"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-gray-400 hover:text-gray-200"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="ml-2 p-1 text-red-400 hover:text-red-300"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Sélection des articles disponibles */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Ajouter un article</label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 bg-[#2a2a2a] rounded">
                {availableItems.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => addItem(item)}
                    className="flex justify-between items-center p-2 text-left bg-[#1a1a1a] rounded hover:bg-[#333] transition-colors"
                  >
                    <span>{item.name}</span>
                    <span>{item.price.toFixed(2)}€</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Notes spéciales */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Notes spéciales</label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests || ''}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-2 bg-[#2a2a2a] border border-[#444] rounded focus:outline-none focus:border-[#FF9370]"
          ></textarea>
        </div>
        
        {/* Prix total */}
        <div className="flex justify-end">
          <div className="text-right">
            <span className="block text-sm text-gray-400">Prix total:</span>
            <span className="text-xl font-bold text-[#FF9370]">{formData.totalPrice.toFixed(2)}€</span>
          </div>
        </div>
        
        {/* Boutons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#3a3a3a] text-gray-300 rounded-lg hover:bg-[#4a4a4a] transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#FF9370] text-black rounded-lg hover:bg-[#FF8060] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Enregistrement...' : (order ? 'Mettre à jour' : 'Ajouter')}
          </button>
        </div>
      </form>
    </div>
  );
} 