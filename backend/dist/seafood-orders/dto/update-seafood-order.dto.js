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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSeafoodOrderDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const seafood_order_entity_1 = require("../entities/seafood-order.entity");
class UpdateSeafoodOrderDto {
    status;
    comment;
    pickupDate;
    pickupTime;
    isPickup;
    specialRequests;
}
exports.UpdateSeafoodOrderDto = UpdateSeafoodOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: seafood_order_entity_1.OrderStatus,
        description: 'Statut de la commande'
    }),
    (0, class_validator_1.IsEnum)(seafood_order_entity_1.OrderStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSeafoodOrderDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Commentaire sur la commande' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSeafoodOrderDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de récupération (YYYY-MM-DD)' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSeafoodOrderDto.prototype, "pickupDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Heure de récupération (HH:MM)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSeafoodOrderDto.prototype, "pickupTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'À emporter (true) ou sur place (false)' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateSeafoodOrderDto.prototype, "isPickup", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Demandes spéciales (optionnel)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSeafoodOrderDto.prototype, "specialRequests", void 0);
//# sourceMappingURL=update-seafood-order.dto.js.map