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
} from '@nestjs/common';
import { CarteService } from './carte.service';
import { CreateCarteItemDto } from './dto/create-carte-item.dto';
import { UpdateCarteItemDto } from './dto/update-carte-item.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { Logger } from '@nestjs/common';

@ApiTags('carte')
@Controller('carte')
export class CarteController {
  private readonly logger = new Logger(CarteController.name);

  constructor(private readonly carteService: CarteService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new carte item' })
  @ApiResponse({ status: 201, description: 'The carte item has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createCarteItemDto: CreateCarteItemDto) {
    try {
      this.logger.debug(`Received create request with data: ${JSON.stringify(createCarteItemDto)}`);
      
      // Validate data
      if (!createCarteItemDto.name || !createCarteItemDto.description || 
          createCarteItemDto.price === undefined || !createCarteItemDto.category) {
        const error = 'Missing required fields';
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

      // Validate price is a number
      if (typeof createCarteItemDto.price !== 'number') {
        const error = 'Price must be a number';
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

      // Validate category
      const validCategories = ['entrees', 'plats', 'desserts', 'boissons'];
      if (!validCategories.includes(createCarteItemDto.category)) {
        const error = `Invalid category. Must be one of: ${validCategories.join(', ')}`;
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

      const result = await this.carteService.create(createCarteItemDto);
      this.logger.debug(`Successfully created carte item with id: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error in create: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erreur lors de la création du plat',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all carte items grouped by category' })
  @ApiResponse({ status: 200, description: 'Return all carte items grouped by category.' })
  async findAll() {
    try {
      return await this.carteService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erreur lors de la récupération des plats',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get carte items by category' })
  @ApiResponse({ status: 200, description: 'Return carte items for a specific category.' })
  async findByCategory(@Param('category') category: string) {
    try {
      return await this.carteService.findByCategory(category);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erreur lors de la récupération des plats par catégorie',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a carte item by id' })
  @ApiResponse({ status: 200, description: 'Return the carte item.' })
  @ApiResponse({ status: 404, description: 'Carte item not found.' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.carteService.findOne(+id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Plat non trouvé',
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
  @ApiOperation({ summary: 'Update a carte item' })
  @ApiResponse({ status: 200, description: 'The carte item has been successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Carte item not found.' })
  async update(@Param('id') id: string, @Body() updateCarteItemDto: UpdateCarteItemDto) {
    try {
      return await this.carteService.update(+id, updateCarteItemDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Erreur lors de la mise à jour du plat',
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a carte item' })
  @ApiResponse({ status: 200, description: 'The carte item has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Carte item not found.' })
  async remove(@Param('id') id: string) {
    try {
      return await this.carteService.remove(+id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Erreur lors de la suppression du plat',
          message: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
