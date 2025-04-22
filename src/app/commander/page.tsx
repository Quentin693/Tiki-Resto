"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { CalendarDays, Clock, Users, Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const plateaux = [
  {
    id: 'royal',
    name: 'Le Royal',
    price: 75,
    description: 'Homard, langoustines, crevettes, huîtres, bulots, palourdes, bigorneaux',
    image: '/FruitsdeMer.jpg',
    min: 2,
    max: 4
  },
  {
    id: 'degustation',
    name: 'Dégustation',
    price: 45,
    description: 'Crevettes, huîtres, bulots, bigorneaux, moules, palourdes',
    image: '/seafood-plate.jpg',
    min: 1,
    max: 2
  },
  {
    id: 'essentiels',
    name: 'Les Essentiels',
    price: 29,
    description: 'Huîtres, crevettes, bulots, mayonnaise maison',
    image: '/oysters.jpg',
    min: 1,
    max: 2
  },
  {
    id: 'surmesure',
    name: 'Sur Mesure',
    price: 0,
    description: 'Composez votre plateau selon vos envies',
    image: '/custom-seafood.jpg',
    min: 1,
    max: 10
  }
];

export default function CommanderPage() {
  const router = useRouter();
  const [selectedPlateau, setSelectedPlateau] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isPickup, setIsPickup] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pour le plateau sur mesure
  const [customItems, setCustomItems] = useState({
    huitres: 0,
    crevettes: 0,
    langoustines: 0,
    homard: 0,
    bulots: 0,
    palourdes: 0,
    bigorneaux: 0,
    moules: 0
  });
  
  // Calculer le prix pour le plateau sur mesure
  const calculateCustomPrice = () => {
    const prices = {
      huitres: 2,
      crevettes: 1.5,
      langoustines: 5,
      homard: 25,
      bulots: 1,
      palourdes: 1.2,
      bigorneaux: 0.8,
      moules: 0.5
    };
    
    let total = 0;
    for (const [item, qty] of Object.entries(customItems)) {
      total += qty * prices[item as keyof typeof prices];
    }
    
    return total;
  };
  
  // Calcul du prix total
  const calculateTotal = () => {
    if (!selectedPlateau) return 0;
    
    if (selectedPlateau === 'surmesure') {
      return calculateCustomPrice() * quantity;
    }
    
    const plateau = plateaux.find(p => p.id === selectedPlateau);
    return plateau ? plateau.price * quantity : 0;
  };
  
  // Obtenir la date minimale (48h à l'avance)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2); // +48h
    return date.toISOString().split('T')[0];
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlateau || !date || !time || !name || !phone) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Simuler un envoi d'email/API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Votre commande a été envoyée avec succès');
      
      // Rediriger vers une page de confirmation
      router.push('/commander/confirmation');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue lors de l\'envoi de votre commande');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleIncrement = (item: string) => {
    setCustomItems(prev => ({
      ...prev,
      [item]: prev[item as keyof typeof prev] + 1
    }));
  };
  
  const handleDecrement = (item: string) => {
    setCustomItems(prev => ({
      ...prev,
      [item]: Math.max(0, prev[item as keyof typeof prev] - 1)
    }));
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white relative pt-24 pb-16">
      {/* Background avec feuilles décoratives */}
      <div className="absolute inset-0 flex z-0 pointer-events-none overflow-hidden">
        <div className="w-[15%] sm:w-[20%] md:w-[25%] relative">
          <Image
            src="/decorations/leavesleft.webp"
            alt="Décoration gauche"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-[#0f0f0f]" />
        </div>

        <div className="flex-grow bg-[#0f0f0f]" />

        <div className="w-[15%] sm:w-[20%] md:w-[25%] relative">
          <Image
            src="/decorations/leavesright.webp"
            alt="Décoration droite"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-l from-transparent to-[#0f0f0f]" />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mt-40 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#e8dcc5] hover:text-white mb-8 group transition-colors absolute left-4 sm:left-6 lg:left-8 top-0"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-didot text-sm sm:text-base">Retour à l'accueil</span>
        </Link>

        <div className="text-center mb-12">
          <span className="font-allura text-3xl md:text-4xl text-[#e8dcc5]/80">Saveurs de l 'océan</span>
          <h1 className="font-didot text-5xl sm:text-6xl text-[#e8dcc5] mt-2 mb-6">Commandez vos Plateaux</h1>
          <div className="w-24 h-[1px] bg-[#e8dcc5]/50 mx-auto"></div>
          <p className="text-gray-300 max-w-2xl mx-auto mt-6">
            Réservez vos plateaux de fruits de mer 48h à l'avance pour emporter ou sur place.
            Tous nos produits sont frais et sélectionnés avec soin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          {/* Sélection des plateaux - 3 colonnes */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="font-didot text-2xl mb-4 border-b border-[#e8dcc5]/20 pb-2">
              Choisissez votre plateau
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plateaux.map((plateau) => (
                <div 
                  key={plateau.id}
                  onClick={() => setSelectedPlateau(plateau.id)}
                  className={`
                    cursor-pointer border rounded-lg overflow-hidden transition-all
                    ${selectedPlateau === plateau.id 
                      ? 'border-[#e8dcc5] shadow-[0_0_10px_rgba(232,220,197,0.3)]' 
                      : 'border-[#333] hover:border-[#555]'
                    }
                  `}
                >
                  <div className="relative h-40">
                    <Image
                      src={plateau.image}
                      alt={plateau.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
                      <h3 className="text-white font-medium text-lg">{plateau.name}</h3>
                      <span className="text-[#e8dcc5] font-bold">
                        {plateau.id === 'surmesure' ? 'Sur devis' : `${plateau.price}€`}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#1a1a1a]">
                    <p className="text-gray-400 text-sm">{plateau.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Pour {plateau.min} {plateau.min > 1 ? 'personnes' : 'personne'}
                      {plateau.max > plateau.min ? ` à ${plateau.max} personnes` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedPlateau === 'surmesure' && (
              <div className="mt-6 p-4 bg-[#1a1a1a]/50 border border-[#333] rounded-lg">
                <h3 className="font-didot text-xl mb-4 text-[#e8dcc5]">Composez votre plateau</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.keys(customItems).map((item) => (
                    <div key={item} className="flex flex-col space-y-2">
                      <span className="text-sm capitalize">{item}</span>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleDecrement(item)} 
                          className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center hover:bg-[#444]"
                        >
                          -
                        </button>
                        <span className="w-6 text-center">
                          {customItems[item as keyof typeof customItems]}
                        </span>
                        <button 
                          onClick={() => handleIncrement(item)} 
                          className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center hover:bg-[#444]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-right">
                  <p className="text-[#e8dcc5]">
                    Prix estimé: {calculateCustomPrice().toFixed(2)}€ par plateau
                  </p>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Quantité</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="bg-[#1a1a1a] border border-[#333] rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#e8dcc5]"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Formulaire de commande - 2 colonnes */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1a1a]/70 border border-[#333] rounded-lg p-6">
              <h2 className="font-didot text-2xl mb-4 border-b border-[#e8dcc5]/20 pb-2">
                Détails de la commande
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mode de récupération*
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        checked={isPickup}
                        onChange={() => setIsPickup(true)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border mr-2 ${isPickup ? 'border-[#e8dcc5] bg-[#e8dcc5]' : 'border-[#555]'}`} />
                      <span>À emporter</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        checked={!isPickup}
                        onChange={() => setIsPickup(false)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border mr-2 ${!isPickup ? 'border-[#e8dcc5] bg-[#e8dcc5]' : 'border-[#555]'}`} />
                      <span>Sur place</span>
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date de récupération*
                    </label>
                    <input
                      type="date"
                      min={getMinDate()}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-[#1a1a1a] border border-[#333] rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#e8dcc5]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Heure*
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="bg-[#1a1a1a] border border-[#333] rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#e8dcc5]"
                      required
                    >
                      <option value="">Sélectionner</option>
                      <optgroup label="Midi">
                        {['12:00', '12:30', '13:00', '13:30', '14:00'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Soir">
                        {['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[#333]">
                  <h3 className="text-[#e8dcc5] font-medium mb-4 flex items-center">
                    <Users className="inline-block mr-2 h-4 w-4" />
                    Vos coordonnées
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nom complet*
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-[#1a1a1a] border border-[#333] rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#e8dcc5]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Téléphone*
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-[#1a1a1a] border border-[#333] rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#e8dcc5]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-[#1a1a1a] border border-[#333] rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#e8dcc5]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Demandes spéciales
                      </label>
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="bg-[#1a1a1a] border border-[#333] rounded p-2 w-full h-24 focus:outline-none focus:ring-1 focus:ring-[#e8dcc5]"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[#333]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-xl font-bold text-[#e8dcc5]">
                      {calculateTotal().toFixed(2)}€
                    </span>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedPlateau}
                    className={`
                      w-full py-3 rounded text-center font-medium transition-colors
                      ${isSubmitting 
                        ? 'bg-[#555] cursor-not-allowed' 
                        : selectedPlateau 
                          ? 'bg-[#e8dcc5] text-[#0f0f0f] hover:bg-[#d1c5b0]' 
                          : 'bg-[#333] cursor-not-allowed'
                      }
                    `}
                  >
                    {isSubmitting 
                      ? 'Envoi en cours...' 
                      : 'Commander'
                    }
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    * Champs obligatoires. Veuillez réserver 48h à l'avance.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Informations complémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-[#1a1a1a]/50 p-6 rounded-lg border border-[#333]">
            <h3 className="font-didot text-xl mb-4 text-[#e8dcc5] flex items-center">
              <Clock className="mr-2 h-5 w-5 text-[#e8dcc5]" />
              Horaires de retrait
            </h3>
            <p className="text-gray-300">
              Midi: 12h00 - 14h00<br />
              Soir: 19h00 - 21h30
            </p>
            <p className="text-gray-400 text-sm mt-3">
              Fermé le lundi.
            </p>
          </div>
          
          <div className="bg-[#1a1a1a]/50 p-6 rounded-lg border border-[#333]">
            <h3 className="font-didot text-xl mb-4 text-[#e8dcc5] flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-[#e8dcc5]" />
              Adresse
            </h3>
            <p className="text-gray-300">
              Restaurant Tiki<br />
              Chemin du Pontet<br />
              69150 Décines-Charpieu
            </p>
            <p className="text-gray-400 text-sm mt-3">
              Parking gratuit disponible.
            </p>
          </div>
          
          <div className="bg-[#1a1a1a]/50 p-6 rounded-lg border border-[#333]">
            <h3 className="font-didot text-xl mb-4 text-[#e8dcc5] flex items-center">
              <Phone className="mr-2 h-5 w-5 text-[#e8dcc5]" />
              Contact
            </h3>
            <p className="text-gray-300">
              Téléphone: 04 78 49 02 39<br />
              Email: contact@tikilyon.fr
            </p>
            <p className="text-gray-400 text-sm mt-3">
              Pour toute question, n'hésitez pas à nous contacter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
