import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WinesService } from './wines.service';
import { CreateWineDto } from './dto/create-wine.dto';
import { UpdateWineDto } from './dto/update-wine.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Wine } from './entities/wine.entity';

@ApiTags('wines')
@Controller('wines')
export class WinesController {
  constructor(private readonly winesService: WinesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouveau vin' })
  @ApiResponse({ status: 201, description: 'Le vin a été créé avec succès.', type: Wine })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Interdit - Droits insuffisants.' })
  create(@Body() createWineDto: CreateWineDto) {
    return this.winesService.create(createWineDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les vins (groupés par catégorie)' })
  @ApiResponse({ status: 200, description: 'Liste de tous les vins groupés par catégorie.' })
  findAll() {
    return this.winesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un vin par son ID' })
  @ApiResponse({ status: 200, description: 'Détails du vin.', type: Wine })
  @ApiResponse({ status: 404, description: 'Vin non trouvé.' })
  findOne(@Param('id') id: string) {
    return this.winesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un vin' })
  @ApiResponse({ status: 200, description: 'Le vin a été mis à jour avec succès.', type: Wine })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Interdit - Droits insuffisants.' })
  @ApiResponse({ status: 404, description: 'Vin non trouvé.' })
  update(@Param('id') id: string, @Body() updateWineDto: UpdateWineDto) {
    return this.winesService.update(+id, updateWineDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un vin' })
  @ApiResponse({ status: 200, description: 'Le vin a été supprimé avec succès.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Interdit - Droits insuffisants.' })
  @ApiResponse({ status: 404, description: 'Vin non trouvé.' })
  remove(@Param('id') id: string) {
    return this.winesService.remove(+id);
  }
} 