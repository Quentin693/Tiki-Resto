import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    console.log('JWT Guard: En-tête Authorization:', authHeader ? `${authHeader.substring(0, 15)}...` : 'Absent');
    console.log('JWT Guard: Route demandée:', `${request.method} ${request.url}`);
    
    if (!authHeader) {
      console.log('JWT Guard: Pas d\'en-tête Authorization, accès refusé');
      throw new UnauthorizedException('Token d\'authentification manquant');
    }
    
    // Vérifier si la route est publique
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Sinon, vérifier l'authentification
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      console.error('JWT Guard: Erreur de validation du token:', err?.message || 'Utilisateur non trouvé');
      if (info) {
        console.error('JWT Guard: Informations supplémentaires:', info.message);
      }
      throw err || new UnauthorizedException('Token d\'authentification invalide');
    }
    
    console.log('JWT Guard: Utilisateur authentifié ID:', user.id);
    return user;
  }
} 