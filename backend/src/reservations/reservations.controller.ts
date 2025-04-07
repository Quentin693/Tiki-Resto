import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { TimeSlotsResponseDto } from './dto/time-slot.dto';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
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
  @ApiResponse({ status: 400, description: 'Créneau indisponible ou capacité dépassée.' })
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
} 