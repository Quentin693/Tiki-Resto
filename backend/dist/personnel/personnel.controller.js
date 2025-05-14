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
exports.PersonnelController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const personnel_service_1 = require("./personnel.service");
const create_personnel_dto_1 = require("./dto/create-personnel.dto");
const update_personnel_dto_1 = require("./dto/update-personnel.dto");
const personnel_entity_1 = require("./entities/personnel.entity");
let PersonnelController = class PersonnelController {
    personnelService;
    constructor(personnelService) {
        this.personnelService = personnelService;
    }
    create(createPersonnelDto) {
        return this.personnelService.create(createPersonnelDto);
    }
    findAll(service) {
        if (service) {
            return this.personnelService.findByService(service);
        }
        return this.personnelService.findAll();
    }
    findOne(id) {
        return this.personnelService.findOne(+id);
    }
    update(id, updatePersonnelDto) {
        return this.personnelService.update(+id, updatePersonnelDto);
    }
    remove(id) {
        return this.personnelService.remove(+id);
    }
};
exports.PersonnelController = PersonnelController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouveau membre du personnel' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Le membre du personnel a été créé avec succès.', type: personnel_entity_1.Personnel }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Données invalides' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_personnel_dto_1.CreatePersonnelDto]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les membres du personnel ou filtrer par service' }),
    (0, swagger_1.ApiQuery)({ name: 'service', required: false, enum: ['salle', 'cuisine'] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Liste des membres du personnel', type: [personnel_entity_1.Personnel] }),
    __param(0, (0, common_1.Query)('service')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un membre du personnel par son ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du membre du personnel', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Le membre du personnel a été trouvé', type: personnel_entity_1.Personnel }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Membre du personnel non trouvé' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un membre du personnel' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du membre du personnel', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Le membre du personnel a été mis à jour avec succès', type: personnel_entity_1.Personnel }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Membre du personnel non trouvé' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_personnel_dto_1.UpdatePersonnelDto]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un membre du personnel' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID du membre du personnel', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NO_CONTENT, description: 'Le membre du personnel a été supprimé avec succès' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Membre du personnel non trouvé' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FORBIDDEN, description: 'Accès refusé' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PersonnelController.prototype, "remove", null);
exports.PersonnelController = PersonnelController = __decorate([
    (0, swagger_1.ApiTags)('personnel'),
    (0, common_1.Controller)('personnel'),
    __metadata("design:paramtypes", [personnel_service_1.PersonnelService])
], PersonnelController);
//# sourceMappingURL=personnel.controller.js.map