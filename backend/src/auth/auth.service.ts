import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {
    this.logger.log('AuthService initialized');
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      this.logger.log(`Attempting to validate user with email: ${email}`);
      const user = await this.usersRepository.findOne({ where: { email } });
      
      if (!user) {
        this.logger.warn(`No user found with email: ${email}`);
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      this.logger.log(`Password validation result for ${email}: ${isPasswordValid}`);

      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
      
      return null;
    } catch (error) {
      this.logger.error('Error validating user:', error.message);
      throw new UnauthorizedException('Erreur lors de la validation');
    }
  }

  async register(userData: { name: string; email: string; password: string; phoneNumber: string }): Promise<any> {
    try {
      this.logger.log(`Attempting to register user with email: ${userData.email}`);
      
      // Vérifier si l'email existe déjà
      const existingUser = await this.usersRepository.findOne({ 
        where: { email: userData.email } 
      });

      if (existingUser) {
        this.logger.warn(`Email already in use: ${userData.email}`);
        throw new UnauthorizedException('Cet email est déjà utilisé');
      }

      // Vérifier si c'est un email admin pour définir le rôle
      const isAdmin = userData.email.includes('admin') || userData.email.includes('tiki-admin');
      const role = isAdmin ? 'admin' : 'user';
      
      this.logger.log(`Assigning role "${role}" to user with email: ${userData.email}`);

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      this.logger.log(`Password hashed for user: ${userData.email}`);

      // Créer le nouvel utilisateur
      const newUser = new Users();
      newUser.name = userData.name;
      newUser.email = userData.email;
      newUser.password = hashedPassword;
      newUser.role = role;
      newUser.phone_number = userData.phoneNumber;

      // Sauvegarder l'utilisateur
      const savedUser = await this.usersRepository.save(newUser);
      this.logger.log(`User registered successfully with ID: ${savedUser.id} and role: ${savedUser.role}`);

      // Générer le token JWT
      const payload = {
        sub: savedUser.id,
        email: savedUser.email,
        role: savedUser.role
      };
      this.logger.log(`Creating JWT payload for user ${savedUser.id}: ${JSON.stringify(payload)}`);
      
      const token = this.jwtService.sign(payload);
      this.logger.log(`Token generated successfully for user ${savedUser.id}`);

      return {
        user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
          phoneNumber: savedUser.phone_number
        },
        token
      };
    } catch (error) {
      this.logger.error('Error registering user:', error.message);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Erreur lors de l\'inscription');
    }
  }

  async login(user: any) {
    this.logger.log(`Generating token for user ID: ${user.id}, email: ${user.email}, role: ${user.role}`);
    
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };
    
    this.logger.log(`JWT payload for login: ${JSON.stringify(payload)}`);

    const token = this.jwtService.sign(payload);
    this.logger.log(`Token generated successfully with signature: ${token.split('.')[2].substring(0, 10)}...`);
    
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phone_number
      },
      token
    };
  }
}