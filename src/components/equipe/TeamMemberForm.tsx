 "use client"

import { useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Personnel } from '@/services/api';

interface TeamMemberFormProps {
  isEditing: boolean;
  currentMember: Partial<Personnel>;
  onClose: () => void;
  onSubmit: (member: Partial<Personnel>) => Promise<void>;
  token?: string;
}

export default function TeamMemberForm({ 
  isEditing, 
  currentMember, 
  onClose, 
  onSubmit,
  token 
}: TeamMemberFormProps) {
  const [member, setMember] = useState(currentMember);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    if (!file) return null;
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/uploads/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image');
      }
      
      const data = await response.json();
      setIsUploading(false);
      
      return data.imagePath;
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
      setIsUploading(false);
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      setFormMessage({ type: '', text: '' });
      
      if (!member.firstName || !member.lastName || !member.role) {
        setFormMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires' });
        return;
      }
      
      const memberToSubmit = {
        ...member,
        description: member.description || "Membre de l'équipe Tiki",
        speciality: member.speciality || "Non spécifié",
        experience: member.experience || "Non spécifié",
        schedule: member.schedule || "Non spécifié"
      };
      
      await onSubmit(memberToSubmit);
      setFormMessage({ type: 'success', text: `Membre ${isEditing ? 'mis à jour' : 'ajouté'} avec succès` });
      
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      setFormMessage({ type: 'error', text: `Erreur lors de ${isEditing ? 'la mise à jour' : "l'ajout"} du membre` });
    }
  };

  return (
    <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border-2 border-[#C4B5A2] mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#C4B5A2]">
          {isEditing ? 'Modifier un membre' : 'Ajouter un membre'}
        </h3>
        <button onClick={onClose} className="text-white hover:text-[#C4B5A2]">
          <X size={24} />
        </button>
      </div>
      
      {formMessage.text && (
        <div className={`p-4 mb-4 rounded ${
          formMessage.type === 'error' ? 'bg-red-900/30 text-red-300 border border-red-800' : 'bg-green-900/30 text-green-300 border border-green-800'
        }`}>
          {formMessage.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Prénom*</label>
          <input
            className="w-full p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
            value={member.firstName}
            onChange={(e) => setMember({...member, firstName: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Nom*</label>
          <input
            className="w-full p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
            value={member.lastName}
            onChange={(e) => setMember({...member, lastName: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Rôle*</label>
          <input
            className="w-full p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
            value={member.role}
            onChange={(e) => setMember({...member, role: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Service*</label>
          <select
            className="w-full p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
            value={member.service}
            onChange={(e) => setMember({...member, service: e.target.value})}
          >
            <option value="salle">Salle</option>
            <option value="cuisine">Cuisine</option>
          </select>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm text-gray-300 mb-1">URL de l'image</label>
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
                  setMember({ ...member, imagePath });
                  toast.success('Image téléchargée avec succès');
                }
              }
            }}
          />
          <div className="text-center text-gray-400">
            {isUploading ? (
              <p>Upload en cours...</p>
            ) : (
              <>
                <p>Déposez votre image ici ou cliquez pour sélectionner</p>
                {member.imagePath && (
                  <p className="text-green-500 mt-2">Image sélectionnée: {member.imagePath.split('/').pop()}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleSubmit}
          className="bg-[#C4B5A2] hover:bg-[#A69783] text-black px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Check size={18} />
          {isEditing ? 'Mettre à jour' : 'Ajouter'}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <X size={18} />
          Annuler
        </button>
      </div>
    </div>
  );
}