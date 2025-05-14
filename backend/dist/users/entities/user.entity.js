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
exports.Users = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Users = class Users {
    id;
    name;
    email;
    password;
    role;
    phone_number;
    createdAt;
    updatedAt;
};
exports.Users = Users;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Identifiant unique de l\'utilisateur' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Users.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe', description: 'Nom de l\'utilisateur' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Users.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john@example.com', description: 'Email de l\'utilisateur' }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'hashed_password', description: 'Mot de passe hashé' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user', description: 'Rôle de l\'utilisateur (user ou admin)' }),
    (0, typeorm_1.Column)({ default: 'user' }),
    __metadata("design:type", String)
], Users.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '0612345678', description: 'Numéro de téléphone de l\'utilisateur' }),
    (0, typeorm_1.Column)({ nullable: true, name: 'phone_number' }),
    __metadata("design:type", String)
], Users.prototype, "phone_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-03-25T10:30:00Z', description: 'Date de création du compte' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Users.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-03-25T10:30:00Z', description: 'Date de dernière mise à jour du compte' }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Users.prototype, "updatedAt", void 0);
exports.Users = Users = __decorate([
    (0, typeorm_1.Entity)('users')
], Users);
//# sourceMappingURL=user.entity.js.map