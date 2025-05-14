"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GalleryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gallery_item_entity_1 = require("./entities/gallery-item.entity");
let GalleryService = GalleryService_1 = class GalleryService {
    galleryItemRepository;
    logger = new common_1.Logger(GalleryService_1.name);
    constructor(galleryItemRepository) {
        this.galleryItemRepository = galleryItemRepository;
    }
    async create(createGalleryItemDto) {
        this.logger.debug(`Creating gallery item: ${JSON.stringify(createGalleryItemDto)}`);
        const galleryItem = this.galleryItemRepository.create(createGalleryItemDto);
        return await this.galleryItemRepository.save(galleryItem);
    }
    async findAll() {
        this.logger.debug('Finding all gallery items');
        return await this.galleryItemRepository.find({
            order: {
                displayOrder: 'ASC',
                createdAt: 'DESC'
            }
        });
    }
    async findByCategory(category) {
        this.logger.debug(`Finding gallery items by category: ${category}`);
        return await this.galleryItemRepository.find({
            where: { category, isActive: true },
            order: {
                displayOrder: 'ASC',
                createdAt: 'DESC'
            }
        });
    }
    async findOne(id) {
        this.logger.debug(`Finding gallery item with id: ${id}`);
        const galleryItem = await this.galleryItemRepository.findOneBy({ id });
        if (!galleryItem) {
            throw new common_1.NotFoundException(`Gallery item with ID ${id} not found`);
        }
        return galleryItem;
    }
    async update(id, updateGalleryItemDto) {
        this.logger.debug(`Updating gallery item ${id} with: ${JSON.stringify(updateGalleryItemDto)}`);
        const galleryItem = await this.findOne(id);
        Object.assign(galleryItem, updateGalleryItemDto);
        return await this.galleryItemRepository.save(galleryItem);
    }
    async remove(id) {
        this.logger.debug(`Removing gallery item with id: ${id}`);
        const result = await this.galleryItemRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Gallery item with ID ${id} not found`);
        }
    }
    async getCategories() {
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
};
exports.GalleryService = GalleryService;
exports.GalleryService = GalleryService = GalleryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gallery_item_entity_1.GalleryItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GalleryService);
//# sourceMappingURL=gallery.service.js.map