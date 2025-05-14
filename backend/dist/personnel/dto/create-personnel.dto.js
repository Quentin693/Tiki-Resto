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
exports.CreatePersonnelDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePersonnelDto {
    firstName;
    lastName;
    service;
    role;
    description;
    speciality;
    experience;
    schedule;
    imagePath;
}
exports.CreatePersonnelDto = CreatePersonnelDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prénom du membre du personnel',
        example: 'Greg'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonnelDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom de famille du membre du personnel',
        example: 'Maire'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonnelDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type de service',
        example: 'salle',
        enum: ['salle', 'cuisine']
    }),
    (0, class_validator_1.IsEnum)(['salle', 'cuisine']),
    __metadata("design:type", String)
], CreatePersonnelDto.prototype, "service", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Poste/rôle occupé',
        example: 'Vieux Loup'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePersonnelDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description du membre du personnel',
        example: 'Fort de 20 ans d\'expérience dans la cuisine polynésienne, Michel dirige notre cuisine avec passion et créativité.',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonnelDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spécialité du membre du personnel',
        example: 'Poissons crus et marinades traditionnelles',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonnelDto.prototype, "speciality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Expérience du membre du personnel',
        example: '20 ans d\'expérience',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonnelDto.prototype, "experience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Horaires de travail du membre du personnel',
        example: 'Service du soir',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonnelDto.prototype, "schedule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Chemin de l\'image du membre du personnel',
        example: '/equipe/greg.jpg'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonnelDto.prototype, "imagePath", void 0);
//# sourceMappingURL=create-personnel.dto.js.map