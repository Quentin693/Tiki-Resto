import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

@ApiTags('events')
@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouvel événement' })
  @ApiResponse({ status: 201, description: 'L\'événement a été créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Requête invalide.' })
  async create(@Body() createEventDto: CreateEventDto) {
    try {
      this.logger.debug(`Received create request with data: ${JSON.stringify(createEventDto)}`);
      
      // Validation des types d'événements
      const validTypes = ['brasero', 'tapas', 'afterwork', 'anniversaire', 'fête'];
      if (!validTypes.includes(createEventDto.type)) {
        const error = `Type d'événement invalide. Doit être l'un des: ${validTypes.join(', ')}`;
        this.logger.error(error);
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Données invalides',
            message: error,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      
      return await this.eventsService.create(createEventDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erreur lors de la création de l\'événement',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les événements' })
  @ApiResponse({ status: 200, description: 'Renvoie tous les événements.' })
  async findAll() {
    try {
      return await this.eventsService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erreur lors de la récupération des événements',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Récupérer les événements par type' })
  @ApiResponse({ status: 200, description: 'Renvoie les événements pour un type spécifique.' })
  async findByType(@Param('type') type: string) {
    try {
      return await this.eventsService.findByType(type);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erreur lors de la récupération des événements par type',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un événement par son id' })
  @ApiResponse({ status: 200, description: 'Renvoie l\'événement.' })
  @ApiResponse({ status: 404, description: 'Événement non trouvé.' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.eventsService.findOne(+id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Événement non trouvé',
          message: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un événement' })
  @ApiResponse({ status: 200, description: 'L\'événement a été mis à jour avec succès.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Interdit.' })
  @ApiResponse({ status: 404, description: 'Événement non trouvé.' })
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    try {
      return await this.eventsService.update(+id, updateEventDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Erreur lors de la mise à jour de l\'événement',
          message: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un événement' })
  @ApiResponse({ status: 200, description: 'L\'événement a été supprimé avec succès.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Interdit.' })
  @ApiResponse({ status: 404, description: 'Événement non trouvé.' })
  async remove(@Param('id') id: string) {
    try {
      return await this.eventsService.remove(+id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Erreur lors de la suppression de l\'événement',
          message: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
} 