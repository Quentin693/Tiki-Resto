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
var PersonnelService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonnelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const personnel_entity_1 = require("./entities/personnel.entity");
let PersonnelService = PersonnelService_1 = class PersonnelService {
    personnelRepository;
    logger = new common_1.Logger(PersonnelService_1.name);
    constructor(personnelRepository) {
        this.personnelRepository = personnelRepository;
    }
    async create(createPersonnelDto) {
        this.logger.debug(`Creating personnel: ${JSON.stringify(createPersonnelDto)}`);
        const personnel = this.personnelRepository.create(createPersonnelDto);
        return await this.personnelRepository.save(personnel);
    }
    async findAll() {
        this.logger.debug('Finding all personnel');
        return await this.personnelRepository.find({
            order: {
                service: 'ASC',
                lastName: 'ASC',
                firstName: 'ASC'
            }
        });
    }
    async findByService(service) {
        this.logger.debug(`Finding personnel by service: ${service}`);
        return await this.personnelRepository.find({
            where: { service },
            order: {
                lastName: 'ASC',
                firstName: 'ASC'
            }
        });
    }
    async findOne(id) {
        this.logger.debug(`Finding personnel with id: ${id}`);
        const personnel = await this.personnelRepository.findOneBy({ id });
        if (!personnel) {
            throw new common_1.NotFoundException(`Personnel avec l'ID ${id} non trouvé`);
        }
        return personnel;
    }
    async update(id, updatePersonnelDto) {
        this.logger.debug(`Updating personnel ${id} with: ${JSON.stringify(updatePersonnelDto)}`);
        const personnel = await this.findOne(id);
        Object.assign(personnel, updatePersonnelDto);
        return await this.personnelRepository.save(personnel);
    }
    async remove(id) {
        this.logger.debug(`Removing personnel with id: ${id}`);
        const result = await this.personnelRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Personnel avec l'ID ${id} non trouvé`);
        }
    }
};
exports.PersonnelService = PersonnelService;
exports.PersonnelService = PersonnelService = PersonnelService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(personnel_entity_1.Personnel)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PersonnelService);
//# sourceMappingURL=personnel.service.js.map