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
exports.Menu = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Menu = class Menu {
    id;
    name;
    price;
    items;
    info;
    highlight;
    pdfUrl;
};
exports.Menu = Menu;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identifiant unique du menu',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Menu.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nom du menu',
        example: 'Menu Grenouilles à Volonté'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Menu.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prix du menu',
        example: '35€'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Menu.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Liste des plats inclus dans le menu',
        example: ['Entrée au choix', 'Grenouilles à volonté', 'Dessert au choix'],
        required: false
    }),
    (0, typeorm_1.Column)('simple-array', { nullable: true, default: [] }),
    __metadata("design:type", Array)
], Menu.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Informations supplémentaires (ex: horaires, contraintes)',
        example: 'Les soirs uniquement',
        required: false
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Menu.prototype, "info", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indique si le menu doit être mis en évidence',
        example: true,
        default: false
    }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Menu.prototype, "highlight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL du menu en format PDF (optionnel)',
        example: '/uploads/pdfs/1234abcd.pdf',
        required: false
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Menu.prototype, "pdfUrl", void 0);
exports.Menu = Menu = __decorate([
    (0, typeorm_1.Entity)('menus')
], Menu);
//# sourceMappingURL=menu.entity.js.map