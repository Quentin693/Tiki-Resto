"use client"

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Users, Phone, Mail, Star, ChefHat, Clock, UtensilsCrossed, GlassWater, Pencil, Trash2, Plus, X, Check } from 'lucide-react';
import { personnelApi, Personnel } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function TeamPage() {
  const { user, token } = useAuth();
  const [activeService, setActiveService] = useState('all');
  const [teamMembers, setTeamMembers] = useState<Personnel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // États pour la gestion d'édition
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const [currentMember, setCurrentMember] = useState<Partial<Personnel>>({
    firstName: '',
    lastName: '',
    role: '',
    service: 'salle',
    imagePath: ''
  });

  // Récupérer les données du personnel depuis l'API
  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      
      let data: Personnel[];
      
      if (activeService === 'all') {
        data = await personnelApi.getAll();
      } else {
        data = await personnelApi.getByService(activeService);
      }
      
      setTeamMembers(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement du personnel:', err);
      setError('Une erreur est survenue lors du chargement des membres de l\'équipe');
      
      // Données de secours en cas d'erreur
      setTeamMembers([
    {
      id: 1,
          firstName: "Greg",
          lastName: "Maire",
      role: "Vieux Loup",
      service: "salle",
      description: "Fort de 20 ans d'expérience dans la cuisine polynésienne, Michel dirige notre cuisine avec passion et créativité. Formé aux îles Marquises, il apporte l'authenticité des saveurs du Pacifique à chaque plat.",
      speciality: "Poissons crus et marinades traditionnelles",
      experience: "20 ans d'expérience",
      schedule: "Chef du service du soir",
      imagePath: "/equipe/greg.jpg"
    },
    {
      id: 2,
          firstName: "Alexis",
          lastName: "Berthier",
      role: "Gros Grizzly",
      service: "salle",
      description: "Spécialiste des desserts fusion mêlant techniques françaises et ingrédients polynésiens, Marie crée des desserts uniques qui racontent une histoire à chaque bouchée.",
      speciality: "Desserts fusion polynésiens",
      experience: "15 ans d'expérience",
      schedule: "Service continu",
      imagePath: "/equipe/alex.png"
    },
    {
      id: 3,
          firstName: "Quentin",
          lastName: "Cialone",
      role: "Cochon du seigneur",
      service: "salle",
      description: "Expert en fruits de mer et spécialités locales, Paul apporte sa touche unique aux plats traditionnels tahitiens. Sa créativité donne une nouvelle dimension à nos recettes ancestrales.",
      speciality: "Fruits de mer et poissons",
      experience: "12 ans d'expérience",
      schedule: "Chef du service du midi",
      imagePath: "/equipe/quentin.jpeg"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [activeService]); // Recharger les données quand le filtre change

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

  // Fonctions pour gérer les membres du personnel
  const handleAddMember = async () => {
    try {
      setFormMessage({ type: '', text: '' });
      
      if (!currentMember.firstName || !currentMember.lastName || !currentMember.role) {
        setFormMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires' });
        return;
      }
      
      // Ajouter les champs obligatoires avec des valeurs par défaut
      const memberToCreate = {
        ...currentMember,
        description: currentMember.description || "Membre de l'équipe Tiki",
        speciality: currentMember.speciality || "Non spécifié",
        experience: currentMember.experience || "Non spécifié",
        schedule: currentMember.schedule || "Non spécifié"
      };
      
      await personnelApi.create(memberToCreate as Omit<Personnel, 'id' | 'createdAt' | 'updatedAt'>);
      setFormMessage({ type: 'success', text: 'Membre ajouté avec succès' });
      
      // Réinitialiser le formulaire
      setCurrentMember({
        firstName: '',
        lastName: '',
        role: '',
        service: 'salle',
        imagePath: ''
      });
      
      // Fermer le formulaire et rafraîchir les données
      setTimeout(() => {
        setIsAdding(false);
        fetchTeamMembers();
      }, 1500);
      
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      setFormMessage({ type: 'error', text: 'Erreur lors de l\'ajout du membre' });
    }
  };

  const handleEditMember = (member: Personnel) => {
    setCurrentMember(member);
    setIsEditing(true);
  };

  const handleUpdateMember = async () => {
    try {
      setFormMessage({ type: '', text: '' });
      
      if (!currentMember.id || !currentMember.firstName || !currentMember.lastName || !currentMember.role) {
        setFormMessage({ type: 'error', text: 'Informations incomplètes' });
        return;
      }
      
      // S'assurer que les champs obligatoires existent
      const memberToUpdate = {
        ...currentMember,
        description: currentMember.description || "Membre de l'équipe Tiki",
        speciality: currentMember.speciality || "Non spécifié",
        experience: currentMember.experience || "Non spécifié",
        schedule: currentMember.schedule || "Non spécifié"
      };
      
      await personnelApi.update(currentMember.id, memberToUpdate);
      setFormMessage({ type: 'success', text: 'Membre mis à jour avec succès' });
      
      // Fermer le formulaire et rafraîchir les données
      setTimeout(() => {
        setIsEditing(false);
        fetchTeamMembers();
      }, 1500);
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setFormMessage({ type: 'error', text: 'Erreur lors de la mise à jour du membre' });
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return;
    
    try {
      await personnelApi.delete(id);
      
      // Rafraîchir les données
      fetchTeamMembers();
      
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression du membre');
    }
  };

  // Formulaire d'édition/ajout de membre
  const renderForm = () => (
    <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border-2 border-[#C4B5A2] mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#C4B5A2]">
          {isEditing ? 'Modifier un membre' : 'Ajouter un membre'}
        </h3>
        <button onClick={() => isEditing ? setIsEditing(false) : setIsAdding(false)} className="text-white hover:text-[#C4B5A2]">
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
            value={currentMember.firstName}
            onChange={(e) => setCurrentMember({...currentMember, firstName: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Nom*</label>
          <input
            className="w-full p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
            value={currentMember.lastName}
            onChange={(e) => setCurrentMember({...currentMember, lastName: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Rôle*</label>
          <input
            className="w-full p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
            value={currentMember.role}
            onChange={(e) => setCurrentMember({...currentMember, role: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Service*</label>
          <select
            className="w-full p-2 bg-[#1a1a1a] rounded text-white border border-[#C4B5A2]/30"
            value={currentMember.service}
            onChange={(e) => setCurrentMember({...currentMember, service: e.target.value})}
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
                  setCurrentMember({ ...currentMember, imagePath });
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
                {currentMember.imagePath && (
                  <p className="text-green-500 mt-2">Image sélectionnée: {currentMember.imagePath.split('/').pop()}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 justify-end">
        <button
          onClick={isEditing ? handleUpdateMember : handleAddMember}
          className="bg-[#C4B5A2] hover:bg-[#A69783] text-black px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Check size={18} />
          {isEditing ? 'Mettre à jour' : 'Ajouter'}
        </button>
        <button
          onClick={() => isEditing ? setIsEditing(false) : setIsAdding(false)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <X size={18} />
          Annuler
        </button>
      </div>
    </div>
  );

  // Gestion du cas de chargement
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#141414] text-white items-center justify-center">
        <div className="p-8 bg-[#2a2a2a]/80 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Chargement...</h2>
          <p>Nous récupérons les informations de notre équipe</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#141414] text-white">
      {/* Hero Section - reste identique */}
      <div className="relative h-[60vh]">
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover"
          >
            <source src="/videoTiki.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <div>
            <img 
              src="/logo.png"
              alt="Tiki Logo"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Notre équipe
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl">
            Une passion commune : vous faire voyager à travers nos saveurs
          </p>
          <div className="w-24 h-1 bg-[#C4B5A2]"></div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="relative flex-grow bg-[#141414]">
        <div className="relative">
          {/* Background avec feuilles - reste identique */}
          <div className="absolute inset-0 flex">
            <div className="w-[400px] relative">
              <Image
                src="/decorations/leavesleft.webp"
                alt="Décoration gauche"
                fill
                className="object-cover opacity-20"
                priority
              />
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#141414]" />
            </div>

            <div className="flex-grow bg-[#141414]">
              <div className="max-w-6xl mx-auto px-8" />
            </div>

            <div className="w-[400px] relative">
              <Image
                src="/decorations/leavesright.webp"
                alt="Décoration droite"
                fill
                className="object-cover opacity-20"
                priority
              />
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-l from-transparent to-[#141414]" />
            </div>
          </div>

          {/* Contenu */}
          <div className="relative max-w-6xl mx-auto px-8 py-16">
            {/* Introduction et Filtres */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#C4B5A2] mb-4">Une équipe passionnée</h2>
              <p className="text-gray-400 max-w-3xl mx-auto mb-8">
                Notre équipe de professionnels dévoués combine expertise culinaire et passion pour la gastronomie polynésienne. Chaque membre apporte sa touche unique pour créer une expérience gustative inoubliable.
              </p>
              
              {/* Message d'erreur si applicable */}
              {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg mb-8">
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* Bouton d'ajout pour admin */}
            {user?.role === 'admin' && !isAdding && !isEditing && (
              <div className="mb-8 flex justify-center">
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-2 bg-[#C4B5A2] text-black px-4 py-2 rounded-md hover:bg-[#a39482]"
                >
                  <Plus size={20} />
                  Ajouter un membre
                </button>
              </div>
            )}
            
            {/* Formulaire d'ajout/édition */}
            {(isAdding || isEditing) && renderForm()}
              
              {/* Boutons de filtre */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex gap-4 p-1 bg-[#2a2a2a] rounded-lg">
                <button
                  onClick={() => setActiveService('all')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    activeService === 'all' 
                      ? 'bg-[#C4B5A2] text-black' 
                      : 'text-white hover:bg-[#3a3a3a]'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  Toute l'équipe
                </button>
                <button
                  onClick={() => setActiveService('cuisine')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    activeService === 'cuisine' 
                      ? 'bg-[#C4B5A2] text-black' 
                      : 'text-white hover:bg-[#3a3a3a]'
                  }`}
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  Cuisine
                </button>
                <button
                  onClick={() => setActiveService('salle')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    activeService === 'salle' 
                      ? 'bg-[#C4B5A2] text-black' 
                      : 'text-white hover:bg-[#3a3a3a]'
                  }`}
                >
                  <GlassWater className="w-5 h-5" />
                  Salle
                </button>
              </div>
            </div>

            {/* Liste des membres de l'équipe */}
            <div className="space-y-16">
              {teamMembers.length === 0 ? (
                <div className="text-center p-8 bg-[#2a2a2a]/50 rounded-lg">
                  <p className="text-gray-400">Aucun membre trouvé pour cette catégorie</p>
                </div>
              ) : (
                teamMembers.map((member) => (
                <div 
                  key={member.id}
                  className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-[#C4B5A2]/20"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 h-auto">
                    <div className="relative h-[300px] lg:h-[500px]">
                      <div className="absolute inset-0 bg-black/30 z-10" />
                        {/* Boutons d'administration pour chaque membre */}
                        {user?.role === 'admin' && (
                          <div className="absolute top-4 left-4 z-20 flex gap-2">
                            <button 
                              onClick={() => handleEditMember(member)}
                              className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteMember(member.id)}
                              className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      <Image
                        src={member.imagePath?.startsWith('http') 
                          ? member.imagePath 
                          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${member.imagePath}` || '/images/default-person.jpg'}
                        alt={`${member.firstName} ${member.lastName}`}
                        fill
                        className="object-cover"
                      />
                      {/* Overlay avec informations sur mobile */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10 lg:hidden">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold">{member.firstName} {member.lastName}</h2>
                          {member.service === 'cuisine' ? (
                            <UtensilsCrossed className="w-4 h-4 text-[#C4B5A2]" />
                          ) : (
                            <GlassWater className="w-4 h-4 text-[#C4B5A2]" />
                          )}
                        </div>
                        <p className="text-[#C4B5A2] text-sm">{member.role}</p>
                      </div>
                    </div>
                    
                    <div className="h-auto lg:h-[500px] p-6 lg:p-8 flex flex-col">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2 hidden lg:flex">
                          <h2 className="text-2xl font-bold">{member.firstName} {member.lastName}</h2>
                          {member.service === 'cuisine' ? (
                            <UtensilsCrossed className="w-5 h-5 text-[#C4B5A2]" />
                          ) : (
                            <GlassWater className="w-5 h-5 text-[#C4B5A2]" />
                          )}
                        </div>
                        <p className="text-[#C4B5A2] mb-4 hidden lg:block">{member.role}</p>
                        
                        {/* Description */}
                        <p className="text-gray-300 mb-6">{member.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>

            {/* Section Contact - reste identique */}
            <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-xl p-8 border border-[#C4B5A2]/20 shadow-xl mt-16">
              <div className="text-center mb-8">
                <Users className="w-12 h-12 text-[#C4B5A2] mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Contactez notre équipe</h2>
                <p className="text-gray-400">Pour toute demande spéciale ou information complémentaire</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <a href="tel:+123456789" className="flex items-center gap-2 bg-[#C4B5A2] hover:bg-[#A69783] text-black font-medium px-6 py-3 rounded-lg transition-colors">
                  <Phone className="w-4 h-4" />
                  Appeler le restaurant
                </a>
                <a href="mailto:contact@restaurant.com" className="flex items-center gap-2 bg-[#C4B5A2] hover:bg-[#A69783] text-black font-medium px-6 py-3 rounded-lg transition-colors">
                  <Mail className="w-4 h-4" />
                  Envoyer un email
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}