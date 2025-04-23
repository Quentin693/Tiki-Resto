const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tiki-resto-backend.onrender.com';

export interface Customer {
  name: string;
  phone: string;
  email?: string;
}

export interface PickupInfo {
  date: string;
  time: string;
  isPickup: boolean;
}

export interface SeafoodOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  half?: boolean;
}

export interface SeafoodPlateau {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface SeafoodOrder {
  customer: Customer;
  pickupInfo: PickupInfo;
  plateaux: SeafoodPlateau[];
  items: SeafoodOrderItem[];
  specialRequests?: string;
  totalPrice: number;
}

export interface OrderResponse {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupDate: string;
  pickupTime: string;
  isPickup: boolean;
  items: any[];
  plateaux: any[];
  totalPrice: number;
  specialRequests: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Service pour la gestion des commandes de fruits de mer
 */
export const seafoodOrdersService = {
  /**
   * Crée une nouvelle commande de fruits de mer
   */
  async createOrder(order: SeafoodOrder): Promise<OrderResponse> {
    try {
      const response = await fetch(`${API_URL}/seafood-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      throw error;
    }
  },

  /**
   * Récupère une commande par son ID
   */
  async getOrder(orderId: string): Promise<OrderResponse> {
    try {
      const response = await fetch(`${API_URL}/seafood-orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la récupération de la commande ${orderId}:`, error);
      throw error;
    }
  }
}; 