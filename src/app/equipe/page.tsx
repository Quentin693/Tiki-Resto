"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, Plus } from 'lucide-react';
import { personnelApi, Personnel } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import TeamHero from '@/components/equipe/TeamHero';
import TeamMemberForm from '@/components/equipe/TeamMemberForm';
import TeamMemberCard from '@/components/equipe/TeamMemberCard';
import ContactSection from '@/components/equipe/ContactSection';

export default function TeamPage() {
  const { user, token } = useAuth();
  const [activeService, setActiveService] = useState('all');
  const [teamMembers, setTeamMembers] = useState<Personnel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour la gestion d'édition
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
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

  // Fonctions pour gérer les membres du personnel
  const handleAddMember = async (member: Partial<Personnel>) => {
    try {
      await personnelApi.create(member as Omit<Personnel, 'id' | 'createdAt' | 'updatedAt'>);
      toast.success('Membre ajouté avec succès');
      fetchTeamMembers();
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      toast.error('Erreur lors de l\'ajout du membre');
    }
  };

  const handleEditMember = (member: Personnel) => {
    setCurrentMember(member);
    setIsEditing(true);
  };

  const handleUpdateMember = async (member: Partial<Personnel>) => {
    try {
      if (!member.id) return;
      await personnelApi.update(member.id, member);
      toast.success('Membre mis à jour avec succès');
      fetchTeamMembers();
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      toast.error('Erreur lors de la mise à jour du membre');
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return;
    
    try {
      await personnelApi.delete(id);
      toast.success('Membre supprimé avec succès');
      fetchTeamMembers();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression du membre');
    }
  };

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
      <TeamHero />

      {/* Contenu principal */}
      <main className="relative mt-20 flex-grow bg-[#141414]">
        <div className="relative">
          {/* Background avec feuilles */}
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
                Chaque membre de notre équipe apporte sa touche unique pour créer une expérience gustative inoubliable.
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
            {(isAdding || isEditing) && (
              <TeamMemberForm
                isEditing={isEditing}
                currentMember={currentMember}
                onClose={() => isEditing ? setIsEditing(false) : setIsAdding(false)}
                onSubmit={isEditing ? handleUpdateMember : handleAddMember}
                token={token}
              />
            )}
              
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
                  <Users className="w-5 h-5" />
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
                  <Users className="w-5 h-5" />
                  Salle
                </button>
              </div>
            </div>

            {/* Liste des membres de l'équipe */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {teamMembers.length === 0 ? (
                <div className="text-center p-8 bg-[#2a2a2a]/50 rounded-lg col-span-full">
                  <p className="text-gray-400">Aucun membre trouvé pour cette catégorie</p>
                </div>
              ) : (
                teamMembers.map((member) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    isAdmin={user?.role === 'admin'}
                    onEdit={handleEditMember}
                    onDelete={handleDeleteMember}
                  />
                ))
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}