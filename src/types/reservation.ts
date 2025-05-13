export interface Reservation {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfGuests: number;
  reservationDateTime: string;
  date?: string;
  time?: string;
  guests?: number;
  status?: string;
  userId?: number;
  specialRequests?: string;
  createdAt?: string;
  updatedAt?: string;
  tableNumber?: number;
  isArrived?: boolean;
}

export interface ReservationForAdmin extends Reservation {
  tableNumber?: number;
  isArrived?: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  remainingCapacity: number;
}

export interface ReservationFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfGuests: number;
  time: string;
  specialRequests: string;
}

export interface SubmitMessage {
  type: string;
  text: string;
} 