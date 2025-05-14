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
var EventsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("./entities/event.entity");
let EventsService = EventsService_1 = class EventsService {
    eventRepository;
    logger = new common_1.Logger(EventsService_1.name);
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }
    async create(createEventDto) {
        this.logger.debug(`Creating event: ${JSON.stringify(createEventDto)}`);
        const event = this.eventRepository.create(createEventDto);
        return await this.eventRepository.save(event);
    }
    async findAll() {
        this.logger.debug('Finding all events');
        return await this.eventRepository.find({
            order: {
                date: 'ASC',
                time: 'ASC'
            }
        });
    }
    async findByType(type) {
        this.logger.debug(`Finding events by type: ${type}`);
        return await this.eventRepository.find({
            where: { type },
            order: {
                date: 'ASC',
                time: 'ASC'
            }
        });
    }
    async findOne(id) {
        this.logger.debug(`Finding event with id: ${id}`);
        const event = await this.eventRepository.findOneBy({ id });
        if (!event) {
            throw new common_1.NotFoundException(`Événement avec l'ID ${id} non trouvé`);
        }
        return event;
    }
    async update(id, updateEventDto) {
        this.logger.debug(`Updating event ${id} with: ${JSON.stringify(updateEventDto)}`);
        const event = await this.findOne(id);
        Object.assign(event, updateEventDto);
        return await this.eventRepository.save(event);
    }
    async remove(id) {
        this.logger.debug(`Removing event with id: ${id}`);
        const result = await this.eventRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Événement avec l'ID ${id} non trouvé`);
        }
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = EventsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EventsService);
//# sourceMappingURL=events.service.js.map