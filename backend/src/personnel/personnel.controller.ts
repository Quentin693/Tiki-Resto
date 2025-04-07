import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { PersonnelService } from './personnel.service';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { Personnel } from './entities/personnel.entity';

@ApiTags('personnel')
@Controller('personnel')
export class PersonnelController {
  constructor(private readonly personnelService: PersonnelService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Créer un nouveau membre du personnel' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Le membre du personnel a été créé avec succès.', type: Personnel })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Données invalides' })
  create(@Body() createPersonnelDto: CreatePersonnelDto): Promise<Personnel> {
    return this.personnelService.create(createPersonnelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les membres du personnel ou filtrer par service' })
  @ApiQuery({ name: 'service', required: false, enum: ['salle', 'cuisine'] })
  @ApiResponse({ status: HttpStatus.OK, description: 'Liste des membres du personnel', type: [Personnel] })
  findAll(@Query('service') service?: string): Promise<Personnel[]> {
    if (service) {
      return this.personnelService.findByService(service);
    }
    return this.personnelService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un membre du personnel par son ID' })
  @ApiParam({ name: 'id', description: 'ID du membre du personnel', type: 'number' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Le membre du personnel a été trouvé', type: Personnel })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Membre du personnel non trouvé' })
  findOne(@Param('id') id: string): Promise<Personnel> {
    return this.personnelService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Mettre à jour un membre du personnel' })
  @ApiParam({ name: 'id', description: 'ID du membre du personnel', type: 'number' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Le membre du personnel a été mis à jour avec succès', type: Personnel })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Membre du personnel non trouvé' })
  update(@Param('id') id: string, @Body() updatePersonnelDto: UpdatePersonnelDto): Promise<Personnel> {
    return this.personnelService.update(+id, updatePersonnelDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Supprimer un membre du personnel' })
  @ApiParam({ name: 'id', description: 'ID du membre du personnel', type: 'number' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Le membre du personnel a été supprimé avec succès' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Membre du personnel non trouvé' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Accès refusé' })
  remove(@Param('id') id: string): Promise<void> {
    return this.personnelService.remove(+id);
  }
} 