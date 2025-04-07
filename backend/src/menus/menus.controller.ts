import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Menu } from './entities/menu.entity';

@ApiTags('menus')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouveau menu' })
  @ApiResponse({ status: 201, description: 'Le menu a été créé avec succès.', type: Menu })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Interdit - Droits insuffisants.' })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les menus' })
  @ApiResponse({ status: 200, description: 'Liste de tous les menus.', type: [Menu] })
  findAll() {
    return this.menusService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un menu par son ID' })
  @ApiResponse({ status: 200, description: 'Détails du menu.', type: Menu })
  @ApiResponse({ status: 404, description: 'Menu non trouvé.' })
  findOne(@Param('id') id: string) {
    return this.menusService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un menu' })
  @ApiResponse({ status: 200, description: 'Le menu a été mis à jour avec succès.', type: Menu })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Interdit - Droits insuffisants.' })
  @ApiResponse({ status: 404, description: 'Menu non trouvé.' })
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un menu' })
  @ApiResponse({ status: 200, description: 'Le menu a été supprimé avec succès.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @ApiResponse({ status: 403, description: 'Interdit - Droits insuffisants.' })
  @ApiResponse({ status: 404, description: 'Menu non trouvé.' })
  remove(@Param('id') id: string) {
    return this.menusService.remove(+id);
  }
} 