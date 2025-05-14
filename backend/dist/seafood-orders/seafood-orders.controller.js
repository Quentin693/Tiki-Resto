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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeafoodOrdersController = void 0;
const common_1 = require("@nestjs/common");
const seafood_orders_service_1 = require("./seafood-orders.service");
const create_seafood_order_dto_1 = require("./dto/create-seafood-order.dto");
const update_seafood_order_dto_1 = require("./dto/update-seafood-order.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SeafoodOrdersController = class SeafoodOrdersController {
    seafoodOrdersService;
    constructor(seafoodOrdersService) {
        this.seafoodOrdersService = seafoodOrdersService;
    }
    create(createOrderDto) {
        return this.seafoodOrdersService.create(createOrderDto);
    }
    findAll() {
        return this.seafoodOrdersService.findAll();
    }
    findByUser(userId) {
        return this.seafoodOrdersService.findByUser(userId);
    }
    search(email, phone) {
        return this.seafoodOrdersService.search(email, phone);
    }
    findOne(id) {
        return this.seafoodOrdersService.findOne(id);
    }
    update(id, updateOrderDto) {
        return this.seafoodOrdersService.update(id, updateOrderDto);
    }
    remove(id) {
        return this.seafoodOrdersService.remove(id);
    }
    getStats(startDate = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), endDate = new Date().toISOString()) {
        return this.seafoodOrdersService.getOrderStats(new Date(startDate), new Date(endDate));
    }
};
exports.SeafoodOrdersController = SeafoodOrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle commande de fruits de mer' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'La commande a été créée avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données de commande invalides' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_seafood_order_dto_1.CreateSeafoodOrderDto]),
    __metadata("design:returntype", void 0)
], SeafoodOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les commandes de fruits de mer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retourne la liste des commandes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SeafoodOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les commandes d\'un utilisateur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retourne les commandes de l\'utilisateur' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SeafoodOrdersController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Rechercher des commandes par email ou téléphone' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retourne les commandes correspondantes' }),
    (0, swagger_1.ApiQuery)({ name: 'email', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'phone', required: false, type: String }),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Query)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SeafoodOrdersController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une commande par son ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retourne la commande demandée' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Commande non trouvée' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SeafoodOrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour le statut d\'une commande' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'La commande a été mise à jour' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Commande non trouvée' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_seafood_order_dto_1.UpdateSeafoodOrderDto]),
    __metadata("design:returntype", void 0)
], SeafoodOrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une commande' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'La commande a été supprimée' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Commande non trouvée' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SeafoodOrdersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('stats/orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir des statistiques sur les commandes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retourne les statistiques des commandes' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SeafoodOrdersController.prototype, "getStats", null);
exports.SeafoodOrdersController = SeafoodOrdersController = __decorate([
    (0, swagger_1.ApiTags)('Commandes de fruits de mer'),
    (0, common_1.Controller)('seafood-orders'),
    __metadata("design:paramtypes", [seafood_orders_service_1.SeafoodOrdersService])
], SeafoodOrdersController);
//# sourceMappingURL=seafood-orders.controller.js.map