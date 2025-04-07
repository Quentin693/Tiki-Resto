import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryItem } from './entities/gallery-item.entity';
import { CreateGalleryItemDto } from './dto/create-gallery-item.dto';
import { UpdateGalleryItemDto } from './dto/update-gallery-item.dto';

@Injectable()
export class GalleryService {
  private readonly logger = new Logger(GalleryService.name);

  constructor(
    @InjectRepository(GalleryItem)
    private galleryItemRepository: Repository<GalleryItem>,
  ) {}

  async create(createGalleryItemDto: CreateGalleryItemDto): Promise<GalleryItem> {
    this.logger.debug(`Creating gallery item: ${JSON.stringify(createGalleryItemDto)}`);
    const galleryItem = this.galleryItemRepository.create(createGalleryItemDto);
    return await this.galleryItemRepository.save(galleryItem);
  }

  async findAll(): Promise<GalleryItem[]> {
    this.logger.debug('Finding all gallery items');
    return await this.galleryItemRepository.find({
      order: {
        displayOrder: 'ASC',
        createdAt: 'DESC'
      }
    });
  }

  async findByCategory(category: string): Promise<GalleryItem[]> {
    this.logger.debug(`Finding gallery items by category: ${category}`);
    return await this.galleryItemRepository.find({
      where: { category, isActive: true },
      order: {
        displayOrder: 'ASC',
        createdAt: 'DESC'
      }
    });
  }

  async findOne(id: number): Promise<GalleryItem> {
    this.logger.debug(`Finding gallery item with id: ${id}`);
    const galleryItem = await this.galleryItemRepository.findOneBy({ id });
    if (!galleryItem) {
      throw new NotFoundException(`Gallery item with ID ${id} not found`);
    }
    return galleryItem;
  }

  async update(id: number, updateGalleryItemDto: UpdateGalleryItemDto): Promise<GalleryItem> {
    this.logger.debug(`Updating gallery item ${id} with: ${JSON.stringify(updateGalleryItemDto)}`);
    const galleryItem = await this.findOne(id);
    Object.assign(galleryItem, updateGalleryItemDto);
    return await this.galleryItemRepository.save(galleryItem);
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Removing gallery item with id: ${id}`);
    const result = await this.galleryItemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Gallery item with ID ${id} not found`);
    }
  }

  async getCategories(): Promise<{ id: string, name: string }[]> {
    // Retourner les catégories prédéfinies
    return [
      { id: 'all', name: 'Tout' },
      { id: 'restaurant', name: 'Restaurant' },
      { id: 'dishes', name: 'Plats' },
      { id: 'events', name: 'Événements' },
      { id: 'ambiance', name: 'Ambiance' },
      { id: 'staff', name: 'Équipe' },
      { id: 'other', name: 'Autres' }
    ];
  }
} 