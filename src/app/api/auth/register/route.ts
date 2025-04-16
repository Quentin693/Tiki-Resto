import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: Request) {
  try {
    const { name, email, password, phoneNumber } = await request.json();
    
    // Validation de base des entrées
    if (!name || !email || !password || !phoneNumber) {
      console.log('API Register: Données manquantes:', { 
        name: !!name, 
        email: !!email, 
        password: !!password, 
        phoneNumber: !!phoneNumber 
      });
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    console.log('API Register: Tentative d\'inscription pour', email);

    // Validation du format de l'email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('API Register: Format d\'email invalide:', email);
      return NextResponse.json(
        { message: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validation du mot de passe
    if (password.length < 6) {
      console.log('API Register: Mot de passe trop court');
      return NextResponse.json(
        { message: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Mode normal - transmettre la demande au backend
    console.log('API Register: Requête au backend:', `${API_URL}/auth/register`);
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          phoneNumber 
        }),
      });
      
      console.log('API Register: Réponse du backend status:', response.status);
      
      const data = await response.json();
      console.log('API Register: Réponse du backend:', {
        status: response.status,
        success: response.ok,
        data: data
      });

      // Si le backend répond avec une erreur
      if (!response.ok) {
        console.error('API Register: Erreur retournée par le backend:', data);
        return NextResponse.json(
          { 
            message: data.message || 'Erreur lors de l\'inscription',
            error: data.error || 'Erreur côté serveur'
          },
          { status: response.status }
        );
      }

      // Retourner les données de l'utilisateur
      console.log('API Register: Inscription réussie pour', email);
      
      // Préparer la réponse complète
      return NextResponse.json({
        success: true,
        message: 'Inscription réussie',
        user: data.user,
        token: data.token
      });
      
    } catch (fetchError: any) {
      console.error('API Register: Erreur lors de la requête au backend:', fetchError);
      
      return NextResponse.json(
        { 
          message: 'Impossible de communiquer avec le serveur d\'authentification',
          error: fetchError.message
        },
        { status: 503 }
      );
    }
    
  } catch (error: any) {
    console.error('API Register: Erreur inattendue:', error);
    return NextResponse.json(
      { message: error.message || 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    );
  }
} 