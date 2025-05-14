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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const twilio = require("twilio");
const nodejs_1 = require("@emailjs/nodejs");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    configService;
    logger = new common_1.Logger(NotificationsService_1.name);
    twilioClient;
    constructor(configService) {
        this.configService = configService;
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        if (accountSid && authToken) {
            this.twilioClient = twilio(accountSid, authToken);
        }
        else {
            this.logger.warn('Identifiants Twilio non configurés');
        }
        const emailjsPublicKey = this.configService.get('EMAILJS_PUBLIC_KEY');
        const emailjsPrivateKey = this.configService.get('EMAILJS_PRIVATE_KEY');
        if (emailjsPublicKey && emailjsPrivateKey) {
            nodejs_1.default.init({
                publicKey: emailjsPublicKey,
                privateKey: emailjsPrivateKey,
            });
        }
        else {
            this.logger.warn('Identifiants EmailJS non configurés');
        }
    }
    async sendSMS(to, body) {
        if (!this.twilioClient) {
            this.logger.error('Client Twilio non initialisé');
            return false;
        }
        try {
            const message = await this.twilioClient.messages.create({
                body,
                from: this.configService.get('TWILIO_PHONE_NUMBER'),
                to,
            });
            this.logger.log(`SMS envoyé avec succès. SID: ${message.sid}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Erreur lors de l'envoi du SMS: ${error.message}`);
            return false;
        }
    }
    async sendReservationConfirmation(phone, name, date, time, guests) {
        const message = `Bonjour ${name}, votre réservation au Tiki au bord de l'eau pour le ${date} à ${time} pour ${guests} personne(s) est confirmée. À bientôt!`;
        return this.sendSMS(phone, message);
    }
    async sendReservationModification(phone, name, date, time, guests) {
        const message = `Bonjour ${name}, votre réservation au Tiki au bord de l'eau a été modifiée pour le ${date} à ${time} pour ${guests} personne(s). À bientôt!`;
        return this.sendSMS(phone, message);
    }
    async sendReservationCancellation(phone, name) {
        const message = `Bonjour ${name}, votre réservation au Tiki au bord de l'eau a été annulée. Nous espérons vous voir prochainement!`;
        return this.sendSMS(phone, message);
    }
    async sendEventConfirmation(phone, name, date, time, guests) {
        const message = `Bonjour ${name}, votre participation à l'événement du Tiki au bord de l'eau pour le ${date} à ${time} pour ${guests} personne(s) est confirmée. À bientôt!`;
        return this.sendSMS(phone, message);
    }
    async sendEventModification(phone, name, date, time, guests) {
        const message = `Bonjour ${name}, votre participation à l'événement du Tiki au bord de l'eau a été modifiée pour le ${date} à ${time} pour ${guests} personne(s). À bientôt!`;
        return this.sendSMS(phone, message);
    }
    async sendEventCancellation(phone, name) {
        const message = `Bonjour ${name}, votre participation à l'événement du Tiki au bord de l'eau a été annulée. Nous espérons vous voir prochainement!`;
        return this.sendSMS(phone, message);
    }
    async sendSeafoodOrderConfirmation(phone, name, orderDate, pickupDate) {
        const message = `Bonjour ${name}, votre commande de fruits de mer au Tiki au bord de l'eau du ${orderDate} est confirmée. Date de retrait: ${pickupDate}. À bientôt!`;
        return this.sendSMS(phone, message);
    }
    async sendEmail(to, templateId, templateParams) {
        const serviceId = this.configService.get('EMAILJS_SERVICE_ID');
        if (!serviceId) {
            this.logger.error('EMAILJS_SERVICE_ID non configuré');
            return false;
        }
        try {
            this.logger.debug(`Tentative d'envoi d'email via EmailJS:`);
            this.logger.debug(`- Service ID: ${serviceId}`);
            this.logger.debug(`- Template ID: ${templateId}`);
            this.logger.debug(`- Destinataire: ${to}`);
            this.logger.debug(`- Paramètres: ${JSON.stringify(templateParams)}`);
            const publicKey = this.configService.get('EMAILJS_PUBLIC_KEY');
            const privateKey = this.configService.get('EMAILJS_PRIVATE_KEY');
            if (!publicKey || !privateKey) {
                this.logger.error('Identifiants EmailJS manquants');
                return false;
            }
            nodejs_1.default.init({
                publicKey: publicKey,
                privateKey: privateKey,
            });
            const emailParams = {
                to_name: templateParams.name || 'Admin',
                to_email: to,
                ...templateParams
            };
            this.logger.debug(`Paramètres formatés pour EmailJS: ${JSON.stringify(emailParams)}`);
            const result = await nodejs_1.default.send(serviceId, templateId, emailParams);
            this.logger.log(`Email envoyé avec succès à ${to}. Status: ${result.status}, Text: ${result.text}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Erreur lors de l'envoi de l'email: ${error.message}`);
            if (error.text) {
                this.logger.error(`Détails de l'erreur: ${error.text}`);
            }
            return false;
        }
    }
    async sendSeafoodOrderNotificationToAdmin(orderDetails) {
        const adminEmail = this.configService.get('ADMIN_EMAIL');
        if (!adminEmail) {
            this.logger.error('Email admin non configuré');
            return false;
        }
        const templateParams = {
            order_id: orderDetails.id,
            customer_name: orderDetails.name,
            customer_phone: orderDetails.phone,
            customer_email: orderDetails.email,
            order_date: orderDetails.orderDate,
            pickup_date: orderDetails.pickupDate,
            items: JSON.stringify(orderDetails.items),
            total_price: orderDetails.totalPrice,
            notes: orderDetails.notes || 'Aucune',
        };
        return this.sendEmail(adminEmail, 'template_seafood_order', templateParams);
    }
    async sendEventRequestNotificationToAdmin(eventDetails) {
        const adminEmail = this.configService.get('ADMIN_EMAIL');
        if (!adminEmail) {
            this.logger.error('Email admin non configuré');
            return false;
        }
        const templateParams = {
            request_id: eventDetails.id,
            customer_name: eventDetails.name,
            customer_phone: eventDetails.phone,
            customer_email: eventDetails.email,
            event_date: eventDetails.date,
            event_time: eventDetails.time,
            guests_count: eventDetails.guestsCount,
            event_type: eventDetails.eventType,
            notes: eventDetails.notes || 'Aucune',
        };
        return this.sendEmail(adminEmail, 'template_event_request', templateParams);
    }
    async sendContactFormNotificationToAdmin(contactDetails) {
        const adminEmail = this.configService.get('ADMIN_EMAIL');
        if (!adminEmail) {
            this.logger.error('Email admin non configuré');
            return false;
        }
        const templateParams = {
            name: contactDetails.name,
            email: contactDetails.email,
            phone: contactDetails.phone || 'Non fourni',
            subject: contactDetails.subject,
            message: contactDetails.message,
        };
        const templateId = this.configService.get('EMAILJS_TEMPLATE_CONTACT');
        if (!templateId) {
            this.logger.error('Template ID pour le formulaire de contact non configuré');
            return false;
        }
        this.logger.debug(`Envoi d'email à ${adminEmail} avec template ${templateId} et params: ${JSON.stringify(templateParams)}`);
        return this.sendEmail(adminEmail, templateId, templateParams);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map