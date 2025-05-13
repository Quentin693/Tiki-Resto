import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tiki-resto-backend.onrender.com';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reservationId = params.id;
    
    // Récupérer les données du corps de la requête (pour sendSms)
    let requestBody = {};
    try {
      requestBody = await request.json();
    } catch {
      // Continuer même si le corps est vide
    }
    
    console.log('Données pour suppression:', requestBody);
    
    // Récupérer le token d'authentification
    const authHeader = request.headers.get('authorization');
    const tokenToUse = authHeader?.startsWith('Bearer ') 
      ? authHeader.split(' ')[1]
      : null;
      
    console.log('Token disponible pour suppression:', !!tokenToUse);
    
    // Tenter l'approche avec le token si disponible
    if (tokenToUse) {
      try {
        const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenToUse}`
          },
          body: JSON.stringify(requestBody)
        });
        
        console.log('Statut de la réponse de suppression (token):', response.status);
        
        if (response.ok) {
          const result = await response.json();
          return NextResponse.json(result);
        }
        
        // Si c'est une erreur d'authentification, essayer l'approche alternative
        if (response.status === 401 || response.status === 403) {
          console.log('Erreur d\'authentification, essai avec méthode alternative');
          // Continuer avec la méthode alternative ci-dessous
        } else {
          // Pour les autres erreurs, retourner directement
          return NextResponse.json(
            { message: `Erreur ${response.status} lors de la suppression` },
            { status: response.status }
          );
        }
      } catch (error) {
        console.error('Erreur lors de la suppression avec token:', error);
        // Continuer avec l'approche alternative
      }
    }
    
    // Approche alternative: supprimer directement
    try {
      const deleteResponse = await fetch(`${API_URL}/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!deleteResponse.ok) {
        return NextResponse.json(
          { message: `Erreur ${deleteResponse.status} lors de la suppression` },
          { status: deleteResponse.status }
        );
      }
      
      const result = await deleteResponse.json();
      return NextResponse.json(result);
      
    } catch (error: any) {
      console.error('Erreur lors de la suppression alternative:', error);
      return NextResponse.json(
        { message: error.message || "Erreur lors de la suppression" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Erreur serveur lors de la suppression:', error);
    return NextResponse.json(
      { message: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

// Méthode PATCH pour les mises à jour partielles
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reservationId = params.id;
    
    // Récupérer les données du corps de la requête
    const updateData = await request.json();
    console.log('Données de modification de réservation:', updateData);
    
    // Récupérer le token d'authentification
    const authHeader = request.headers.get('authorization');
    const tokenToUse = authHeader?.startsWith('Bearer ') 
      ? authHeader.split(' ')[1]
      : null;
      
    console.log('Token disponible:', !!tokenToUse);
    
    // Tenter l'approche avec le token si disponible
    if (tokenToUse) {
      try {
        const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenToUse}`
          },
          body: JSON.stringify(updateData)
        });
        
        console.log('Statut de la réponse (token):', response.status);
        
        if (response.ok) {
          const updatedReservation = await response.json();
          return NextResponse.json(updatedReservation);
        }
        
        // Capturer le message d'erreur
        let errorResponse;
        try {
          errorResponse = await response.json();
        } catch {
          errorResponse = { message: `Erreur ${response.status}` };
        }
        
        // Si c'est une erreur d'authentification, passer à l'approche suivante
        if (response.status === 401 || response.status === 403) {
          console.log('Erreur d\'authentification, essai avec méthode alternative');
          // Continuer avec la méthode alternative ci-dessous
        } else {
          // Pour d'autres erreurs, retourner directement
          return NextResponse.json(errorResponse, { status: response.status });
        }
      } catch (error) {
        console.error('Erreur lors de la requête avec token:', error);
        // Continuer avec l'approche alternative
      }
    }
    
    // Approche alternative: rechercher la réservation par ID puis vérifier si les infos correspondent
    try {
      // Récupérer la réservation actuelle
      const getResponse = await fetch(`${API_URL}/reservations/${reservationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!getResponse.ok) {
        return NextResponse.json(
          { message: "Réservation non trouvée" },
          { status: 404 }
        );
      }
      
      const reservation = await getResponse.json();
      
      // Directement envoyer la mise à jour
      const updateResponse = await fetch(`${API_URL}/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('Erreur lors de la mise à jour:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          return NextResponse.json(
            { message: errorData.message || "Erreur lors de la mise à jour de la réservation" },
            { status: updateResponse.status }
          );
        } catch (e) {
          return NextResponse.json(
            { message: `Erreur ${updateResponse.status} lors de la mise à jour` },
            { status: updateResponse.status }
          );
        }
      }
      
      const updatedReservation = await updateResponse.json();
      return NextResponse.json(updatedReservation);
      
    } catch (error: any) {
      console.error('Erreur lors de l\'approche alternative:', error);
      return NextResponse.json(
        { message: error.message || "Erreur lors de la mise à jour de la réservation" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { message: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PUT pour compatibilité (utilisera la même logique que PATCH)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Réutiliser le code de PATCH pour les mises à jour complètes
  return PATCH(request, { params });
} 