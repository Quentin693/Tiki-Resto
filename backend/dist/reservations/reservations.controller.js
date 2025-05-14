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
var ReservationsController_1, AdminReservationsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminReservationsController = exports.ReservationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reservations_service_1 = require("./reservations.service");
const create_reservation_dto_1 = require("./dto/create-reservation.dto");
const update_reservation_dto_1 = require("./dto/update-reservation.dto");
const admin_update_reservation_dto_1 = require("./dto/admin-update-reservation.dto");
const reservation_entity_1 = require("./entities/reservation.entity");
const time_slot_dto_1 = require("./dto/time-slot.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
let ReservationsController = ReservationsController_1 = class ReservationsController {
    reservationsService;
    logger = new common_1.Logger(ReservationsController_1.name);
    constructor(reservationsService) {
        this.reservationsService = reservationsService;
    }
    create(createReservationDto) {
        return this.reservationsService.create(createReservationDto);
    }
    findAll() {
        return this.reservationsService.findAll();
    }
    async findMyReservations(req) {
        try {
            this.logger.log(`Contrôleur - Récupération des réservations pour l'utilisateur connecté ID: ${req.user.id}`);
            if (!req.user || !req.user.id) {
                this.logger.error('Contrôleur - Erreur: User ID non disponible dans la requête');
                return [];
            }
            const reservations = await this.reservationsService.findByUserId(req.user.id);
            this.logger.log(`Contrôleur - ${reservations.length} réservations trouvées pour l'utilisateur ${req.user.id}`);
            return reservations;
        }
        catch (error) {
            this.logger.error(`Contrôleur - Erreur lors de la récupération des réservations: ${error.message}`);
            throw error;
        }
    }
    async findByUserId(id) {
        this.logger.log(`Contrôleur - Recherche des réservations pour l'utilisateur ID: ${id}`);
        try {
            const reservations = await this.reservationsService.findByUserId(+id);
            this.logger.log(`Contrôleur - ${reservations.length} réservations trouvées pour l'utilisateur ${id}`);
            return reservations;
        }
        catch (error) {
            this.logger.error(`Contrôleur - Erreur lors de la récupération des réservations pour l'utilisateur ${id}: ${error.message}`);
            throw error;
        }
    }
    getAvailableTimeSlots(date) {
        return this.reservationsService.getAvailableTimeSlots(date);
    }
    findOne(id) {
        return this.reservationsService.findOne(+id);
    }
    update(id, updateReservationDto) {
        return this.reservationsService.update(+id, updateReservationDto);
    }
    remove(id) {
        return this.reservationsService.remove(+id);
    }
    async findByContact(email, phone) {
        this.logger.log(`Contrôleur - Recherche des réservations par contact: Email=${email}, Téléphone=${phone}`);
        if (!email && !phone) {
            this.logger.warn('Contrôleur - Aucun paramètre de recherche fourni (email ou téléphone)');
            return [];
        }
        try {
            return this.reservationsService.findByContact(email, phone);
        }
        catch (error) {
            this.logger.error(`Contrôleur - Erreur lors de la recherche des réservations par contact: ${error.message}`);
            throw error;
        }
    }
};
exports.ReservationsController = ReservationsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle réservation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'La réservation a été créée avec succès.', type: reservation_entity_1.Reservation }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Créneau indisponible ou capacité dépassée.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reservation_dto_1.CreateReservationDto]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les réservations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste de toutes les réservations.', type: [reservation_entity_1.Reservation] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les réservations de l\'utilisateur connecté' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des réservations de l\'utilisateur connecté.', type: [reservation_entity_1.Reservation] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé - Token invalide ou manquant.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "findMyReservations", null);
__decorate([
    (0, common_1.Get)('user/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les réservations d\'un utilisateur par son ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des réservations de l\'utilisateur.', type: [reservation_entity_1.Reservation] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Aucune réservation trouvée pour cet utilisateur.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)('available-slots'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les créneaux disponibles pour une date donnée' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: true, type: String, description: 'Date au format YYYY-MM-DD' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des créneaux disponibles.', type: time_slot_dto_1.TimeSlotsResponseDto }),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "getAvailableTimeSlots", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une réservation par son ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Détails de la réservation.', type: reservation_entity_1.Reservation }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Réservation non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une réservation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'La réservation a été mise à jour avec succès.', type: reservation_entity_1.Reservation }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Réservation non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reservation_dto_1.UpdateReservationDto]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une réservation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'La réservation a été supprimée avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Réservation non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Rechercher des réservations par email ou téléphone' }),
    (0, swagger_1.ApiQuery)({ name: 'email', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'phone', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des réservations correspondantes', type: [reservation_entity_1.Reservation] }),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Query)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "findByContact", null);
exports.ReservationsController = ReservationsController = ReservationsController_1 = __decorate([
    (0, swagger_1.ApiTags)('reservations'),
    (0, common_1.Controller)('reservations'),
    __metadata("design:paramtypes", [reservations_service_1.ReservationsService])
], ReservationsController);
let AdminReservationsController = AdminReservationsController_1 = class AdminReservationsController {
    reservationsService;
    logger = new common_1.Logger(AdminReservationsController_1.name);
    constructor(reservationsService) {
        this.reservationsService = reservationsService;
    }
    adminUpdate(id, adminUpdateReservationDto) {
        return this.reservationsService.adminUpdate(+id, adminUpdateReservationDto);
    }
};
exports.AdminReservationsController = AdminReservationsController;
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour les champs administratifs d\'une réservation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'La réservation a été mise à jour avec succès.', type: reservation_entity_1.Reservation }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès interdit - Nécessite les droits administrateur.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Réservation non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_update_reservation_dto_1.AdminUpdateReservationDto]),
    __metadata("design:returntype", void 0)
], AdminReservationsController.prototype, "adminUpdate", null);
exports.AdminReservationsController = AdminReservationsController = AdminReservationsController_1 = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('admin/reservations'),
    __metadata("design:paramtypes", [reservations_service_1.ReservationsService])
], AdminReservationsController);
//# sourceMappingURL=reservations.controller.js.map