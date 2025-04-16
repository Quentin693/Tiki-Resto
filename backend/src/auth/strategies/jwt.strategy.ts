import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'tiki-secret-key-2023',
    });
    console.log('JWT Strategy: Initialisée avec la clé secrète');
  }

  async validate(payload: any) {
    // Le payload contient les données que nous avons incluses lors de la génération du token
    const { sub: id, email } = payload;
    
    console.log(`JWT Strategy: Validation du token pour l'utilisateur ID: ${id}, Email: ${email}`);
    
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      
      if (!user) {
        console.error(`JWT Strategy: Utilisateur avec ID ${id} non trouvé en base de données`);
        throw new UnauthorizedException('Utilisateur non trouvé');
      }
      
      console.log(`JWT Strategy: Utilisateur ${user.email} validé avec succès`);
      
      // On ne renvoie pas le mot de passe
      const { password, ...result } = user;
      return result;
    } catch (error) {
      console.error('JWT Strategy: Erreur lors de la validation:', error.message);
      throw new UnauthorizedException('Erreur de validation du token');
    }
  }
} 