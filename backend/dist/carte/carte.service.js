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
var CarteService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const carte_item_entity_1 = require("./entities/carte-item.entity");
let CarteService = CarteService_1 = class CarteService {
    carteItemRepository;
    logger = new common_1.Logger(CarteService_1.name);
    constructor(carteItemRepository) {
        this.carteItemRepository = carteItemRepository;
    }
    async create(createCarteItemDto) {
        this.logger.debug(`Début de la création du plat avec les données : ${JSON.stringify(createCarteItemDto)}`);
        try {
            this.logger.debug('Vérification des données reçues...');
            if (!createCarteItemDto.name || !createCarteItemDto.description || !createCarteItemDto.price || !createCarteItemDto.category) {
                throw new Error('Données manquantes');
            }
            this.logger.debug('Création de l\'entité CarteItem...');
            const carteItem = this.carteItemRepository.create({
                name: createCarteItemDto.name,
                description: createCarteItemDto.description,
                price: createCarteItemDto.price,
                imagePath: createCarteItemDto.imagePath,
                category: createCarteItemDto.category,
            });
            this.logger.debug(`Entité créée : ${JSON.stringify(carteItem)}`);
            this.logger.debug('Tentative de sauvegarde dans la base de données...');
            const savedItem = await this.carteItemRepository.save(carteItem);
            this.logger.debug(`Plat sauvegardé avec succès : ${JSON.stringify(savedItem)}`);
            return savedItem;
        }
        catch (error) {
            this.logger.error(`Erreur lors de la création du plat : ${error.message}`);
            this.logger.error(`Stack trace : ${error.stack}`);
            throw error;
        }
    }
    async findAll() {
        try {
            const items = await this.carteItemRepository.find();
            const groupedItems = items.reduce((acc, item) => {
                if (!acc[item.category]) {
                    acc[item.category] = [];
                }
                acc[item.category].push(item);
                return acc;
            }, {});
            return groupedItems;
        }
        catch (error) {
            this.logger.error(`Error finding all carte items: ${error.message}`);
            throw error;
        }
    }
    async findByCategory(category) {
        try {
            return await this.carteItemRepository.find({
                where: { category },
            });
        }
        catch (error) {
            this.logger.error(`Error finding carte items by category: ${error.message}`);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const carteItem = await this.carteItemRepository.findOne({
                where: { id },
            });
            if (!carteItem) {
                throw new common_1.NotFoundException(`Carte item #${id} not found`);
            }
            return carteItem;
        }
        catch (error) {
            this.logger.error(`Error finding carte item #${id}: ${error.message}`);
            throw error;
        }
    }
    async update(id, updateCarteItemDto) {
        try {
            const carteItem = await this.findOne(id);
            Object.assign(carteItem, updateCarteItemDto);
            return await this.carteItemRepository.save(carteItem);
        }
        catch (error) {
            this.logger.error(`Error updating carte item #${id}: ${error.message}`);
            throw error;
        }
    }
    async remove(id) {
        try {
            const carteItem = await this.findOne(id);
            return await this.carteItemRepository.remove(carteItem);
        }
        catch (error) {
            this.logger.error(`Error removing carte item #${id}: ${error.message}`);
            throw error;
        }
    }
};
exports.CarteService = CarteService;
exports.CarteService = CarteService = CarteService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(carte_item_entity_1.CarteItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CarteService);
//# sourceMappingURL=carte.service.js.map