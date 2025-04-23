import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { SeafoodOrdersService } from './seafood-orders.service';
import { CreateSeafoodOrderDto } from './dto/create-seafood-order.dto';
import { UpdateSeafoodOrderDto } from './dto/update-seafood-order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Commandes de fruits de mer')
@Controller('seafood-orders')
export class SeafoodOrdersController {
  constructor(private readonly seafoodOrdersService: SeafoodOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle commande de fruits de mer' })
  @ApiResponse({ status: 201, description: 'La commande a été créée avec succès' })
  @ApiResponse({ status: 400, description: 'Données de commande invalides' })
  create(@Body() createOrderDto: CreateSeafoodOrderDto) {
    return this.seafoodOrdersService.create(createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer toutes les commandes de fruits de mer' })
  @ApiResponse({ status: 200, description: 'Retourne la liste des commandes' })
  findAll() {
    return this.seafoodOrdersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une commande par son ID' })
  @ApiResponse({ status: 200, description: 'Retourne la commande demandée' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.seafoodOrdersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour le statut d\'une commande' })
  @ApiResponse({ status: 200, description: 'La commande a été mise à jour' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateSeafoodOrderDto,
  ) {
    return this.seafoodOrdersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une commande' })
  @ApiResponse({ status: 200, description: 'La commande a été supprimée' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.seafoodOrdersService.remove(id);
  }

  @Get('stats/orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir des statistiques sur les commandes' })
  @ApiResponse({ status: 200, description: 'Retourne les statistiques des commandes' })
  getStats(
    @Query('startDate') startDate: string = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    @Query('endDate') endDate: string = new Date().toISOString(),
  ) {
    return this.seafoodOrdersService.getOrderStats(new Date(startDate), new Date(endDate));
  }
} 