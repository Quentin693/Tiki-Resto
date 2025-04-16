"use client"

import TimeSlots from '@/components/reserver/TimeSlots';
import { format } from 'date-fns';

interface ReservationFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfGuests: number;
  time: string;
  specialRequests: string;
  userId?: number;
  
}

interface ReservationFormProps {
  formData: ReservationFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitMessage: { type: string; text: string };
  selectedDate: Date;
  isEditing: boolean;
}

export default function ReservationForm({
  formData,
  onChange,
  onSubmit,
  isSubmitting,
  submitMessage,
  selectedDate,
  isEditing
}: ReservationFormProps) {
  return (
    <div className="bg-[#3a3a3a] rounded-lg p-4 mb-6">
      <h4 className="text-lg font-semibold mb-4">
        {isEditing ? 'Modifier la réservation' : 'Nouvelle réservation (appel téléphonique)'}
      </h4>
      {submitMessage.text && (
        <div className={`p-3 mb-4 rounded ${submitMessage.type === 'error' ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}`}>
          {submitMessage.text}
        </div>
      )}
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Nom du client*</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={onChange}
            className="w-full bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Téléphone*</label>
          <input
            type="tel"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={onChange}
            className="w-full bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email (optionnel)</label>
          <input
            type="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={onChange}
            className="w-full bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Nombre de personnes*</label>
          <input
            type="number"
            name="numberOfGuests"
            min="1"
            value={formData.numberOfGuests}
            onChange={onChange}
            className="w-full bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-2"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-400 mb-1">Créneau horaire*</label>
          <div className="mt-2">
            <TimeSlots 
              date={format(selectedDate, 'yyyy-MM-dd')} 
              time={formData.time} 
              setFormData={(formData) => {
                const event = {
                  target: {
                    name: 'time',
                    value: formData.time || formData
                  }
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(event);
              }}
              isAdmin={true}
            />
          </div>
          {!formData.time && (
            <p className="text-orange-400 text-sm mt-2">Veuillez sélectionner un créneau horaire</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-400 mb-1">Demandes spéciales</label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={onChange}
            className="w-full bg-[#2a2a2a] border border-[#4a4a4a] rounded-lg p-2 min-h-[80px]"
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !formData.time}
            className="px-6 py-2 bg-[#C4B5A2] text-black rounded-lg font-medium hover:bg-[#d8c7b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting 
              ? 'Traitement...' 
              : isEditing 
                ? 'Mettre à jour la réservation' 
                : 'Créer la réservation'
            }
          </button>
        </div>
      </form>
    </div>
  );
} 