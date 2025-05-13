import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tiki-resto-backend.onrender.com';

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token d'authentification
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: "Token d'authentification manquant ou invalide" },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Vérifier le token
    try {
      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, secret) as { id: number, email: string };
      
      // Récupérer l'ID utilisateur
      const userId = decoded.id;
      
      // Appeler le backend pour obtenir les commandes
      const response = await fetch(`${API_URL}/seafood-orders/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Si l'API user renvoie une erreur 404, essayer avec la recherche par email
        if (response.status === 404) {
          const email = decoded.email;
          return await searchByEmailFallback(email, token);
        }
        
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
          { message: errorData.message || "Erreur lors de la récupération des commandes" },
          { status: response.status }
        );
      }
      
      const orders = await response.json();
      return NextResponse.json(orders);
    } catch (error: any) {
      console.error('Erreur de vérification du token:', error);
      return NextResponse.json(
        { message: error.message || "Token invalide" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la récupération des commandes" },
      { status: 500 }
    );
  }
}

// Fonction de secours pour rechercher par email
async function searchByEmailFallback(email: string, token: string) {
  try {
    const response = await fetch(`${API_URL}/seafood-orders/search?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || "Erreur lors de la recherche des commandes par email" },
        { status: response.status }
      );
    }
    
    const orders = await response.json();
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Erreur lors de la recherche par email:', error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la recherche des commandes par email" },
      { status: 500 }
    );
  }
} 