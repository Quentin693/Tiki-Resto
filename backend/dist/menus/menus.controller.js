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
exports.MenusController = void 0;
const common_1 = require("@nestjs/common");
const menus_service_1 = require("./menus.service");
const create_menu_dto_1 = require("./dto/create-menu.dto");
const update_menu_dto_1 = require("./dto/update-menu.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../users/enums/role.enum");
const swagger_1 = require("@nestjs/swagger");
const menu_entity_1 = require("./entities/menu.entity");
let MenusController = class MenusController {
    menusService;
    constructor(menusService) {
        this.menusService = menusService;
    }
    create(createMenuDto) {
        return this.menusService.create(createMenuDto);
    }
    findAll() {
        return this.menusService.findAll();
    }
    findOne(id) {
        return this.menusService.findOne(+id);
    }
    update(id, updateMenuDto) {
        return this.menusService.update(+id, updateMenuDto);
    }
    remove(id) {
        return this.menusService.remove(+id);
    }
};
exports.MenusController = MenusController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouveau menu' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Le menu a été créé avec succès.', type: menu_entity_1.Menu }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Interdit - Droits insuffisants.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_menu_dto_1.CreateMenuDto]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les menus' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste de tous les menus.', type: [menu_entity_1.Menu] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un menu par son ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Détails du menu.', type: menu_entity_1.Menu }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Menu non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un menu' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Le menu a été mis à jour avec succès.', type: menu_entity_1.Menu }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Interdit - Droits insuffisants.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Menu non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_menu_dto_1.UpdateMenuDto]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un menu' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Le menu a été supprimé avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Interdit - Droits insuffisants.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Menu non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "remove", null);
exports.MenusController = MenusController = __decorate([
    (0, swagger_1.ApiTags)('menus'),
    (0, common_1.Controller)('menus'),
    __metadata("design:paramtypes", [menus_service_1.MenusService])
], MenusController);
//# sourceMappingURL=menus.controller.js.map