"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Reservation } from '@/types/reservation';

interface ChartData {
  date: string;
  guests: number;
}

interface ReservationsChartProps {
  reservations: Reservation[];
}

export default function ReservationsChart({ reservations }: ReservationsChartProps) {
  // Préparer les données pour le graphique
  const chartData: ChartData[] = Array.from({ length: 7 }, (_, i) => {
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
  );
} 