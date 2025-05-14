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
exports.Event = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Event = class Event {
    id;
    title;
    description;
    date;
    time;
    capacity;
    imagePath;
    type;
    createdAt;
    updatedAt;
};
exports.Event = Event;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identifiant unique de l\'événement',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Event.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Titre de l\'événement',
        example: 'Soirée Brasero'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description de l\'événement',
        example: 'Profitez d\'une soirée conviviale autour de notre brasero et dégustez des grillades tropicales.'
    }),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date de l\'événement',
        example: '2024-12-24'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Event.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Heure de l\'événement',
        example: '19:00'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Event.prototype, "time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Capacité de l\'événement',
        example: '120 places'
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Event.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Chemin de l\'image de l\'événement',
        example: '/events/brasero.jpg'
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "imagePath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type d\'événement',
        example: 'brasero',
        enum: ['brasero', 'tapas', 'afterwork', 'anniversaire', 'fête', 'autre']
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Event.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "updatedAt", void 0);
exports.Event = Event = __decorate([
    (0, typeorm_1.Entity)('events')
], Event);
//# sourceMappingURL=event.entity.js.map