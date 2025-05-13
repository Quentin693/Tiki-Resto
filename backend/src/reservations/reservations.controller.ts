import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AdminUpdateReservationDto } from './dto/admin-update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { TimeSlotsResponseDto } from './dto/time-slot.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  private readonly logger = new Logger(ReservationsController.name);

  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle réservation' })
  @ApiResponse({ status: 201, description: 'La réservation a été créée avec succès.', type: Reservation })
  @ApiResponse({ status: 400, description: 'Créneau indisponible ou capacité dépassée.' })
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les réservations' })
  @ApiResponse({ status: 200, description: 'Liste de toutes les réservations.', type: [Reservation] })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer les réservations de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Liste des réservations de l\'utilisateur connecté.', type: [Reservation] })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token invalide ou manquant.' })
  async findMyReservations(@Request() req) {
    try {
      this.logger.log(`Contrôleur - Récupération des réservations pour l'utilisateur connecté ID: ${req.user.id}`);
      
      if (!req.user || !req.user.id) {
        this.logger.error('Contrôleur - Erreur: User ID non disponible dans la requête');
        return [];
      }
      
      const reservations = await this.reservationsService.findByUserId(req.user.id);
      this.logger.log(`Contrôleur - ${reservations.length} réservations trouvées pour l'utilisateur ${req.user.id}`);
      
      return reservations;
    } catch (error) {
      this.logger.error(`Contrôleur - Erreur lors de la récupération des réservations: ${error.message}`);
      throw error;
    }
  }

  @Get('user/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer les réservations d\'un utilisateur par son ID' })
  @ApiResponse({ status: 200, description: 'Liste des réservations de l\'utilisateur.', type: [Reservation] })
  @ApiResponse({ status: 404, description: 'Aucune réservation trouvée pour cet utilisateur.' })
  async findByUserId(@Param('id') id: string) {
    this.logger.log(`Contrôleur - Recherche des réservations pour l'utilisateur ID: ${id}`);
    
    try {
      const reservations = await this.reservationsService.findByUserId(+id);
      this.logger.log(`Contrôleur - ${reservations.length} réservations trouvées pour l'utilisateur ${id}`);
      
      return reservations;
    } catch (error) {
      this.logger.error(`Contrôleur - Erreur lors de la récupération des réservations pour l'utilisateur ${id}: ${error.message}`);
      throw error;
    }
  }

  @Get('available-slots')
  @ApiOperation({ summary: 'Récupérer les créneaux disponibles pour une date donnée' })
  @ApiQuery({ name: 'date', required: true, type: String, description: 'Date au format YYYY-MM-DD' })
  @ApiResponse({ status: 200, description: 'Liste des créneaux disponibles.', type: TimeSlotsResponseDto })
  getAvailableTimeSlots(@Query('date') date: string): Promise<TimeSlotsResponseDto> {
    return this.reservationsService.getAvailableTimeSlots(date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une réservation par son ID' })
  @ApiResponse({ status: 200, description: 'Détails de la réservation.', type: Reservation })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée.' })
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une réservation' })
  @ApiResponse({ status: 200, description: 'La réservation a été mise à jour avec succès.', type: Reservation })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée.' })
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une réservation' })
  @ApiResponse({ status: 200, description: 'La réservation a été supprimée avec succès.' })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée.' })
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher des réservations par email ou téléphone' })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'phone', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Liste des réservations correspondantes', type: [Reservation] })
  async findByContact(@Query('email') email?: string, @Query('phone') phone?: string) {
    this.logger.log(`Contrôleur - Recherche des réservations par contact: Email=${email}, Téléphone=${phone}`);
    
    if (!email && !phone) {
      this.logger.warn('Contrôleur - Aucun paramètre de recherche fourni (email ou téléphone)');
      return [];
    }
    
    try {
      return this.reservationsService.findByContact(email, phone);
    } catch (error) {
      this.logger.error(`Contrôleur - Erreur lors de la recherche des réservations par contact: ${error.message}`);
      throw error;
    }
  }
}

@ApiTags('admin')
@Controller('admin/reservations')
export class AdminReservationsController {
  private readonly logger = new Logger(AdminReservationsController.name);

  constructor(private readonly reservationsService: ReservationsService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Mettre à jour les champs administratifs d\'une réservation' })
  @ApiResponse({ status: 200, description: 'La réservation a été mise à jour avec succès.', type: Reservation })
  @ApiResponse({ status: 403, description: 'Accès interdit - Nécessite les droits administrateur.' })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée.' })
  adminUpdate(@Param('id') id: string, @Body() adminUpdateReservationDto: AdminUpdateReservationDto) {
    return this.reservationsService.adminUpdate(+id, adminUpdateReservationDto);
  }
} 