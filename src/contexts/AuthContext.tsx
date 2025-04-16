'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Définition des types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phoneNumber: string) => Promise<boolean>;
  logout: () => void;
  checkToken: () => Promise<boolean>;
  refreshLogin: () => Promise<boolean>;
}

// Création du contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Composant Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error loading auth state from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log(`Tentative de connexion pour ${email}`);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Réponse de l\'API login:', response.status, data);

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }

      if (!data.user || !data.token) {
        console.error('Données de connexion incomplètes:', data);
        throw new Error('Données de connexion incomplètes');
      }

      // Assurer que le rôle est bien défini
      if (!data.user.role) {
        console.warn('Rôle utilisateur non défini, définition par défaut à "user"');
        data.user.role = 'user';
      }

      console.log('Utilisateur authentifié avec rôle:', data.user.role);

      // Sauvegarder dans localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      // Mettre à jour l'état
      setUser(data.user);
      setToken(data.token);
      
      console.log('Connexion réussie pour:', data.user.email);
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (
    name: string,
    email: string,
    password: string,
    phoneNumber: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log(`Tentative d'inscription pour ${email}`);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phoneNumber }),
      });

      const data = await response.json();
      console.log('Réponse de l\'API inscription:', response.status, data);

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      if (!data.user || !data.token) {
        console.error('Données d\'inscription incomplètes:', data);
        throw new Error('Données d\'inscription incomplètes');
      }

      // Assurer que le rôle est bien défini
      if (!data.user.role) {
        console.warn('Rôle utilisateur non défini, définition par défaut à "user"');
        data.user.role = 'user';
      }

      console.log('Nouvel utilisateur inscrit avec rôle:', data.user.role);

      // Sauvegarder dans localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      // Mettre à jour l'état
      setUser(data.user);
      setToken(data.token);
      
      console.log('Inscription réussie pour:', data.user.email);
      return true;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Vérification de la validité du token
  const checkToken = async (): Promise<boolean> => {
    if (!token) return false;
    
    try {
      // Faire une requête à une API protégée pour vérifier si le token est valide
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return false;
    }
  };

  // Rafraîchir les informations de l'utilisateur
  const refreshLogin = async (): Promise<boolean> => {
    // Si l'utilisateur n'est pas connecté ou n'a pas d'email, impossible de rafraîchir
    if (!user || !user.email) return false;
    
    try {
      // Utiliser l'API de récupération des informations utilisateur par email
      const response = await fetch(`/api/auth/user?email=${encodeURIComponent(user.email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) return false;
      
      const userData = await response.json();
      
      // Sauvegarder dans localStorage
      localStorage.setItem('user', JSON.stringify(userData.user));
      localStorage.setItem('token', userData.token);
      
      // Mettre à jour l'état
      setUser(userData.user);
      setToken(userData.token);
      
      return true;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de la connexion:', error);
      return false;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    // Supprimer du localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Mettre à jour l'état
    setUser(null);
    setToken(null);
    
    console.log('Déconnexion effectuée');
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkToken,
    refreshLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;