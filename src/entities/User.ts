export interface User {
  id: number;
  name: string;
  email: string;
  telephone: string;
  role: 'admin' | 'user';
  password?: string; // Optional car on ne veut pas toujours renvoyer le mot de passe
  createdAt: Date;
  updatedAt: Date;
}

// Type pour la création d'un nouvel utilisateur
export interface CreateUserDTO {
  name: string;
  email: string;
  telephone: string;
  password: string;
  role?: 'admin' | 'user';
}

// Type pour la connexion
export interface LoginDTO {
  email: string;
  password: string;
}

// Type pour la réponse après authentification
export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
} 