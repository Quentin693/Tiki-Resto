"use client"

import React, { useState, useEffect } from 'react';
import { Users, Calendar, Clock, DollarSign, Utensils, Percent } from 'lucide-react';
import { Reservation } from '@/types/reservation';
import StatCard from '@/components/dashboard/StatCard';
import Toolbar from '@/components/dashboard/Toolbar';
import ReservationsChart from '@/components/dashboard/ReservationsChart';
import RecentReservations from '@/components/dashboard/RecentReservations';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let notificationCounter = 0;

const getLatestReservationNotification = (reservations: Reservation[]): { id: number; type: 'urgent' | 'warning'; message: string; time: string; isRead: boolean; } | null => {
  if (!reservations.length) return null;

  // Trier les réservations par date décroissante
  const sortedReservations = [...reservations].sort((a, b) => 
    new Date(b.reservationDateTime).getTime() - new Date(a.reservationDateTime).getTime()
  );

  const latest = sortedReservations[0];
  const timeAgo = formatDistanceToNow(new Date(latest.reservationDateTime), { 
    locale: fr,
    addSuffix: true 
  });

  return {
    id: ++notificationCounter,
    type: 'warning',
    message: `Nouvelle réservation : ${latest.customerName} - ${latest.numberOfGuests} personnes`,
    time: timeAgo,
    isRead: false
  };
};

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('jour');
  const [showNotifications, setShowNotifications] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState({
    dailyReservations: '0',
    lunchOccupancy: '0%',
    dinnerOccupancy: '0%'
  });
  const [notifications, setNotifications] = useState<Array<{
    id: number;
    type: 'urgent' | 'warning';
    message: string;
    time: string;
    isRead: boolean;
  }>>([]);

  useEffect(() => {
    fetchReservations();
    const intervalId = setInterval(fetchReservations, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Mettre à jour les notifications quand les réservations changent
    const latestReservation = getLatestReservationNotification(reservations);
    if (latestReservation) {
      setNotifications(prev => {
        const withoutPrevLatest = prev.filter(n => n.id !== latestReservation.id);
        return [latestReservation, ...withoutPrevLatest];
      });
    }
  }, [reservations]);

  const calculateStats = (reservations: Reservation[]) => {
    const today = new Date().toISOString().split('T')[0];
    const todayReservations = reservations.filter(
      (r: Reservation) => r.reservationDateTime.startsWith(today)
    );

    // Séparer les réservations midi et soir
    const lunchReservations = todayReservations.filter(r => {
      const hour = new Date(r.reservationDateTime).getHours();
      return hour >= 11 && hour < 15;
    });

    const dinnerReservations = todayReservations.filter(r => {
      const hour = new Date(r.reservationDateTime).getHours();
      return hour >= 18 && hour < 23;
    });

    // Calculer le nombre total de couverts pour midi et soir
    const lunchCovers = lunchReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);
    const dinnerCovers = dinnerReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);

    // Calculer les taux de remplissage (capacité max: 150 le midi, 200 le soir)
    const lunchOccupancy = Math.min(Math.round((lunchCovers / 150) * 100), 100);
    const dinnerOccupancy = Math.min(Math.round((dinnerCovers / 200) * 100), 100);

    setStats({
      dailyReservations: String(lunchCovers + dinnerCovers),
      lunchOccupancy: `${lunchOccupancy}%`,
      dinnerOccupancy: `${dinnerOccupancy}%`
    });
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${API_URL}/reservations`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des réservations');
      }
      const data = await response.json();
      setReservations(data);
      calculateStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({
        ...notification,
        isRead: true
      }))
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* En-tête du Dashboard */}
      <div className="bg-[#2a2a2a] border-b border-[#C4B5A2]">
        <div className="container mt-40 mx-auto px-4 py-6">
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
          markNotificationsAsRead={markNotificationsAsRead}
        />
        
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Réservations du jour"
            value={stats.dailyReservations}
            icon={<Users className="w-6 h-6" />}
            trend="+12%"
            subtitle="Total couverts"
          />
          <StatCard 
            title="Taux de remplissage"
            value={stats.lunchOccupancy}
            icon={<Percent className="w-6 h-6" />}
            trend={`${stats.lunchOccupancy === '0%' ? '0' : '+'}${stats.lunchOccupancy}`}
            subtitle="Ce midi (max 150)"
          />
          <StatCard 
            title="Taux de remplissage"
            value={stats.dinnerOccupancy}
            icon={<Percent className="w-6 h-6" />}
            trend={`${stats.dinnerOccupancy === '0%' ? '0' : '+'}${stats.dinnerOccupancy}`}
            subtitle="Ce soir (max 200)"
          />
          <StatCard 
            title="En cours..."
            value="0"
            icon={<Clock className="w-6 h-6" />}
            trend="0"
            subtitle="À venir"
          />
        </div>

        {/* Graphique des couverts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
              <h2 className="text-xl font-bold mb-6">Nombre de couverts par jour</h2>
              <ReservationsChart reservations={reservations} />
            </div>
          </div>

          {/* Informations importantes */}
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
            <h2 className="text-xl font-bold mb-6">Informations du jour</h2>
            <div className="space-y-4">
              <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#C4B5A2]/20">
                <h3 className="font-semibold mb-2">Événements spéciaux</h3>
                <p className="text-sm text-gray-300">Anniversaire table 8 (21h)</p>
              </div>
              <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#C4B5A2]/20">
                <h3 className="font-semibold mb-2">Allergies signalées</h3>
                <p className="text-sm text-gray-300">Gluten (table 4)<br/>Fruits de mer (table 12)</p>
              </div>
              <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#C4B5A2]/20">
                <h3 className="font-semibold mb-2">Notes importantes</h3>
                <p className="text-sm text-gray-300">Groupe de 8 personnes (19h30)<br/>Client régulier table 6</p>
              </div>
            </div>
          </div>
        </div>

        <RecentReservations reservations={reservations} />
      </div>
    </div>
  );
}