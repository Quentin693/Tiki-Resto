"use client"

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, Calendar, Clock, DollarSign,
  BellRing, Filter
} from 'lucide-react';

interface Reservation {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfGuests: number;
  reservationDateTime: string;
  specialRequests?: string;
  createdAt: string;
}

interface Notification {
  id: number;
  type: 'urgent' | 'warning';
  message: string;
  time: string;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}

interface ToolbarProps {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  notifications: Notification[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}

const notifications: Notification[] = [
  {
    id: 1,
    type: 'urgent',
    message: 'Table 3 en attente depuis 30min',
    time: '2 min'
  },
  {
    id: 2,
    type: 'warning',
    message: 'Stock Rhum blanc bas',
    time: '5 min'
  }
];

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('jour');
  const [showNotifications, setShowNotifications] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState({
    dailyReservations: '0',
    availableTables: '0/0',
    averageWaitTime: '0 min',
    dailyRevenue: '0€'
  });

  useEffect(() => {
    fetchReservations();
    
    // Actualiser les réservations toutes les minutes pour mettre à jour l'affichage
    const intervalId = setInterval(fetchReservations, 60000);
    
    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch('http://localhost:3001/reservations');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des réservations');
      }
      const data = await response.json();
      setReservations(data);
      
      // Calculer les statistiques
      const today = new Date().toISOString().split('T')[0];
      const dailyReservations = data.filter(
        (r: Reservation) => r.reservationDateTime.startsWith(today)
      ).length;

      setStats({
        dailyReservations: dailyReservations.toString(),
        availableTables: '12/15', // À remplacer par les vraies données
        averageWaitTime: '25 min', // À remplacer par les vraies données
        dailyRevenue: '0€' // À remplacer par les vraies données
      });
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
    }
  };

  // Récupérer les 10 dernières réservations créées
  const getRecentReservations = () => {
    // Trier les réservations de la plus récente à la plus ancienne
    return reservations
      .filter(reservation => !!reservation.createdAt) // Ignorer celles sans createdAt
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Du plus récent au plus ancien
      .slice(0, 10); // Limiter aux 10 dernières
  };

  // Préparer les données pour le graphique
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toISOString().split('T')[0];
    
    // Filtrer les réservations pour ce jour
    const dayReservations = reservations.filter(
      (r: Reservation) => r.reservationDateTime.startsWith(dayStr)
    );

    // Calculer le nombre total de personnes
    const totalGuests = dayReservations.reduce(
      (sum, r) => sum + r.numberOfGuests, 
      0
    );
    
    return {
      date: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }),
      guests: totalGuests
    };
  }).reverse();

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* En-tête du Dashboard */}
      <div className="bg-[#2a2a2a] border-b border-[#C4B5A2]">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Dashboard Administrateur</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Toolbar 
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />
        
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Réservations du jour"
            value={stats.dailyReservations}
            icon={<Calendar className="w-6 h-6" />}
            trend="+12%"
          />
          <StatCard 
            title="Tables disponibles"
            value={stats.availableTables}
            icon={<Users className="w-6 h-6" />}
            trend="-3"
          />
          <StatCard 
            title="Temps d'attente moyen"
            value={stats.averageWaitTime}
            icon={<Clock className="w-6 h-6" />}
            trend="+5min"
          />
          <StatCard 
            title="Revenu journalier"
            value={stats.dailyRevenue}
            icon={<DollarSign className="w-6 h-6" />}
            trend="+18%"
          />
        </div>

        {/* Graphique et Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Graphique des réservations */}
          <div className="lg:col-span-2 bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
            <h2 className="text-xl font-bold mb-6">Nombre de couverts par jour</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                  <XAxis dataKey="date" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #C4B5A2',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value} personnes`, 'Couverts']}
                  />
                  <Bar dataKey="guests" fill="#C4B5A2" name="Couverts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* État des tables */}
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
            <h2 className="text-xl font-bold mb-6">État des tables</h2>
            <div className="space-y-4">
              {/* À remplacer par les vraies données des tables */}
            </div>
          </div>
        </div>

        {/* Dernières réservations */}
        <div className="mt-8 bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
          <h2 className="text-xl font-bold mb-6">Dernières réservations (10 plus récentes)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#C4B5A2]/30">
                  <th className="text-left py-4">Client</th>
                  <th className="text-left py-4">Date et Heure</th>
                  <th className="text-left py-4">Personnes</th>
                  <th className="text-left py-4">Contact</th>
                  <th className="text-left py-4">Reçue il y a</th>
                  <th className="text-left py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getRecentReservations().length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-400">
                      Aucune réservation trouvée
                    </td>
                  </tr>
                ) : (
                  getRecentReservations().map(reservation => {
                    // Calculer le temps écoulé depuis la création
                    const now = new Date();
                    const createdAtDate = new Date(reservation.createdAt);
                    const minutesElapsed = Math.round((now.getTime() - createdAtDate.getTime()) / 60000);
                    
                    return (
                      <tr key={reservation.id} className="border-b border-[#C4B5A2]/10">
                        <td className="py-4">{reservation.customerName}</td>
                        <td className="py-4">
                          {new Date(reservation.reservationDateTime).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-4">{reservation.numberOfGuests}</td>
                        <td className="py-4">
                          <div className="text-sm text-gray-400">
                            <div>{reservation.customerPhone}</div>
                            <div>{reservation.customerEmail}</div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="text-sm text-gray-400">
                            {minutesElapsed < 1 ? "À l'instant" : 
                             minutesElapsed < 60 ? `Il y a ${minutesElapsed} min` :
                             minutesElapsed < 1440 ? `Il y a ${Math.floor(minutesElapsed/60)}h${minutesElapsed%60}` :
                             `Il y a ${Math.floor(minutesElapsed/1440)}j`}
                          </div>
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => window.location.href=`/reservations/${reservation.id}`}
                            className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
                          >
                            Détails
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-[#C4B5A2]/20 p-3 rounded-lg">
          {icon}
        </div>
        <div className="text-sm text-green-500">{trend}</div>
      </div>
      <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Toolbar({ selectedPeriod, setSelectedPeriod, notifications, showNotifications, setShowNotifications }: ToolbarProps) {
  return (
    <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
      <div className="flex items-center gap-4">
        <div className="flex rounded-lg border border-[#3a3a3a] overflow-hidden">
          <button 
            className={`px-4 py-2 ${selectedPeriod === 'jour' ? 'bg-[#C4B5A2] text-black' : 'bg-[#2a2a2a]'}`}
            onClick={() => setSelectedPeriod('jour')}
          >
            Jour
          </button>
          <button 
            className={`px-4 py-2 ${selectedPeriod === 'semaine' ? 'bg-[#C4B5A2] text-black' : 'bg-[#2a2a2a]'}`}
            onClick={() => setSelectedPeriod('semaine')}
          >
            Semaine
          </button>
          <button 
            className={`px-4 py-2 ${selectedPeriod === 'mois' ? 'bg-[#C4B5A2] text-black' : 'bg-[#2a2a2a]'}`}
            onClick={() => setSelectedPeriod('mois')}
          >
            Mois
          </button>
        </div>

        <div className="relative">
          <button 
            className="flex items-center gap-2 bg-[#2a2a2a] px-4 py-2 rounded-lg border border-[#3a3a3a]"
          >
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <button 
          className="relative flex items-center gap-2 bg-[#2a2a2a] px-4 py-2 rounded-lg border border-[#3a3a3a]"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <BellRing className="w-4 h-4" />
          <span>Notifications</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        </button>
      </div>
    </div>
  );
}