import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { verify } from 'jsonwebtoken';

// Clé secrète pour la vérification de token (en développement seulement)
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-for-testing-only';

/**
 * Route API pour vérifier la validité du token d'authentification
 */
export async function GET(request: Request) {
  try {
    // Vérifier le token d'autorisation
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token d\'authentification manquant' },
        { status: 401 }
      );
    }

    // Extraire le token
    const token = authHeader.split(' ')[1];
    
    // Vérifier la validité du token
    try {
      // Tenter de vérifier le token avec verifyAuth
      try {
        const verifiedToken = await verifyAuth(token);
        if (verifiedToken) {
          return NextResponse.json(
            { valid: true, userId: verifiedToken.id },
            { status: 200 }
          );
        }
      } catch (authLibError) {
        console.log('Erreur avec verifyAuth, tentative de vérification locale');
      }
      
      // En mode développement, vérifier localement
      if (process.env.NODE_ENV === 'development') {
        try {
          const decoded = verify(token, JWT_SECRET);
          console.log('Token vérifié localement:', decoded);
          return NextResponse.json(
            { valid: true, userId: (decoded as any).id },
            { status: 200 }
          );
        } catch (jwtError) {
          console.error('Erreur de vérification JWT locale:', jwtError);
        }
      }
      
      // Si rien n'a fonctionné, le token est invalide
      throw new Error('Token invalide');
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      return NextResponse.json(
        { message: 'Token invalide ou expiré' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la vérification du token' },
      { status: 500 }
    );
  }
} 