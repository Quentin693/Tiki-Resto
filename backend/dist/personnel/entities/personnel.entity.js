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
exports.Personnel = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Personnel = class Personnel {
    id;
    firstName;
    lastName;
    service;
    role;
    description;
    speciality;
    experience;
    schedule;
    imagePath;
    createdAt;
    updatedAt;
};
exports.Personnel = Personnel;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identifiant unique du personnel',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Personnel.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prénom du membre du personnel',
        example: 'Greg'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Personnel.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom de famille du membre du personnel',
        example: 'Maire'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Personnel.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type de service',
        example: 'salle',
        enum: ['salle', 'cuisine']
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Personnel.prototype, "service", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Poste/rôle occupé',
        example: 'Vieux Loup'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Personnel.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description du membre du personnel',
        example: 'Fort de 20 ans d\'expérience dans la cuisine polynésienne, Michel dirige notre cuisine avec passion et créativité.'
    }),
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Personnel.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spécialité du membre du personnel',
        example: 'Poissons crus et marinades traditionnelles'
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Personnel.prototype, "speciality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Expérience du membre du personnel',
        example: '20 ans d\'expérience'
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Personnel.prototype, "experience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Horaires de travail du membre du personnel',
        example: 'Service du soir'
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Personnel.prototype, "schedule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Chemin de l\'image du membre du personnel',
        example: '/equipe/greg.jpg'
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Personnel.prototype, "imagePath", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Personnel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Personnel.prototype, "updatedAt", void 0);
exports.Personnel = Personnel = __decorate([
    (0, typeorm_1.Entity)('personnel')
], Personnel);
//# sourceMappingURL=personnel.entity.js.map