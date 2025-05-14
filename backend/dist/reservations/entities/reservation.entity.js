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
exports.Reservation = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Reservation = class Reservation {
    id;
    customerName;
    customerEmail;
    customerPhone;
    numberOfGuests;
    reservationDateTime;
    specialRequests;
    created_at;
    updated_at;
    userId;
    isEvent;
    tableNumber;
    isArrived;
};
exports.Reservation = Reservation;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Identifiant unique de la réservation' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Reservation.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe', description: 'Nom du client' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reservation.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john@example.com', description: 'Email du client' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reservation.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '0601020304', description: 'Numéro de téléphone du client' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reservation.prototype, "customerPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4, description: 'Nombre de convives' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Reservation.prototype, "numberOfGuests", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-04-01T19:30:00Z', description: 'Date et heure de la réservation' }),
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Reservation.prototype, "reservationDateTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Allergies aux fruits de mer', description: 'Demandes spéciales', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "specialRequests", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-03-25T10:30:00Z', description: 'Date de création de la réservation' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Reservation.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-03-25T10:30:00Z', description: 'Date de dernière mise à jour de la réservation' }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Reservation.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID de l\'utilisateur', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Reservation.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indique si c\'est un événement (permet >20 personnes)', example: false, required: false }),
    (0, typeorm_1.Column)({ default: false, nullable: true }),
    __metadata("design:type", Boolean)
], Reservation.prototype, "isEvent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Numéro de table attribué à la réservation', example: 5, required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Reservation.prototype, "tableNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indique si le client est arrivé au restaurant', example: false, required: false }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Reservation.prototype, "isArrived", void 0);
exports.Reservation = Reservation = __decorate([
    (0, typeorm_1.Entity)()
], Reservation);
//# sourceMappingURL=reservation.entity.js.map