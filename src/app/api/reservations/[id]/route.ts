import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log(`API: Tentative d'annulation de la réservation ID: ${id}`);

    // Vérifier l'authentification
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { message: 'Token d\'authentification manquant' },
        { status: 401 }
      );
    }

    // Vérifier et décoder le token
    const decoded = await verifyAuth(token);
    if (!decoded || !decoded.sub) {
      return NextResponse.json(
        { message: 'Token invalide ou expiré' },
        { status: 401 }
      );
    }

    // Transmettre la requête d'annulation au backend
    try {
      const backendResponse = await fetch(`${API_URL}/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json().catch(() => ({}));
        console.error('API: Erreur du backend lors de l\'annulation:', backendResponse.status, errorData);
        return NextResponse.json(
          { message: errorData.message || 'Erreur lors de l\'annulation de la réservation' },
          { status: backendResponse.status }
        );
      }

      console.log(`API: Réservation ${id} annulée avec succès`);
      return NextResponse.json(
        { message: 'Réservation annulée avec succès' },
        { status: 200 }
      );
    } catch (fetchError: any) {
      console.error('API: Erreur de communication avec le backend:', fetchError);
      return NextResponse.json(
        { message: 'Impossible de communiquer avec le serveur de réservation' },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error('API: Erreur inattendue lors de l\'annulation:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'annulation de la réservation', error: error.message },
      { status: 500 }
    );
  }
}

// Méthode PATCH pour les mises à jour partielles
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log(`API: Tentative de modification de la réservation ID: ${id}`);

    // Vérifier l'authentification
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { message: 'Token d\'authentification manquant' },
        { status: 401 }
      );
    }

    // Vérifier et décoder le token
    const decoded = await verifyAuth(token);
    if (!decoded || !decoded.sub) {
      return NextResponse.json(
        { message: 'Token invalide ou expiré' },
        { status: 401 }
      );
    }

    // Récupérer les données de la requête
    const body = await request.json();
    console.log(`API: Données de modification reçues:`, body);

    // Format de date pour le backend: YYYY-MM-DDThh:mm:ss
    if (body.date && body.time) {
      // Créer une date ISO à partir de la date et l'heure
      const [hours, minutes] = body.time.split(':');
      const reservationDate = new Date(body.date);
      reservationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Remplacer date et time par reservationDateTime
      body.reservationDateTime = reservationDate.toISOString();
      delete body.date;
      delete body.time;
      
      // Renommer guests en numberOfGuests si nécessaire
      if (body.guests && !body.numberOfGuests) {
        body.numberOfGuests = body.guests;
        delete body.guests;
      }
    }

    console.log(`API: Données de modification formatées:`, body);

    // Transmettre la requête de modification au backend
    try {
      const backendResponse = await fetch(`${API_URL}/reservations/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json().catch(() => ({}));
        console.error('API: Erreur du backend lors de la modification:', backendResponse.status, errorData);
        return NextResponse.json(
          { message: errorData.message || 'Erreur lors de la modification de la réservation' },
          { status: backendResponse.status }
        );
      }

      // Récupérer la réservation mise à jour
      const updatedReservation = await backendResponse.json();
      
      // Transformer pour le frontend
      const transformedReservation = {
        id: updatedReservation.id,
        date: new Date(updatedReservation.reservationDateTime).toISOString().split('T')[0],
        time: new Date(updatedReservation.reservationDateTime).toLocaleTimeString('fr-FR', { 
          hour: '2-digit', minute: '2-digit'
        }),
        guests: updatedReservation.numberOfGuests,
        status: 'confirmed',
        specialRequests: updatedReservation.specialRequests,
        userId: updatedReservation.userId || decoded.sub
      };

      console.log(`API: Réservation ${id} modifiée avec succès`);
      return NextResponse.json(transformedReservation);
    } catch (fetchError: any) {
      console.error('API: Erreur de communication avec le backend:', fetchError);
      return NextResponse.json(
        { message: 'Impossible de communiquer avec le serveur de réservation' },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error('API: Erreur inattendue lors de la modification:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la modification de la réservation', error: error.message },
      { status: 500 }
    );
  }
}

// PUT pour compatibilité (utilisera la même logique que PATCH)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Réutiliser le code de PATCH pour les mises à jour complètes
  return PATCH(request, { params });
} 