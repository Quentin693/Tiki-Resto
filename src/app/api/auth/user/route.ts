import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

// URL de l'API backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
// Clé secrète pour la génération de token (en développement seulement)
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-for-testing-only';

/**
 * Route API pour récupérer les informations d'un utilisateur par email
 */
export async function GET(request: Request) {
  try {
    // Récupérer l'email de l'URL
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { message: 'Email requis' },
        { status: 400 }
      );
    }

    console.log(`Récupération des informations utilisateur pour l'email: ${email}`);

    try {
      // Requête au backend pour récupérer l'utilisateur
      const response = await fetch(`${API_URL}/users/by-email/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur backend: ${response.status}`);
      }

      const userData = await response.json();
      console.log('Utilisateur trouvé:', userData);

      // Générer un nouveau token JWT pour l'utilisateur
      const tokenResponse = await fetch(`${API_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: userData.id,
          email: userData.email
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Erreur lors de la génération du token');
      }

      const tokenData = await tokenResponse.json();
      
      return NextResponse.json({
        user: userData,
        token: tokenData.token
      });
    } catch (backendError) {
      console.error('Erreur backend:', backendError);
      
      // En mode développement, générer des données de test
      if (process.env.NODE_ENV === 'development') {
        console.log('Génération de données de test pour l\'utilisateur:', email);
        
        // Créer un utilisateur de test basé sur l'email
        const testUser = {
          id: 1,
          name: email.split('@')[0],
          email: email,
          role: 'user',
          phoneNumber: '06 12 34 56 78'
        };
        
        // Générer un token JWT pour l'utilisateur de test
        const testToken = sign(
          { id: testUser.id, email: testUser.email, role: testUser.role },
          JWT_SECRET,
          { expiresIn: '1h' }
        );
        
        return NextResponse.json({
          user: testUser,
          token: testToken
        });
      }
      
      // En production, renvoyer l'erreur
      return NextResponse.json(
        { message: 'Utilisateur non trouvé ou erreur serveur' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Erreur non gérée lors de la récupération utilisateur:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération des informations utilisateur' },
      { status: 500 }
    );
  }
} 