"use client"

import React, { useState } from 'react';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import { Button } from '@mui/material';

export default function EditableComponent({ item, editMode, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  if (!editMode) {
    return (
      <div className="p-4 border border-[#C4B5A2]/20 rounded-lg">
        {/* Affichage normal du contenu */}
        <h3 className="text-xl font-semibold">{item.name}</h3>
        <p className="text-gray-300">{item.description}</p>
        <p className="text-[#C4B5A2]">{item.price} €</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="p-4 border border-[#C4B5A2] rounded-lg">
        <input
          type="text"
          value={editedItem.name}
          onChange={(e) => setEditedItem({...editedItem, name: e.target.value})}
          className="w-full bg-[#1a1a1a] p-2 rounded mb-2"
        />
        <textarea
          value={editedItem.description}
          onChange={(e) => setEditedItem({...editedItem, description: e.target.value})}
          className="w-full bg-[#1a1a1a] p-2 rounded mb-2"
        />
        <input
          type="number"
          value={editedItem.price}
          onChange={(e) => setEditedItem({...editedItem, price: e.target.value})}
          className="w-full bg-[#1a1a1a] p-2 rounded mb-2"
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setIsEditing(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button
            variant="default"
            onClick={() => {
              onUpdate(editedItem);
              setIsEditing(false);
            }}
            className="bg-[#C4B5A2] hover:bg-[#A39584]"
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border border-[#C4B5A2]/20 rounded-lg relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="text-[#C4B5A2] hover:text-white mr-2"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(item.id)}
          className="text-red-500 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <h3 className="text-xl font-semibold">{item.name}</h3>
      <p className="text-gray-300">{item.description}</p>
      <p className="text-[#C4B5A2]">{item.price} €</p>
    </div>
  );
}