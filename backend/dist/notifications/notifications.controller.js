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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notifications_service_1 = require("./notifications.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const notifications_dto_1 = require("./dto/notifications.dto");
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async testSMS(sendSmsDto) {
        const success = await this.notificationsService.sendSMS(sendSmsDto.phone, sendSmsDto.message);
        return { success };
    }
    async testEmail(sendEmailDto) {
        const success = await this.notificationsService.sendEmail(sendEmailDto.email, sendEmailDto.templateId, sendEmailDto.templateParams);
        return { success };
    }
    async contactForm(contactFormDto) {
        const success = await this.notificationsService.sendContactFormNotificationToAdmin(contactFormDto);
        return { success };
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)('test-sms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tester l\'envoi d\'un SMS (Admin uniquement)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SMS envoyé avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès interdit - Nécessite les droits administrateur' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notifications_dto_1.SendSmsDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "testSMS", null);
__decorate([
    (0, common_1.Post)('test-email'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tester l\'envoi d\'un email (Admin uniquement)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email envoyé avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès interdit - Nécessite les droits administrateur' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notifications_dto_1.SendEmailDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "testEmail", null);
__decorate([
    (0, common_1.Post)('contact'),
    (0, swagger_1.ApiOperation)({ summary: 'Envoyer un message via le formulaire de contact' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message envoyé avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notifications_dto_1.ContactFormDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "contactForm", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map