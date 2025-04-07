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
  HttpStatus
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryItemDto } from './dto/create-gallery-item.dto';
import { UpdateGalleryItemDto } from './dto/update-gallery-item.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

@ApiTags('gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouvel élément de galerie' })
  @ApiResponse({ status: 201, description: 'L\'élément a été créé avec succès.' })
  async create(@Body() createGalleryItemDto: CreateGalleryItemDto) {
    try {
      return await this.galleryService.create(createGalleryItemDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Erreur lors de la création de l\'élément de galerie',
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les éléments de galerie' })
  @ApiResponse({ status: 200, description: 'Renvoie tous les éléments de galerie.' })
  async findAll() {
    try {
      return await this.galleryService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erreur lors de la récupération des éléments de galerie',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('categories')
  @ApiOperation({ summary: 'Récupérer toutes les catégories de galerie' })
  @ApiResponse({ status: 200, description: 'Renvoie toutes les catégories de galerie.' })
  async getCategories() {
    try {
      return await this.galleryService.getCategories();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erreur lors de la récupération des catégories',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Récupérer les éléments de galerie par catégorie' })
  @ApiResponse({ status: 200, description: 'Renvoie les éléments pour une catégorie spécifique.' })
  async findByCategory(@Param('category') category: string) {
    try {
      return await this.galleryService.findByCategory(category);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erreur lors de la récupération des éléments par catégorie',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un élément de galerie par son id' })
  @ApiResponse({ status: 200, description: 'Renvoie l\'élément.' })
  @ApiResponse({ status: 404, description: 'Élément non trouvé.' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.galleryService.findOne(+id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Élément de galerie non trouvé',
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
  @ApiOperation({ summary: 'Mettre à jour un élément de galerie' })
  @ApiResponse({ status: 200, description: 'L\'élément a été mis à jour avec succès.' })
  async update(@Param('id') id: string, @Body() updateGalleryItemDto: UpdateGalleryItemDto) {
    try {
      return await this.galleryService.update(+id, updateGalleryItemDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Erreur lors de la mise à jour de l\'élément de galerie',
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
  @ApiOperation({ summary: 'Supprimer un élément de galerie' })
  @ApiResponse({ status: 200, description: 'L\'élément a été supprimé avec succès.' })
  async remove(@Param('id') id: string) {
    try {
      return await this.galleryService.remove(+id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Erreur lors de la suppression de l\'élément de galerie',
          message: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
} 