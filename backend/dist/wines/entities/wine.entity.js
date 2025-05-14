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
exports.Wine = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Wine = class Wine {
    id;
    name;
    region;
    bottlePrice;
    glassPrice;
    category;
};
exports.Wine = Wine;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identifiant unique du vin',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Wine.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom du vin',
        example: 'Côtes du Rhône'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Wine.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Région du vin',
        example: 'Vallée du Rhône'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Wine.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prix de la bouteille',
        example: '28€'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Wine.prototype, "bottlePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prix du verre (optionnel)',
        example: '6€',
        required: false
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Wine.prototype, "glassPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Catégorie du vin',
        example: 'rouges',
        enum: ['rouges', 'blancs', 'roses', 'champagnes']
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Wine.prototype, "category", void 0);
exports.Wine = Wine = __decorate([
    (0, typeorm_1.Entity)('wines')
], Wine);
//# sourceMappingURL=wine.entity.js.map