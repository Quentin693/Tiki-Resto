"use client"

import { useState } from 'react';
import { Clock, Package, Trash2, AlertTriangle, CheckCircle, XCircle, Edit, ShoppingBag, Truck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Interface pour les commandes de fruits de mer
interface SeafoodOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupDate: string;
  pickupTime: string;
  isPickup: boolean; // à emporter ou sur place
  plateaux: any[];
  items: any[];
  totalPrice: number;
  specialRequests?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface SeafoodOrdersListProps {
  orders: SeafoodOrder[];
  onEdit: (order: SeafoodOrder) => void;
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: string) => void;
  isDeleting: boolean;
}

export default function SeafoodOrdersList({ 
  orders, 
  onEdit, 
  onDelete, 
  onStatusUpdate, 
  isDeleting 
}: SeafoodOrdersListProps) {
  // État pour gérer le modal de confirmation de suppression
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  // État pour afficher toutes les commandes, y compris celles terminées
  const [showAll, setShowAll] = useState(false);
  // Récupérer l'utilisateur courant et vérifier s'il est admin
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  
  const handleDelete = (id: string) => {
    setConfirmingDelete(id);
  };
  
  const confirmDelete = () => {
    if (confirmingDelete !== null) {
      onDelete(confirmingDelete);
      setConfirmingDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setConfirmingDelete(null);
  };

  const handleStatusChange = (order: SeafoodOrder, newStatus: string) => {
    onStatusUpdate(order.id, newStatus);
  };

  // Filtrer les commandes en fonction de l'état showAll
  const filteredOrders = !isAdmin 
    ? orders 
    : (showAll 
        ? orders 
        : orders.filter(order => order.status !== 'completed' && order.status !== 'cancelled'));

  // Liste des statuts possibles pour les commandes
  const statusOptions = [
    { value: 'pending', label: 'En attente', color: 'bg-yellow-500/20 text-yellow-300' },
    { value: 'confirmed', label: 'Confirmée', color: 'bg-blue-500/20 text-blue-300' },
    { value: 'preparing', label: 'En préparation', color: 'bg-purple-500/20 text-purple-300' },
    { value: 'ready', label: 'Prête', color: 'bg-green-500/20 text-green-300' },
    { value: 'completed', label: 'Livrée/Récupérée', color: 'bg-green-700/20 text-green-500' },
    { value: 'cancelled', label: 'Annulée', color: 'bg-red-500/20 text-red-300' }
  ];

  // Fonction pour obtenir les informations d'affichage du statut
  const getStatusInfo = (status: string) => {
    return statusOptions.find(option => option.value === status) || 
           { value: status, label: status, color: 'bg-gray-500/20 text-gray-300' };
  };

  // Calculer le nombre total d'articles pour une commande
  const getTotalItems = (order: SeafoodOrder) => {
    const plateauxCount = order.plateaux?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const itemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    return plateauxCount + itemsCount;
  };

  return (
    <div className="space-y-4 mt-6 relative">
      {/* En-tête de la section */}
      <div className="flex justify-between items-center">
        <div>
          {filteredOrders.length === 0 
            ? (showAll ? 'Aucune commande pour cette date' : 'Aucune commande en cours') 
            : `${filteredOrders.length} commande(s) trouvée(s)`
          }
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="px-3 py-1 text-sm rounded-md transition-colors bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#FF9370]"
          >
            {showAll ? 'Masquer terminées' : 'Afficher tout'}
          </button>
        )}
      </div>
      
      {/* Modal de confirmation de suppression */}
      {confirmingDelete !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-lg p-6 max-w-md w-full mx-4 border border-[#FF9370]/30 shadow-xl">
            <div className="flex items-center text-amber-400 mb-4">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <h3 className="text-xl font-bold">Confirmer la suppression</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer cette commande de fruits de mer ? Cette action est irréversible.
            </p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 bg-[#3a3a3a] text-gray-300 rounded-lg hover:bg-[#4a4a4a] transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Suppression...' : 'Confirmer la suppression'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {filteredOrders.length > 0 ? (
        filteredOrders
          .sort((a, b) => new Date(a.pickupDate + 'T' + a.pickupTime).getTime() - new Date(b.pickupDate + 'T' + b.pickupTime).getTime())
          .map(order => (
            <div 
              key={order.id}
              className={`bg-[#1A1A1A] rounded-lg p-4 border ${
                order.status === 'completed' 
                  ? 'border-green-500/30 bg-green-900/10' 
                  : order.status === 'cancelled'
                  ? 'border-red-500/30 bg-red-900/10'
                  : 'border-[#FF9370]/30'
              }`}
            >
              <div className="flex flex-wrap justify-between">
                <div className="w-full md:w-7/12">
                  <div className="flex items-center mb-1 flex-wrap gap-2">
                    <span className="font-medium text-[#FF9370]">
                      {order.pickupTime}
                    </span>
                    <span className="px-2 py-0.5 bg-[#FF9370]/20 rounded-full text-xs text-[#FF9370] flex items-center">
                      {order.isPickup ? (
                        <><ShoppingBag size={12} className="mr-1" /> À emporter</>
                      ) : (
                        <><Truck size={12} className="mr-1" /> Sur place</>
                      )}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs flex items-center ${getStatusInfo(order.status).color}`}>
                      {getStatusInfo(order.status).label}
                    </span>
                  </div>
                  
                  <p className="text-white font-medium">{order.customerName}</p>
                  <p className="text-gray-400 text-sm">{order.customerPhone}</p>
                  {order.customerEmail && (
                    <p className="text-gray-400 text-sm">{order.customerEmail}</p>
                  )}
                  
                  <div className="mt-2 p-3 bg-[#222] rounded border border-[#FF9370]/20">
                    <h5 className="font-medium text-sm mb-2 text-[#FF9370]">Détails de la commande:</h5>
                    {order.plateaux && order.plateaux.length > 0 && (
                      <div className="mb-2">
                        <p className="font-medium text-xs uppercase mb-1 text-gray-400">Plateaux:</p>
                        <ul className="list-disc ml-4 space-y-1">
                          {order.plateaux.map((plateau, index) => (
                            <li key={index} className="text-gray-300">
                              {plateau.name} x{plateau.quantity}
                              <span className="text-xs text-gray-400 ml-2">
                                ({typeof plateau.price === 'number' ? plateau.price.toFixed(2) : '0.00'}€)
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {order.items && order.items.length > 0 && (
                      <div className="mb-2">
                        <p className="font-medium text-xs uppercase mb-1 text-gray-400">Articles:</p>
                        <ul className="list-disc ml-4 space-y-1">
                          {order.items.map((item, index) => (
                            <li key={index} className="text-gray-300">
                              {item.name} x{item.quantity}
                              <span className="text-xs text-gray-400 ml-2">
                                ({typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}€)
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-3 border-t border-[#333] pt-2">
                      <p className="text-right font-medium text-[#FF9370] text-lg">
                        Total: {typeof order.totalPrice === 'number' ? order.totalPrice.toFixed(2) : '0.00'}€
                      </p>
                    </div>
                  </div>
                  
                  {order.specialRequests && (
                    <div className="mt-2 p-2 bg-[#2a2a2a] rounded border border-[#3a3a3a]">
                      <p className="text-xs font-medium text-gray-400">Notes:</p>
                      <p className="text-sm text-gray-300">{order.specialRequests}</p>
                    </div>
                  )}
                </div>
                
                <div className="w-full md:w-4/12 mt-4 md:mt-0 flex flex-col justify-between">
                  {isAdmin && (
                    <div className="mb-4">
                      <label className="text-sm text-gray-400 block mb-1">Changer le statut:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {statusOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => handleStatusChange(order, option.value)}
                            disabled={order.status === option.value}
                            className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                              order.status === option.value
                                ? `${option.color} opacity-50 cursor-not-allowed`
                                : `${option.color.replace('text-', 'text-')} hover:opacity-80`
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 justify-end mt-auto">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onEdit(order);
                      }}
                      className="px-4 py-2 border border-blue-500/70 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors font-medium"
                    >
                      <Edit size={16} className="inline mr-1" /> Modifier
                    </button>
                    
                    <button
                      onClick={() => handleDelete(order.id)}
                      disabled={isDeleting || confirmingDelete !== null}
                      className="px-4 py-2 border border-red-500/70 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} className="inline mr-1" /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
      ) : (
        <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#FF9370]/20 text-center">
          <p className="text-gray-400">Aucune commande de fruits de mer pour cette date</p>
        </div>
      )}
    </div>
  );
} 