import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const AdminPanel = ({ isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('carte');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  if (!isAdmin) return null;

  const AdminButton = ({ onClick, children, className = "" }) => (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded bg-[#C4B5A2] text-black hover:bg-[#a39582] transition-colors ${className}`}
    >
      {children}
    </button>
  );

  const AdminControls = ({ item, onEdit, onDelete }) => (
    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        onClick={() => onEdit(item)}
        className="p-1 rounded bg-[#C4B5A2]/20 hover:bg-[#C4B5A2]/40 transition-colors"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button 
        onClick={() => onDelete(item)}
        className="p-1 rounded bg-red-500/20 hover:bg-red-500/40 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  const EditModal = ({ item, onClose, onSave }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#2a2a2a] rounded-xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Modifier l'élément</h3>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          // Logique de sauvegarde à implémenter
          onClose();
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-[#1a1a1a] rounded border border-[#C4B5A2]/20"
                defaultValue={item?.name}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea 
                className="w-full px-3 py-2 bg-[#1a1a1a] rounded border border-[#C4B5A2]/20"
                defaultValue={item?.description}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prix</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-[#1a1a1a] rounded border border-[#C4B5A2]/20"
                defaultValue={item?.price}
              />
            </div>
            {/* Ajoutez d'autres champs selon vos besoins */}
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="px-4 py-2 rounded bg-[#C4B5A2] text-black hover:bg-[#a39582] transition-colors"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Bouton flottant pour ouvrir le panel */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 p-4 rounded-full bg-[#C4B5A2] text-black hover:bg-[#a39582] transition-colors shadow-lg"
      >
        <Edit className="w-6 h-6" />
      </button>

      {/* Panel d'administration */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-[#1a1a1a] shadow-xl z-50 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Administration</h2>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation entre les sections */}
          <div className="flex gap-2 mb-8">
            {['carte', 'menus', 'vins'].map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded capitalize ${
                  activeSection === section 
                    ? 'bg-[#C4B5A2] text-black' 
                    : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                }`}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Bouton d'ajout */}
          <button
            onClick={() => {
              setEditingItem({});
              setIsEditing(true);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-[#C4B5A2] text-black hover:bg-[#a39582] transition-colors mb-6"
          >
            <Plus className="w-4 h-4" />
            Ajouter un élément
          </button>

          {/* Liste des éléments éditables */}
          <div className="space-y-4">
            {/* Ici, vous mappez sur les éléments de la section active */}
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {isEditing && (
        <EditModal
          item={editingItem}
          onClose={() => {
            setIsEditing(false);
            setEditingItem(null);
          }}
          onSave={() => {
            // Logique de sauvegarde à implémenter
            setIsEditing(false);
            setEditingItem(null);
          }}
        />
      )}
    </>
  );
};

export default AdminPanel;