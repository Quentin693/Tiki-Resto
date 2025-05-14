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
exports.CreateReservationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreateReservationDto {
    customerName;
    customerEmail;
    customerPhone;
    numberOfGuests;
    reservationDateTime;
    specialRequests;
    userId;
    createdAt;
    isEvent;
}
exports.CreateReservationDto = CreateReservationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe', description: 'Nom du client' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john@example.com', description: 'Email du client' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '06 XX XX XX XX', description: 'Numéro de téléphone du client (format: 06 XX XX XX XX)' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value.replace(/\s/g, '')),
    (0, class_validator_1.Matches)(/^(04|06|07)[0-9]{8}$/, {
        message: 'Le numéro de téléphone doit être un numéro français valide commençant par 04, 06 ou 07',
    }),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "customerPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4, description: 'Nombre de convives', minimum: 1, maximum: 20 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(20, {
        message: 'Le nombre de convives ne peut pas dépasser 20 personnes pour une réservation normale. Pour les événements, activez l\'option isEvent.'
    }),
    __metadata("design:type", Number)
], CreateReservationDto.prototype, "numberOfGuests", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-04-01T19:30:00Z', description: 'Date et heure de la réservation' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "reservationDateTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Allergies aux fruits de mer', description: 'Demandes spéciales', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "specialRequests", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID de l\'utilisateur', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateReservationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-04-01T19:30:00Z', description: 'Date et heure de la réservation' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'Indique si c\'est un événement (permet >20 personnes)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateReservationDto.prototype, "isEvent", void 0);
//# sourceMappingURL=create-reservation.dto.js.map