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
var EventsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const create_event_dto_1 = require("./dto/create-event.dto");
const update_event_dto_1 = require("./dto/update-event.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../users/enums/role.enum");
let EventsController = EventsController_1 = class EventsController {
    eventsService;
    logger = new common_1.Logger(EventsController_1.name);
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    async create(createEventDto) {
        try {
            this.logger.debug(`Received create request with data: ${JSON.stringify(createEventDto)}`);
            const validTypes = ['brasero', 'tapas', 'afterwork', 'anniversaire', 'fête'];
            if (!validTypes.includes(createEventDto.type)) {
                const error = `Type d'événement invalide. Doit être l'un des: ${validTypes.join(', ')}`;
                this.logger.error(error);
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'Données invalides',
                    message: error,
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.eventsService.create(createEventDto);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Erreur lors de la création de l\'événement',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll() {
        try {
            return await this.eventsService.findAll();
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Erreur lors de la récupération des événements',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByType(type) {
        try {
            return await this.eventsService.findByType(type);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Erreur lors de la récupération des événements par type',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            return await this.eventsService.findOne(+id);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: 'Événement non trouvé',
                message: error.message,
            }, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async update(id, updateEventDto) {
        try {
            return await this.eventsService.update(+id, updateEventDto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: 'Erreur lors de la mise à jour de l\'événement',
                message: error.message,
            }, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async remove(id) {
        try {
            return await this.eventsService.remove(+id);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: 'Erreur lors de la suppression de l\'événement',
                message: error.message,
            }, common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouvel événement' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'L\'événement a été créé avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Requête invalide.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_dto_1.CreateEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les événements' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Renvoie tous les événements.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('type/:type'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les événements par type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Renvoie les événements pour un type spécifique.' }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findByType", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un événement par son id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Renvoie l\'événement.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Événement non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un événement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'L\'événement a été mis à jour avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Interdit.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Événement non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_event_dto_1.UpdateEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un événement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'L\'événement a été supprimé avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Interdit.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Événement non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "remove", null);
exports.EventsController = EventsController = EventsController_1 = __decorate([
    (0, swagger_1.ApiTags)('events'),
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsController);
//# sourceMappingURL=events.controller.js.map