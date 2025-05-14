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
var CarteController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarteController = void 0;
const common_1 = require("@nestjs/common");
const carte_service_1 = require("./carte.service");
const create_carte_item_dto_1 = require("./dto/create-carte-item.dto");
const update_carte_item_dto_1 = require("./dto/update-carte-item.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const common_2 = require("@nestjs/common");
let CarteController = CarteController_1 = class CarteController {
    carteService;
    logger = new common_2.Logger(CarteController_1.name);
    constructor(carteService) {
        this.carteService = carteService;
    }
    async create(createCarteItemDto) {
        try {
            this.logger.debug(`Received create request with data: ${JSON.stringify(createCarteItemDto)}`);
            if (!createCarteItemDto.name || !createCarteItemDto.description ||
                createCarteItemDto.price === undefined || !createCarteItemDto.category) {
                const error = 'Missing required fields';
                this.logger.error(error);
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'Données invalides',
                    message: error,
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (typeof createCarteItemDto.price !== 'number') {
                const error = 'Price must be a number';
                this.logger.error(error);
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'Données invalides',
                    message: error,
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const validCategories = ['entrees', 'plats', 'desserts', 'boissons'];
            if (!validCategories.includes(createCarteItemDto.category)) {
                const error = `Invalid category. Must be one of: ${validCategories.join(', ')}`;
                this.logger.error(error);
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'Données invalides',
                    message: error,
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.carteService.create(createCarteItemDto);
            this.logger.debug(`Successfully created carte item with id: ${result.id}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error in create: ${error.message}`);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Erreur lors de la création du plat',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll() {
        try {
            return await this.carteService.findAll();
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Erreur lors de la récupération des plats',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByCategory(category) {
        try {
            return await this.carteService.findByCategory(category);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Erreur lors de la récupération des plats par catégorie',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            return await this.carteService.findOne(+id);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: 'Plat non trouvé',
                message: error.message,
            }, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async update(id, updateCarteItemDto) {
        try {
            return await this.carteService.update(+id, updateCarteItemDto);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: 'Erreur lors de la mise à jour du plat',
                message: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            return await this.carteService.remove(+id);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: 'Erreur lors de la suppression du plat',
                message: error.message,
            }, common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.CarteController = CarteController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new carte item' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The carte item has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_carte_item_dto_1.CreateCarteItemDto]),
    __metadata("design:returntype", Promise)
], CarteController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all carte items grouped by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all carte items grouped by category.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CarteController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get carte items by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return carte items for a specific category.' }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CarteController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a carte item by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the carte item.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Carte item not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CarteController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a carte item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The carte item has been successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Carte item not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_carte_item_dto_1.UpdateCarteItemDto]),
    __metadata("design:returntype", Promise)
], CarteController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a carte item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The carte item has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Carte item not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CarteController.prototype, "remove", null);
exports.CarteController = CarteController = CarteController_1 = __decorate([
    (0, swagger_1.ApiTags)('carte'),
    (0, common_1.Controller)('carte'),
    __metadata("design:paramtypes", [carte_service_1.CarteService])
], CarteController);
//# sourceMappingURL=carte.controller.js.map