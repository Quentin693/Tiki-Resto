import { NextResponse } from 'next/server';

// URL de l'API backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Interface pour le type des réservations backend
interface BackendReservation {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfGuests: number;
  reservationDateTime: string;
  specialRequests?: string;
  userId?: number;
  created_at?: string;
  updated_at?: string;
}

// Interface pour le type des réservations frontend
interface FrontendReservation {
  id: number;
  date: string;
  time: string;
  guests: number;
  status: string;
  specialRequests?: string;
  userId: number;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Fonction pour transformer les données de réservation
function transformReservation(reservation: BackendReservation): FrontendReservation {
  // Extraire la date et l'heure de reservationDateTime
  const dateTime = new Date(reservation.reservationDateTime);
  const date = dateTime.toISOString().split('T')[0];
  const time = dateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return {
    id: reservation.id,
    date: date,
    time: time,
    guests: reservation.numberOfGuests,
    status: 'confirmed', // Valeur par défaut
    specialRequests: reservation.specialRequests,
    userId: reservation.userId || 0,
    customerEmail: reservation.customerEmail,
    customerPhone: reservation.customerPhone,
    customerName: reservation.customerName,
    createdAt: reservation.created_at,
    updatedAt: reservation.updated_at
  };
}

/**
 * Récupère les réservations d'un utilisateur par email ou téléphone
 */
export async function GET(request: Request) {
  try {
    // Récupérer les paramètres de recherche de l'URL
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    // Vérifier qu'au moins un paramètre est fourni
    if (!email && !phone) {
      return NextResponse.json(
        { message: 'Vous devez fournir un email ou un numéro de téléphone' },
        { status: 400 }
      );
    }

    console.log(`API Search: Recherche de réservations pour email: ${email}, téléphone: ${phone}`);

    try {
      // Construire les paramètres de requête
      const queryParams = new URLSearchParams();
      if (email) queryParams.append('email', email);
      if (phone) queryParams.append('phone', phone);
      
      // Appeler l'endpoint de recherche backend
      const response = await fetch(`${API_URL}/reservations/search?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`API Search: Réponse de l'API backend: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`API Search: Erreur backend: ${response.status}`, errorData);
        throw new Error(`Erreur backend: ${response.status}`);
      }

      // Récupérer les réservations correspondantes
      const userReservations = await response.json() as BackendReservation[];
      console.log(`API Search: ${userReservations.length} réservations trouvées pour les critères de recherche`);
      
      // Transformer les réservations au format attendu par le frontend
      const frontendReservations = userReservations.map(transformReservation);
      console.log(`API Search: Réservations transformées pour le frontend: ${frontendReservations.length}`);

      return NextResponse.json(frontendReservations);
    } catch (backendError) {
      console.error('API Search: Erreur lors de la communication avec le backend:', backendError);
      
      // En mode développement, renvoyer des données de test
      if (process.env.NODE_ENV === 'development') {
        console.log('API Search: Utilisation de données de test pour les réservations');
        const testReservations: FrontendReservation[] = [{
          id: 1,
          date: new Date().toISOString().split('T')[0],
          time: '19:30',
          guests: 2,
          status: 'confirmed',
          specialRequests: 'Fenêtre si possible',
          userId: 1,
          customerEmail: email || '',
          customerPhone: phone || '',
          customerName: 'Utilisateur Test'
        }];
        
        return NextResponse.json(testReservations);
      }
      
      // En production, renvoyer l'erreur
      return NextResponse.json(
        { message: 'Erreur lors de la recherche des réservations dans le backend' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Search: Erreur non gérée lors de la recherche des réservations:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la recherche des réservations' },
      { status: 500 }
    );
  }
} 