import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur enregistré avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Email déjà utilisé' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    console.log('Register request received:', {
      name: registerDto.name,
      email: registerDto.email,
      phoneNumber: registerDto.phoneNumber,
      passwordLength: registerDto.password?.length || 0
    });

    try {
      const result = await this.authService.register(registerDto);
      console.log('User registered successfully:', result.user.email);
      return result;
    } catch (error) {
      console.error('Registration error:', error.message);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de l\'inscription');
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiResponse({ status: 200, description: 'Connexion réussie, retourne le token JWT' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    console.log('Login request received for:', loginDto.email);

    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    
    if (!user) {
      console.log('Login failed: Invalid credentials for', loginDto.email);
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    
    const result = await this.authService.login(user);
    console.log('Login successful for:', loginDto.email);
    return result;
  }
}