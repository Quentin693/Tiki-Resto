import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Validation de base des entrées
    if (!email || !password) {
      console.log('API Login: Données manquantes:', { email: !!email, password: !!password });
      return NextResponse.json(
        { message: 'Email et mot de passe sont requis' },
        { status: 400 }
      );
    }

    console.log('API Login: Tentative de connexion pour', email);
    
    // Mode normal - transmettre la demande au backend
    console.log('API Login: Requête au backend:', `${API_URL}/auth/login`);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('API Login: Réponse du backend status:', response.status);
      
      const data = await response.json();
      console.log('API Login: Données reçues du backend:', {
        status: response.status,
        success: response.ok,
        data: data
      });

      // Si le backend répond avec une erreur
      if (!response.ok) {
        console.error('API Login: Erreur retournée par le backend:', data);
        return NextResponse.json(
          { 
            message: data.message || 'Identifiants invalides',
            error: data.error || 'Erreur côté serveur'
          },
          { status: response.status }
        );
      }

      // Vérifier que les données de l'utilisateur sont présentes
      if (!data.user || !data.token) {
        console.error('API Login: Données d\'utilisateur incomplètes:', data);
        return NextResponse.json(
          { message: 'Réponse incomplète du serveur' },
          { status: 500 }
        );
      }

      // Retourner les données de l'utilisateur et le token
      console.log('API Login: Connexion réussie pour', email);
      return NextResponse.json({
        user: data.user,
        token: data.token
      });
      
    } catch (fetchError: any) {
      console.error('API Login: Erreur lors de la requête au backend:', fetchError);
      
      return NextResponse.json(
        { 
          message: 'Impossible de communiquer avec le serveur d\'authentification',
          error: fetchError.message
        },
        { status: 503 }
      );
    }
    
  } catch (error: any) {
    console.error('API Login: Erreur inattendue:', error);
    return NextResponse.json(
      { message: error.message || 'Une erreur est survenue lors de la connexion' },
      { status: 500 }
    );
  }
} 