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
exports.CreateGalleryItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateGalleryItemDto {
    title;
    description;
    imagePath;
    category;
    displayOrder;
    isActive;
}
exports.CreateGalleryItemDto = CreateGalleryItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Titre de l\'image',
        example: 'Vue extérieure du restaurant'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGalleryItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description de l\'image',
        example: 'Notre terrasse vue de l\'extérieur pendant l\'été',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGalleryItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Chemin de l\'image',
        example: '/images/restaurant-terrasse.jpg'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGalleryItemDto.prototype, "imagePath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Catégorie de l\'image',
        example: 'restaurant',
        enum: ['restaurant', 'dishes', 'events', 'ambiance', 'staff', 'other']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['restaurant', 'dishes', 'events', 'ambiance', 'staff', 'other']),
    __metadata("design:type", String)
], CreateGalleryItemDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ordre d\'affichage de l\'image (optionnel)',
        example: 1,
        required: false
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateGalleryItemDto.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indique si l\'image est active',
        example: true,
        required: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateGalleryItemDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-gallery-item.dto.js.map