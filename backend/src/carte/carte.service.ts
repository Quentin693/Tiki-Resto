import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarteItemDto } from './dto/create-carte-item.dto';
import { UpdateCarteItemDto } from './dto/update-carte-item.dto';
import { CarteItem } from './entities/carte-item.entity';

@Injectable()
export class CarteService {
  private readonly logger = new Logger(CarteService.name);

  constructor(
    @InjectRepository(CarteItem)
    private carteItemRepository: Repository<CarteItem>,
  ) {}

  async create(createCarteItemDto: CreateCarteItemDto) {
    this.logger.debug(`Début de la création du plat avec les données : ${JSON.stringify(createCarteItemDto)}`);
    
    try {
      // Vérification des données reçues
      this.logger.debug('Vérification des données reçues...');
      if (!createCarteItemDto.name || !createCarteItemDto.description || !createCarteItemDto.price || !createCarteItemDto.category) {
        throw new Error('Données manquantes');
      }

      // Création de l'entité
      this.logger.debug('Création de l\'entité CarteItem...');
      const carteItem = this.carteItemRepository.create({
        name: createCarteItemDto.name,
        description: createCarteItemDto.description,
        price: createCarteItemDto.price,
        imagePath: createCarteItemDto.imagePath,
        category: createCarteItemDto.category,
      });

      this.logger.debug(`Entité créée : ${JSON.stringify(carteItem)}`);

      // Sauvegarde dans la base de données
      this.logger.debug('Tentative de sauvegarde dans la base de données...');
      const savedItem = await this.carteItemRepository.save(carteItem);
      
      this.logger.debug(`Plat sauvegardé avec succès : ${JSON.stringify(savedItem)}`);
      return savedItem;
    } catch (error) {
      this.logger.error(`Erreur lors de la création du plat : ${error.message}`);
      this.logger.error(`Stack trace : ${error.stack}`);
      throw error;
    }
  }

  async findAll() {
    try {
      const items = await this.carteItemRepository.find();
      // Group items by category
      const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});
      return groupedItems;
    } catch (error) {
      this.logger.error(`Error finding all carte items: ${error.message}`);
      throw error;
    }
  }

  async findByCategory(category: string) {
    try {
      return await this.carteItemRepository.find({
        where: { category },
      });
    } catch (error) {
      this.logger.error(`Error finding carte items by category: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const carteItem = await this.carteItemRepository.findOne({
        where: { id },
      });
      if (!carteItem) {
        throw new NotFoundException(`Carte item #${id} not found`);
      }
      return carteItem;
    } catch (error) {
      this.logger.error(`Error finding carte item #${id}: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, updateCarteItemDto: UpdateCarteItemDto) {
    try {
      const carteItem = await this.findOne(id);
      Object.assign(carteItem, updateCarteItemDto);
      return await this.carteItemRepository.save(carteItem);
    } catch (error) {
      this.logger.error(`Error updating carte item #${id}: ${error.message}`);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const carteItem = await this.findOne(id);
      return await this.carteItemRepository.remove(carteItem);
    } catch (error) {
      this.logger.error(`Error removing carte item #${id}: ${error.message}`);
      throw error;
    }
  }
}
