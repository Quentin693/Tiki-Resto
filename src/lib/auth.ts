import { verify } from 'jsonwebtoken';

interface DecodedToken {
  sub: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export async function verifyAuth(token: string): Promise<DecodedToken | null> {
  try {
    // La clé secrète doit correspondre à celle utilisée dans le backend
    const secret = process.env.JWT_SECRET || 'tiki-secret-key-2023';
    
    // Vérification synchrone du token
    const decoded = verify(token, secret) as DecodedToken;
    
    // Vérifier si le token a expiré
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      console.error('Token expiré:', new Date(decoded.exp * 1000).toLocaleString(), 'vs maintenant:', new Date().toLocaleString());
      return null;
    }
    
    return decoded;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      console.error('Token expiré:', error.expiredAt);
    } else if (error.name === 'JsonWebTokenError') {
      console.error('Token invalide:', error.message);
    } else {
      console.error('Erreur lors de la vérification du token:', error);
    }
    return null;
  }
} 