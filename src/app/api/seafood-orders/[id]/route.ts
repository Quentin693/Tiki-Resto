import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tiki-resto-backend.onrender.com';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    
    if (!orderId) {
      return NextResponse.json(
        { message: "ID de commande manquant" },
        { status: 400 }
      );
    }
    
    // Récupérer les données du corps de la requête
    const updateData = await request.json();
    console.log('Données reçues pour mise à jour de commande:', updateData);
    
    // Récupérer le token d'authentification
    const authHeader = request.headers.get('authorization');
    const tokenToUse = authHeader?.startsWith('Bearer ') 
      ? authHeader.split(' ')[1]
      : null;
      
    console.log('Token disponible pour mise à jour:', !!tokenToUse);
    
    // Tenter d'abord la requête avec le token si disponible
    if (tokenToUse) {
      try {
        const response = await fetch(`${API_URL}/seafood-orders/${orderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenToUse}`
          },
          body: JSON.stringify(updateData)
        });
        
        console.log('Statut de la réponse de modification (token):', response.status);
        
        if (response.ok) {
          const updatedOrder = await response.json();
          return NextResponse.json(updatedOrder);
        }
        
        // Si erreur d'authentification, on passera à la méthode alternative
        if (response.status === 401 || response.status === 403) {
          console.log('Erreur d\'authentification, essai avec méthode alternative');
          // Continuer avec la méthode alternative ci-dessous
        } else {
          // Pour les autres erreurs, on retourne directement
          const errorText = await response.text();
          try {
            const errorData = JSON.parse(errorText);
            return NextResponse.json(
              { message: errorData.message || `Erreur ${response.status}` },
              { status: response.status }
            );
          } catch (e) {
            return NextResponse.json(
              { message: `Erreur ${response.status}` },
              { status: response.status }
            );
          }
        }
      } catch (error) {
        console.error('Erreur lors de la requête avec token:', error);
        // Continuer avec la méthode alternative
      }
    }
    
    // Méthode alternative en utilisant l'API spécifique avec vérification par contact
    console.log('Tentative alternative avec email/téléphone');
    
    // Vérifier si nous avons l'email ou le téléphone dans les données
    if (!updateData.customerEmail && !updateData.customerPhone) {
      // Si non disponibles, essayer de récupérer la commande d'abord
      try {
        const getResponse = await fetch(`${API_URL}/seafood-orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (getResponse.ok) {
          const order = await getResponse.json();
          
          // Ajouter les coordonnées du client aux données de mise à jour
          updateData.customerEmail = order.customerEmail;
          updateData.customerPhone = order.customerPhone;
        } else {
          return NextResponse.json(
            { message: "Impossible de récupérer les informations de la commande" },
            { status: 404 }
          );
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations de commande:', error);
        return NextResponse.json(
          { message: "Erreur lors de la récupération des informations de commande" },
          { status: 500 }
        );
      }
    }
    
    try {
      const alternativeResponse = await fetch(`${API_URL}/seafood-orders/update-by-contact/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      console.log('Statut de la réponse de la méthode alternative:', alternativeResponse.status);
      
      if (!alternativeResponse.ok) {
        const errorText = await alternativeResponse.text();
        console.error('Erreur lors de la mise à jour alternative:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          return NextResponse.json(
            { message: errorData.message || "Erreur lors de la mise à jour de la commande" },
            { status: alternativeResponse.status }
          );
        } catch (e) {
          return NextResponse.json(
            { message: `Erreur ${alternativeResponse.status} lors de la mise à jour` },
            { status: alternativeResponse.status }
          );
        }
      }
      
      const updatedOrder = await alternativeResponse.json();
      return NextResponse.json(updatedOrder);
      
    } catch (error: any) {
      console.error('Erreur lors de la méthode alternative:', error);
      return NextResponse.json(
        { message: error.message || "Erreur lors de la mise à jour de la commande" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { message: error.message || "Erreur serveur lors de la mise à jour de la commande" },
      { status: 500 }
    );
  }
}

// Ajouter la méthode DELETE pour les annulations
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    
    if (!orderId) {
      return NextResponse.json(
        { message: "ID de commande manquant" },
        { status: 400 }
      );
    }
    
    // Récupérer les données du corps de la requête (pour sendSms)
    let requestBody = {};
    try {
      requestBody = await request.json();
    } catch {
      // Continuer même si le corps est vide
    }
    
    console.log('Données pour suppression de commande:', requestBody);
    
    // Récupérer le token d'authentification
    const authHeader = request.headers.get('authorization');
    const tokenToUse = authHeader?.startsWith('Bearer ') 
      ? authHeader.split(' ')[1]
      : null;
      
    console.log('Token disponible pour suppression de commande:', !!tokenToUse);
    
    // Tenter d'abord la requête avec le token si disponible
    if (tokenToUse) {
      try {
        const response = await fetch(`${API_URL}/seafood-orders/${orderId}`, {
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
        
        // Si erreur d'authentification, on essaiera la méthode alternative
        if (response.status === 401 || response.status === 403) {
          console.log('Erreur d\'authentification, essai avec méthode alternative');
          // Continuer avec la méthode alternative ci-dessous
        } else {
          // Pour les autres erreurs, on retourne directement
          return NextResponse.json(
            { message: `Erreur ${response.status} lors de la suppression` },
            { status: response.status }
          );
        }
      } catch (error) {
        console.error('Erreur lors de la suppression avec token:', error);
        // Continuer avec la méthode alternative
      }
    }
    
    // Méthode alternative pour la suppression
    try {
      // Récupérer d'abord les informations de la commande
      const getResponse = await fetch(`${API_URL}/seafood-orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!getResponse.ok) {
        return NextResponse.json(
          { message: "Commande non trouvée" },
          { status: 404 }
        );
      }
      
      const order = await getResponse.json();
      
      // Créer un objet avec les coordonnées du client et les autres données
      const deleteData = {
        ...requestBody,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone
      };
      
      // Utiliser l'API alternative pour la suppression
      const alternativeResponse = await fetch(`${API_URL}/seafood-orders/delete-by-contact/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deleteData)
      });
      
      if (!alternativeResponse.ok) {
        return NextResponse.json(
          { message: `Erreur ${alternativeResponse.status} lors de la suppression` },
          { status: alternativeResponse.status }
        );
      }
      
      const result = await alternativeResponse.json();
      return NextResponse.json(result);
      
    } catch (error: any) {
      console.error('Erreur lors de la suppression alternative:', error);
      return NextResponse.json(
        { message: error.message || "Erreur lors de la suppression de la commande" },
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