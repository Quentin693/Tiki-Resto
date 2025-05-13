import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tiki-resto-backend.onrender.com';

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de recherche
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    
    // Vérifier qu'au moins un paramètre est fourni
    if (!email && !phone) {
      return NextResponse.json(
        { message: "Veuillez fournir au moins un critère de recherche (email ou téléphone)" },
        { status: 400 }
      );
    }
    
    // Construire l'URL avec les paramètres
    let queryUrl = `${API_URL}/seafood-orders/search?`;
    if (email) {
      queryUrl += `email=${encodeURIComponent(email)}`;
    }
    if (phone) {
      if (email) queryUrl += '&';
      queryUrl += `phone=${encodeURIComponent(phone)}`;
    }
    
    // Appeler le backend pour rechercher les commandes
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || "Erreur lors de la recherche des commandes" },
        { status: response.status }
      );
    }
    
    const orders = await response.json();
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la recherche des commandes" },
      { status: 500 }
    );
  }
} 