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
exports.WinesController = void 0;
const common_1 = require("@nestjs/common");
const wines_service_1 = require("./wines.service");
const create_wine_dto_1 = require("./dto/create-wine.dto");
const update_wine_dto_1 = require("./dto/update-wine.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../users/enums/role.enum");
const swagger_1 = require("@nestjs/swagger");
const wine_entity_1 = require("./entities/wine.entity");
let WinesController = class WinesController {
    winesService;
    constructor(winesService) {
        this.winesService = winesService;
    }
    create(createWineDto) {
        return this.winesService.create(createWineDto);
    }
    findAll() {
        return this.winesService.findAll();
    }
    findOne(id) {
        return this.winesService.findOne(+id);
    }
    update(id, updateWineDto) {
        return this.winesService.update(+id, updateWineDto);
    }
    remove(id) {
        return this.winesService.remove(+id);
    }
};
exports.WinesController = WinesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouveau vin' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Le vin a été créé avec succès.', type: wine_entity_1.Wine }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Interdit - Droits insuffisants.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_wine_dto_1.CreateWineDto]),
    __metadata("design:returntype", void 0)
], WinesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les vins (groupés par catégorie)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste de tous les vins groupés par catégorie.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WinesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un vin par son ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Détails du vin.', type: wine_entity_1.Wine }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Vin non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WinesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un vin' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Le vin a été mis à jour avec succès.', type: wine_entity_1.Wine }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Interdit - Droits insuffisants.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Vin non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_wine_dto_1.UpdateWineDto]),
    __metadata("design:returntype", void 0)
], WinesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un vin' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Le vin a été supprimé avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Interdit - Droits insuffisants.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Vin non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WinesController.prototype, "remove", null);
exports.WinesController = WinesController = __decorate([
    (0, swagger_1.ApiTags)('wines'),
    (0, common_1.Controller)('wines'),
    __metadata("design:paramtypes", [wines_service_1.WinesService])
], WinesController);
//# sourceMappingURL=wines.controller.js.map