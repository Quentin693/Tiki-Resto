import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // Dans un vrai projet, vous utiliserez une base de données
  private readonly users = [
    {
      userId: 1,
      username: 'admin@tiki.com',
      password: 'admin123', // En production, utilisez du hash bcrypt
      name: 'Admin',
      role: 'admin',
    },
    {
      userId: 2,
      username: 'user@tiki.com',
      password: 'user123',
      name: 'Utilisateur Test',
      role: 'user',
    },
  ];

  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find(user => user.username === username);
    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      sub: user.userId, 
      email: user.username,
      role: user.role 
    };
    
    return {
      user: {
        id: user.userId,
        name: user.name,
        email: user.username,
        role: user.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
} 