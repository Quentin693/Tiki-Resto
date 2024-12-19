"use client"

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock8
} from 'lucide-react';

// Données simulées
const mockReservations = [
  { date: 'Lundi', reservations: 24 },
  { date: 'Mardi', reservations: 18 },
  { date: 'Mercredi', reservations: 32 },
  { date: 'Jeudi', reservations: 45 },
  { date: 'Vendredi', reservations: 55 },
  { date: 'Samedi', reservations: 62 },
  { date: 'Dimanche', reservations: 42 }
];

const mockTables = [
  { id: 1, status: 'occupied', capacity: 4 },
  { id: 2, status: 'available', capacity: 2 },
  { id: 3, status: 'reserved', capacity: 6 },
  { id: 4, status: 'occupied', capacity: 4 },
  { id: 5, status: 'available', capacity: 8 },
  { id: 6, status: 'available', capacity: 4 }
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* En-tête du Dashboard */}
      <div className="bg-[#2a2a2a] border-b border-[#C4B5A2]">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Dashboard Administrateur</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Réservations du jour"
            value="28"
            icon={<Calendar className="w-6 h-6" />}
            trend="+12%"
          />
          <StatCard 
            title="Tables disponibles"
            value="8/15"
            icon={<Users className="w-6 h-6" />}
            trend="-3"
          />
          <StatCard 
            title="Temps d'attente moyen"
            value="25 min"
            icon={<Clock className="w-6 h-6" />}
            trend="+5min"
          />
          <StatCard 
            title="Revenu journalier"
            value="2,450€"
            icon={<DollarSign className="w-6 h-6" />}
            trend="+18%"
          />
        </div>

        {/* Graphique et Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Graphique des réservations */}
          <div className="lg:col-span-2 bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
            <h2 className="text-xl font-bold mb-6">Réservations de la semaine</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockReservations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                  <XAxis dataKey="date" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #C4B5A2',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="reservations" fill="#C4B5A2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* État des tables */}
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
            <h2 className="text-xl font-bold mb-6">État des tables</h2>
            <div className="space-y-4">
              {mockTables.map((table) => (
                <TableStatusCard key={table.id} table={table} />
              ))}
            </div>
          </div>
        </div>

        {/* Réservations récentes */}
        <div className="mt-8 bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
          <h2 className="text-xl font-bold mb-6">Réservations récentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#C4B5A2]/30">
                  <th className="text-left py-4">Client</th>
                  <th className="text-left py-4">Table</th>
                  <th className="text-left py-4">Heure</th>
                  <th className="text-left py-4">Personnes</th>
                  <th className="text-left py-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                <ReservationRow 
                  name="Martin Dupont"
                  table="4"
                  time="19:30"
                  people="4"
                  status="confirmed"
                />
                <ReservationRow 
                  name="Sophie Martin"
                  table="2"
                  time="20:00"
                  people="2"
                  status="pending"
                />
                <ReservationRow 
                  name="Jean Durand"
                  table="6"
                  time="19:00"
                  people="6"
                  status="arrived"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant Carte Statistique
function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#C4B5A2]/30">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-[#C4B5A2]/10 rounded-lg">
          {icon}
        </div>
        <span className={`text-sm ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

// Composant État de Table
function TableStatusCard({ table }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-green-500';
      case 'occupied': return 'bg-red-500';
      case 'reserved': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-[#3a3a3a] rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${getStatusColor(table.status)}`} />
        <span>Table {table.id}</span>
      </div>
      <span className="text-gray-400">{table.capacity} places</span>
    </div>
  );
}

// Composant Ligne de Réservation
function ReservationRow({ name, table, time, people, status }) {
  const getStatusInfo = (status) => {
    switch(status) {
      case 'confirmed':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
          text: 'Confirmé'
        };
      case 'pending':
        return {
          icon: <Clock8 className="w-5 h-5 text-yellow-500" />,
          text: 'En attente'
        };
      case 'arrived':
        return {
          icon: <Users className="w-5 h-5 text-blue-500" />,
          text: 'Arrivé'
        };
      default:
        return {
          icon: <AlertCircle className="w-5 h-5 text-gray-500" />,
          text: 'Inconnu'
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <tr className="border-b border-[#C4B5A2]/10">
      <td className="py-4">{name}</td>
      <td className="py-4">{table}</td>
      <td className="py-4">{time}</td>
      <td className="py-4">{people}</td>
      <td className="py-4">
        <div className="flex items-center gap-2">
          {statusInfo.icon}
          <span>{statusInfo.text}</span>
        </div>
      </td>
    </tr>
  );
}