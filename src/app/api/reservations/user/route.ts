import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Interface pour les réservations du backend
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

// Interface pour les réservations du frontend
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

export async function GET(request: Request) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    console.log('API route: En-tête d\'autorisation reçu:', authHeader ? 'Présent' : 'Absent');
    console.log('API route: Token extrait:', token ? `${token.substring(0, 15)}...` : 'Absent');
    
    if (!token) {
      console.log('API route: Token d\'authentification manquant');
      return NextResponse.json(
        { message: 'Token d\'authentification manquant' },
        { status: 401 }
      );
    }

    // Vérifier et décoder le token
    try {
      const decoded = await verifyAuth(token);
      if (!decoded || !decoded.sub) {
        console.error('API route: Token invalide ou expiré');
        return NextResponse.json(
          { message: 'Token invalide ou expiré' },
          { status: 401 }
        );
      }

      console.log(`API route: Token décodé avec succès - User ID: ${decoded.sub}, Email: ${decoded.email}, Role: ${decoded.role}`);

      // Transmettre la requête au backend
      try {
        console.log(`API route: Tentative d'appel vers ${API_URL}/reservations/user avec le token`);
        
        let backendResponse = await fetch(`${API_URL}/reservations/user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('API route: Réponse du backend pour /reservations/user:', backendResponse.status);

        // Si la nouvelle route échoue, essayer l'ancienne route avec l'ID
        if (backendResponse.status === 404) {
          console.log(`API route: Fallback vers /reservations/user/${decoded.sub}`);
          
          backendResponse = await fetch(`${API_URL}/reservations/user/${decoded.sub}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          console.log('API route: Réponse du backend pour /reservations/user/:id:', backendResponse.status);
        }

        if (!backendResponse.ok) {
          const errorBody = await backendResponse.text();
          const errorData = errorBody ? JSON.parse(errorBody) : {};
          console.error('API route: Erreur du backend:', backendResponse.status, errorData);
          console.error('API route: Corps de la réponse d\'erreur:', errorBody);
          
          // Si on ne peut pas accéder au backend et qu'on est en mode développement, retourner des données de test
          if (process.env.NODE_ENV === 'development') {
            console.log('API route: Retour de données de test en mode développement');
            return NextResponse.json([{
              id: 1,
              date: new Date().toISOString().split('T')[0],
              time: '19:30',
              guests: 2,
              status: 'confirmed',
              specialRequests: 'Fenêtre si possible',
              userId: decoded.sub,
              customerEmail: decoded.email,
              customerName: 'Utilisateur Test'
            }]);
          }
          
          return NextResponse.json(
            { message: errorData.message || `Erreur ${backendResponse.status} lors de la récupération des réservations` },
            { status: backendResponse.status }
          );
        }

        const backendReservations = await backendResponse.json();
        console.log(`API route: ${backendReservations.length} réservations trouvées`);
        
        // Transformer les réservations au format attendu par le frontend
        const frontendReservations = Array.isArray(backendReservations) 
          ? backendReservations.map(transformReservation)
          : [];
          
        console.log('API route: Réservations transformées pour le frontend:', frontendReservations);
        
        return NextResponse.json(frontendReservations);
      } catch (fetchError: any) {
        console.error('API route: Erreur de communication avec le backend:', fetchError);
        
        // En mode développement, retourner des données de test en cas d'erreur
        if (process.env.NODE_ENV === 'development') {
          console.log('API route: Erreur backend, retour de données de test');
          return NextResponse.json([{
            id: 999,
            date: new Date().toISOString().split('T')[0],
            time: '20:00',
            guests: 4,
            status: 'confirmed',
            specialRequests: 'Table au calme',
            userId: decoded.sub,
            customerEmail: decoded.email,
            customerName: 'Utilisateur Test (Mode Secours)'
          }]);
        }
        
        return NextResponse.json(
          { message: `Impossible de communiquer avec le serveur de réservation: ${fetchError.message}` },
          { status: 503 }
        );
      }
    } catch (tokenError) {
      console.error('API route: Erreur lors de la vérification du token:', tokenError);
      return NextResponse.json(
        { message: 'Erreur de vérification du token' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('API route: Erreur inattendue:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des réservations', error: error.message },
      { status: 500 }
    );
  }
} 