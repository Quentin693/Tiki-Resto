"use client"

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { CalendarDays, Clock, Users, Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { seafoodOrdersService } from '../api/seafood-orders';
import emailjs from '@emailjs/browser';

const plateaux = [
  {
    id: 'plateau-ecaille',
    name: 'Plateau de l\'écailler',
    price: 49.00,
    description: '12 fines de claire, 6 crevettes roses, bulots 300g',
    image: '/FruitsdeMer.jpg',
    min: 2,
    max: 4
  },
  {
    id: 'plateau-pecheur',
    name: 'Plateau du pêcheur',
    price: 62.00,
    description: '12 Perles de l\'impératrice, 6 crevettes roses, bulots 300g',
    image: '/FruitsdeMer.jpg',
    min: 2,
    max: 4
  },
  {
    id: 'assiette-ecaille',
    name: 'Assiette de l\'écailler',
    price: 15.00,
    description: '3 fines de claire n°3, 3 crevettes roses, bulots 100g',
    image: '/FruitsdeMer.jpg',
    min: 1,
    max: 1
  },
  {
    id: 'assiette-degustation',
    name: 'Assiette dégustation',
    price: 19.00,
    description: '3 fines de claire n°3, 3 Perles de l\'impératrice n°3',
    image: '/FruitsdeMer.jpg',
    min: 1,
    max: 1
  }
];

// Produits individuels
const produitsIndividuels = [
  {
    id: 'bulots',
    name: 'Bulots (300g)',
    price: 14.00
  },
  {
    id: 'crevettes',
    name: 'Bouquet de crevettes (6)',
    price: 12.00
  },
  {
    id: 'fines',
    name: 'Fines de claire (12 ou 6)',
    price: 24.00,
    halfPrice: 12.00
  },
  {
    id: 'perles',
    name: 'Perle de l\'impératrice (12 ou 6)',
    price: 32.00,
    halfPrice: 16.00,
    info: 'Spéciale perle de l\'impératrice Joël Dupuch - L\'huître des Petits Mouchoirs'
  },
  {
    id: 'crevette-grise',
    name: 'Crevette grise fraîches les 100g',
    price: 12.00,
    surCommande: true
  },
  {
    id: 'tourteau',
    name: 'Tourteau entier frais & sa mayonnaise',
    price: 39.90,
    surCommande: true
  },
  {
    id: 'homard',
    name: 'Homard entier frais & sa mayonnaise',
    price: 71.00,
    surCommande: true
  },
  {
    id: 'langoustine',
    name: 'Langoustine fraîche (la pièce)',
    price: 6.90,
    surCommande: true
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
  const formRef = useRef(null);
  
  // État pour les produits individuels
  const [selectedItems, setSelectedItems] = useState<{[key: string]: {quantity: number, half?: boolean}}>({});
  
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
  
  // Ajouter un produit individuel à la commande
  const addItem = (id: string, half: boolean = false) => {
    setSelectedItems(prev => {
      const prevItem = prev[id] || { quantity: 0, half: false };
      return {
        ...prev,
        [id]: { quantity: prevItem.quantity + 1, half: half }
      };
    });
  };
  
  // Retirer un produit individuel de la commande
  const removeItem = (id: string) => {
    setSelectedItems(prev => {
      const newItems = { ...prev };
      if (newItems[id] && newItems[id].quantity > 1) {
        newItems[id] = { ...newItems[id], quantity: newItems[id].quantity - 1 };
      } else {
        delete newItems[id];
      }
      return newItems;
    });
  };
  
  // Basculer entre demi-douzaine et douzaine pour les huîtres
  const toggleHalfDozens = (id: string) => {
    setSelectedItems(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], half: !prev[id].half }
      };
    });
  };

  // Calculer le prix d'un produit individuel
  const getItemPrice = (id: string, half: boolean = false): number => {
    const item = produitsIndividuels.find(i => i.id === id);
    if (!item) return 0;
    
    if (half && 'halfPrice' in item) {
      return item.halfPrice || 0;
    }
    
    return item.price || 0;
  };
  
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
  
  // Calculer le prix total
  const calculateTotal = () => {
    let total = 0;
    
    // Prix des plateaux sélectionnés
    if (selectedPlateau) {
      const plateau = plateaux.find(p => p.id === selectedPlateau);
      total += plateau ? plateau.price * quantity : 0;
    }
    
    // Prix des produits individuels - en utilisant une approche plus sûre
    for (const itemId in selectedItems) {
      const itemDetails = selectedItems[itemId];
      const isHalf = itemDetails && 'half' in itemDetails ? itemDetails.half : false;
      const itemQuantity = itemDetails ? itemDetails.quantity : 0;
      
      total += getItemPrice(itemId, isHalf) * itemQuantity;
    }
    
    return total;
  };
  
  // Obtenir la date minimale (48h à l'avance)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2); // +48h
    return date.toISOString().split('T')[0];
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasSelectedPlateau = selectedPlateau !== null;
    const hasSelectedItems = Object.keys(selectedItems).length > 0;
    
    if (!hasSelectedPlateau && !hasSelectedItems) {
      toast.error('Veuillez sélectionner au moins un produit');
      return;
    }
    
    if (!date || !time || !name || !phone) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Construction de la commande complète
      const orderData = {
        customer: { name, phone, email },
        plateaux: hasSelectedPlateau && selectedPlateau ? 
          [{
            id: selectedPlateau,
            name: plateaux.find(p => p.id === selectedPlateau)?.name || 'Plateau',
            quantity,
            price: plateaux.find(p => p.id === selectedPlateau)?.price || 0
          }] : [],
        items: Object.entries(selectedItems).map(([id, details]) => {
          const product = produitsIndividuels.find(p => p.id === id);
          return {
            id,
            name: product?.name || 'Produit',
            quantity: details.quantity,
            half: !!details.half,
            price: getItemPrice(id, details.half) || 0
          };
        }),
        pickupInfo: {
          date,
          time,
          isPickup
        },
        specialRequests,
        totalPrice: calculateTotal()
      };
      
      // Envoi à l'API
      const createdOrder = await seafoodOrdersService.createOrder(orderData);
      
      // Préparation des données pour les notifications
      const orderDetails = {
        order_id: createdOrder.id,
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        pickup_date: date,
        pickup_time: time,
        is_pickup: isPickup ? "À emporter" : "Sur place",
        plateaux: hasSelectedPlateau && selectedPlateau ? 
          `${plateaux.find(p => p.id === selectedPlateau)?.name} (${quantity})` : "Aucun",
        items: Object.entries(selectedItems).map(([id, details]) => {
          const product = produitsIndividuels.find(p => p.id === id);
          return `${product?.name} ${details.half ? "(demi-douzaine)" : ""} (${details.quantity})`;
        }).join(", "),
        special_requests: specialRequests || "Aucune demande spéciale",
        total_price: calculateTotal().toFixed(2) + " €"
      };
      
      // 1. Envoyer un SMS au client via l'API backend qui utilise Twilio
      await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phone,
          message: `Bonjour ${name}, votre commande chez TIKI au bord de l'eau a bien été enregistrée pour le ${date} à ${time}. Montant total: ${calculateTotal().toFixed(2)}€. À bientôt!`
        }),
      });
      
      // 2. Envoyer un email avec les détails de la commande via EmailJS
      await emailjs.send(
        "service_w43hhbe", // Remplacer par votre service ID
        "template_order_confirmation", // Créer un template pour les commandes
        orderDetails,
        "qGukIkoXy-BXaqm2L" // Remplacer par votre user ID
      );
      
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
          <h1 className="font-didot text-5xl sm:text-6xl text-[#e8dcc5] mt-2 mb-6">Bar à Fruits de Mer</h1>
          <div className="w-24 h-[1px] bg-[#e8dcc5]/50 mx-auto"></div>
          <p className="text-gray-300 max-w-2xl mx-auto mt-6">
            Réservez vos plateaux et produits de la mer 48h à l'avance pour emporter ou sur place.
            Tous nos produits sont frais et sélectionnés avec soin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          {/* Sélections - 3 colonnes */}
          <div className="lg:col-span-3 space-y-8">
            {/* Nos plateaux */}
            <div>
              <h2 className="font-didot text-2xl mb-4 border-b border-[#e8dcc5]/20 pb-2">
                Nos plateaux
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plateaux.map((plateau) => (
                  <div 
                    key={plateau.id}
                    onClick={() => {
                      setSelectedPlateau(plateau.id === selectedPlateau ? null : plateau.id);
                    }}
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
                          {plateau.price}€
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
            </div>
            
            {/* Produits individuels */}
            <div>
              <h2 className="font-didot text-2xl mb-4 border-b border-[#e8dcc5]/20 pb-2">
                Produits individuels
              </h2>
              
              <div className="space-y-4">
                {produitsIndividuels.filter(item => !item.surCommande).map((item) => (
                  <div 
                    key={item.id}
                    className="bg-[#1a1a1a]/50 border border-[#333] p-4 rounded"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-[#e8dcc5] font-medium">{item.name}</h3>
                        {item.info && (
                          <p className="text-gray-400 text-xs mt-1 italic">{item.info}</p>
                        )}
                      </div>
                      <div className="text-[#e8dcc5]">
                        {'halfPrice' in item ? (
                          <div className="flex flex-col items-end">
                            <span>{item.price}€ / {item.halfPrice}€</span>
                            <span className="text-xs text-gray-400">douzaine / demi-douzaine</span>
                          </div>
                        ) : (
                          <span>{item.price}€</span>
                        )}
                      </div>
                    </div>
                    
                    {selectedItems[item.id] && (
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center">
                          {'halfPrice' in item && (
                            <button
                              onClick={() => toggleHalfDozens(item.id)}
                              className="text-xs mr-3 px-2 py-1 rounded bg-[#333] hover:bg-[#444]"
                            >
                              {selectedItems[item.id].half ? '6 pièces' : '12 pièces'}
                            </button>
                          )}
                          <span className="text-gray-300">
                            {selectedItems[item.id].quantity} × {selectedItems[item.id].half ? item.halfPrice : item.price}€
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="w-7 h-7 rounded-full bg-[#333] flex items-center justify-center"
                          >
                            -
                          </button>
                          <span>{selectedItems[item.id].quantity}</span>
                          <button 
                            onClick={() => addItem(item.id, selectedItems[item.id].half)}
                            className="w-7 h-7 rounded-full bg-[#333] flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {!selectedItems[item.id] && (
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => addItem(item.id, 'halfPrice' in item)}
                          className="px-3 py-1 bg-[#333] hover:bg-[#444] rounded text-white text-sm"
                        >
                          Ajouter
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Produits sur commande (2 jours à l'avance) */}
            <div>
              <h2 className="font-didot text-2xl mb-4 border-b border-[#e8dcc5]/20 pb-2 flex items-center">
                <span>Sur commande</span>
                <span className="text-sm font-normal text-gray-400 ml-3">2 jours à l'avance</span>
              </h2>
              
              <div className="space-y-4">
                {produitsIndividuels.filter(item => item.surCommande).map((item) => (
                  <div 
                    key={item.id}
                    className="bg-[#1a1a1a]/50 border border-[#333] p-4 rounded"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-[#e8dcc5] font-medium">{item.name}</h3>
                      <span className="text-[#e8dcc5]">{item.price}€</span>
                    </div>
                    
                    {selectedItems[item.id] && (
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-gray-300">
                          {selectedItems[item.id].quantity} × {item.price}€
                        </span>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="w-7 h-7 rounded-full bg-[#333] flex items-center justify-center"
                          >
                            -
                          </button>
                          <span>{selectedItems[item.id].quantity}</span>
                          <button 
                            onClick={() => addItem(item.id)}
                            className="w-7 h-7 rounded-full bg-[#333] flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {!selectedItems[item.id] && (
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => addItem(item.id)}
                          className="px-3 py-1 bg-[#333] hover:bg-[#444] rounded text-white text-sm"
                        >
                          Ajouter
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {selectedPlateau && (
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Quantité de plateaux</label>
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
            )}
          </div>
          
          {/* Formulaire de commande - 2 colonnes */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1a1a]/70 border border-[#333] rounded-lg p-6">
              <h2 className="font-didot text-2xl mb-4 border-b border-[#e8dcc5]/20 pb-2">
                Détails de la commande
              </h2>
              
              <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
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
                    disabled={isSubmitting || (selectedPlateau === null && Object.keys(selectedItems).length === 0)}
                    className={`
                      w-full py-3 rounded text-center font-medium transition-colors
                      ${isSubmitting 
                        ? 'bg-[#555] cursor-not-allowed' 
                        : (selectedPlateau !== null || Object.keys(selectedItems).length > 0)
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
