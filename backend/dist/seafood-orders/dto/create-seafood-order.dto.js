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
exports.CreateSeafoodOrderDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CustomerDto {
    name;
    phone;
    email;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom du client' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Numéro de téléphone du client' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email du client (optionnel)' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "email", void 0);
class PickupInfoDto {
    date;
    time;
    isPickup;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de récupération (YYYY-MM-DD)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PickupInfoDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Heure de récupération (HH:MM)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PickupInfoDto.prototype, "time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'À emporter (true) ou sur place (false)' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PickupInfoDto.prototype, "isPickup", void 0);
class OrderItemDto {
    id;
    name;
    quantity;
    price;
    half;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID du produit' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom du produit' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantité commandée' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Prix unitaire' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Demi-douzaine pour les huîtres' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], OrderItemDto.prototype, "half", void 0);
class PlateauDto {
    id;
    name;
    quantity;
    price;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID du plateau' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlateauDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom du plateau' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlateauDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantité commandée' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PlateauDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Prix unitaire' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PlateauDto.prototype, "price", void 0);
class CreateSeafoodOrderDto {
    customer;
    pickupInfo;
    plateaux = [];
    items = [];
    specialRequests;
    totalPrice;
    userId;
}
exports.CreateSeafoodOrderDto = CreateSeafoodOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CustomerDto),
    __metadata("design:type", CustomerDto)
], CreateSeafoodOrderDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PickupInfoDto),
    __metadata("design:type", PickupInfoDto)
], CreateSeafoodOrderDto.prototype, "pickupInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PlateauDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PlateauDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateSeafoodOrderDto.prototype, "plateaux", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [OrderItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OrderItemDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateSeafoodOrderDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Demandes spéciales (optionnel)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSeafoodOrderDto.prototype, "specialRequests", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Prix total de la commande' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSeafoodOrderDto.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de l\'utilisateur (optionnel, pour les utilisateurs connectés)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSeafoodOrderDto.prototype, "userId", void 0);
//# sourceMappingURL=create-seafood-order.dto.js.map