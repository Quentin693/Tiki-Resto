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
exports.GalleryItem = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let GalleryItem = class GalleryItem {
    id;
    title;
    description;
    imagePath;
    category;
    displayOrder;
    isActive;
    createdAt;
    updatedAt;
};
exports.GalleryItem = GalleryItem;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identifiant unique de l\'image',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GalleryItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Titre de l\'image',
        example: 'Vue extérieure du restaurant'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GalleryItem.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description de l\'image',
        example: 'Notre terrasse vue de l\'extérieur pendant l\'été'
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GalleryItem.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Chemin de l\'image',
        example: '/images/restaurant-terrasse.jpg'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GalleryItem.prototype, "imagePath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Catégorie de l\'image',
        example: 'restaurant',
        enum: ['restaurant', 'dishes', 'events', 'ambiance', 'staff', 'other']
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GalleryItem.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ordre d\'affichage de l\'image (optionnel)',
        example: 1
    }),
    (0, typeorm_1.Column)({ default: 999 }),
    __metadata("design:type", Number)
], GalleryItem.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indique si l\'image est active',
        example: true
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], GalleryItem.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GalleryItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GalleryItem.prototype, "updatedAt", void 0);
exports.GalleryItem = GalleryItem = __decorate([
    (0, typeorm_1.Entity)('gallery_items')
], GalleryItem);
//# sourceMappingURL=gallery-item.entity.js.map