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
var ReservationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const twilio = require("twilio");
const reservation_entity_1 = require("./entities/reservation.entity");
const MAX_CAPACITY_PER_SLOT = 30;
let ReservationsService = ReservationsService_1 = class ReservationsService {
    reservationsRepository;
    configService;
    twilioClient;
    logger = new common_1.Logger(ReservationsService_1.name);
    constructor(reservationsRepository, configService) {
        this.reservationsRepository = reservationsRepository;
        this.configService = configService;
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        if (accountSid && authToken) {
            this.twilioClient = twilio(accountSid, authToken);
        }
    }
    formatDateToFrenchTimezone(date) {
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Paris'
        };
        return new Date(date).toLocaleString('fr-FR', options);
    }
    async sendReservationSMS(reservation, action = 'confirmation') {
        if (!this.twilioClient)
            return;
        const formattedDateTime = this.formatDateToFrenchTimezone(reservation.reservationDateTime);
        let message = '';
        const signupLink = `${this.configService.get('FRONTEND_URL')}/login`;
        const modificationLink = `${this.configService.get('FRONTEND_URL')}/login`;
        switch (action) {
            case 'confirmation':
                message = `Votre réservation chez le Tiki Au Bord de l'eau pour ${reservation.numberOfGuests} personnes le ${formattedDateTime} est confirmée ! 

Pour toute modification, veuillez nous contacter au 04 78 49 02 39 ou créez un compte avec ce lien: ${signupLink}.
    
À bientôt !`;
                break;
            case 'modification':
                message = `Votre réservation chez le Tiki Au Bord de l'eau a été modifiée avec succès. 

Nouvelle réservation pour ${reservation.numberOfGuests} personnes le ${formattedDateTime}.

Pour toute autre modification, veuillez nous contacter au 04 78 49 02 39 ou connectez-vous avec ce lien: ${modificationLink}.
    
À bientôt !`;
                break;
            case 'annulation':
                message = `Votre réservation chez le Tiki Au Bord de l'eau pour ${reservation.numberOfGuests} personnes le ${formattedDateTime} a été annulée.

Nous espérons vous revoir bientôt !

Pour toute question, veuillez nous contacter au 04 78 49 02 39.`;
                break;
        }
        try {
            const phoneNumber = reservation.customerPhone.startsWith('0')
                ? '+33' + reservation.customerPhone.substring(1)
                : reservation.customerPhone;
            await this.twilioClient.messages.create({
                body: message,
                to: phoneNumber,
                from: this.configService.get('TWILIO_PHONE_NUMBER'),
            });
        }
        catch (error) {
            console.error('Error sending SMS:', error);
        }
    }
    async checkAvailability(dateTime, numberOfGuests, isEvent = false) {
        if (isEvent) {
            console.log('Événement détecté - Validation de capacité ignorée pour:', dateTime, numberOfGuests, 'personnes');
            return true;
        }
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        const targetDate = new Date(dateTime);
        targetDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const dayReservations = await this.reservationsRepository.find({
            where: {
                reservationDateTime: (0, typeorm_2.Between)(targetDate, nextDay)
            }
        });
        const slotReservations = dayReservations.filter(res => {
            const resTime = new Date(res.reservationDateTime);
            return resTime.getHours() === hours && resTime.getMinutes() === minutes;
        });
        const totalGuests = slotReservations.reduce((sum, res) => sum + res.numberOfGuests, 0);
        return (totalGuests + numberOfGuests) <= MAX_CAPACITY_PER_SLOT;
    }
    async getAvailableTimeSlots(date) {
        const lunchSlots = ['12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30'];
        const dinnerSlots = ['19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30'];
        const formattedDate = new Date(date);
        formattedDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(formattedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const reservations = await this.reservationsRepository.find({
            where: {
                reservationDateTime: (0, typeorm_2.Between)(formattedDate, nextDay)
            }
        });
        const checkSlotAvailability = (timeStr) => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const slotTime = new Date(formattedDate);
            slotTime.setHours(hours, minutes, 0, 0);
            const slotReservations = reservations.filter(res => {
                const resTime = new Date(res.reservationDateTime);
                return resTime.getHours() === hours && resTime.getMinutes() === minutes;
            });
            const totalGuests = slotReservations.reduce((sum, res) => sum + res.numberOfGuests, 0);
            const remainingCapacity = MAX_CAPACITY_PER_SLOT - totalGuests;
            return {
                time: timeStr,
                available: remainingCapacity > 0,
                remainingCapacity: Math.max(0, remainingCapacity)
            };
        };
        const lunchAvailability = lunchSlots.map(checkSlotAvailability);
        const dinnerAvailability = dinnerSlots.map(checkSlotAvailability);
        return {
            lunch: lunchAvailability,
            dinner: dinnerAvailability
        };
    }
    async create(createReservationDto) {
        const reservationDateTime = new Date(createReservationDto.reservationDateTime);
        const isEvent = Boolean(createReservationDto.isEvent) ||
            createReservationDto.numberOfGuests > 20 ||
            (createReservationDto.specialRequests &&
                typeof createReservationDto.specialRequests === 'string' &&
                createReservationDto.specialRequests.toLowerCase().includes('événement'));
        console.log(`Création réservation: ${createReservationDto.numberOfGuests} personnes, isEvent: ${isEvent}`);
        if (isEvent && createReservationDto.numberOfGuests > 20) {
            console.log(`Événement détecté avec ${createReservationDto.numberOfGuests} personnes`);
        }
        const isAvailable = await this.checkAvailability(reservationDateTime, createReservationDto.numberOfGuests, Boolean(isEvent));
        if (!isAvailable) {
            throw new common_1.BadRequestException('Ce créneau n\'est plus disponible ou la capacité est dépassée. Veuillez choisir un autre horaire.');
        }
        const reservation = this.reservationsRepository.create({
            ...createReservationDto,
            reservationDateTime
        });
        const savedReservation = await this.reservationsRepository.save(reservation);
        await this.sendReservationSMS(savedReservation, 'confirmation');
        return savedReservation;
    }
    findAll() {
        return this.reservationsRepository.find({
            order: {
                reservationDateTime: 'ASC'
            }
        });
    }
    async findByUserId(userId) {
        console.log(`Service: Recherche des réservations pour l'utilisateur ID: ${userId}`);
        const reservations = await this.reservationsRepository.find({
            where: { userId },
            order: { reservationDateTime: 'ASC' }
        });
        if (reservations.length === 0) {
            console.log(`Service: Aucune réservation trouvée pour l'utilisateur ID: ${userId}`);
        }
        else {
            console.log(`Service: ${reservations.length} réservations trouvées pour l'utilisateur ID: ${userId}`);
        }
        return reservations;
    }
    async findByContact(email, phone) {
        console.log(`Service: Recherche des réservations par contact: Email=${email}, Téléphone=${phone}`);
        let query = {};
        if (email && phone) {
            query = [
                { customerEmail: email },
                { customerPhone: phone }
            ];
        }
        else if (email) {
            query = { customerEmail: email };
        }
        else if (phone) {
            query = { customerPhone: phone };
        }
        const reservations = await this.reservationsRepository.find({
            where: query,
            order: { reservationDateTime: 'ASC' }
        });
        if (reservations.length === 0) {
            console.log(`Service: Aucune réservation trouvée pour Email=${email}, Téléphone=${phone}`);
        }
        else {
            console.log(`Service: ${reservations.length} réservations trouvées pour Email=${email}, Téléphone=${phone}`);
        }
        return reservations;
    }
    async findOne(id) {
        const reservation = await this.reservationsRepository.findOneBy({ id });
        if (!reservation) {
            throw new common_1.NotFoundException(`Reservation #${id} not found`);
        }
        return reservation;
    }
    async update(id, updateReservationDto) {
        const reservation = await this.findOne(id);
        if (updateReservationDto.hasOwnProperty('tableNumber') || updateReservationDto.hasOwnProperty('isArrived')) {
            this.logger.warn(`Tentative de mise à jour des champs admin via l'endpoint standard pour réservation #${id}`);
            const { tableNumber, isArrived, ...safeUpdateData } = updateReservationDto;
            Object.assign(reservation, safeUpdateData);
        }
        else {
            Object.assign(reservation, updateReservationDto);
        }
        if (updateReservationDto.reservationDateTime) {
            const newDateTime = new Date(updateReservationDto.reservationDateTime);
            const oldDateTime = new Date(reservation.reservationDateTime);
            if (newDateTime.getTime() !== oldDateTime.getTime()) {
                const isAvailable = await this.checkAvailability(newDateTime, updateReservationDto.numberOfGuests || reservation.numberOfGuests, Boolean(reservation.isEvent));
                if (!isAvailable) {
                    throw new common_1.BadRequestException('Ce créneau n\'est plus disponible ou la capacité est dépassée. Veuillez choisir un autre horaire.');
                }
                reservation.reservationDateTime = newDateTime;
            }
        }
        const updatedReservation = await this.reservationsRepository.save(reservation);
        await this.sendReservationSMS(updatedReservation, 'modification');
        return updatedReservation;
    }
    async adminUpdate(id, adminUpdateDto) {
        this.logger.log(`Service: Mise à jour admin de la réservation #${id}: ${JSON.stringify(adminUpdateDto)}`);
        const reservation = await this.findOne(id);
        if (adminUpdateDto.tableNumber !== undefined) {
            reservation.tableNumber = adminUpdateDto.tableNumber;
            this.logger.log(`Réservation #${id}: Numéro de table mis à jour -> ${adminUpdateDto.tableNumber}`);
        }
        if (adminUpdateDto.isArrived !== undefined) {
            reservation.isArrived = adminUpdateDto.isArrived;
            this.logger.log(`Réservation #${id}: Statut d'arrivée mis à jour -> ${adminUpdateDto.isArrived}`);
        }
        const updatedReservation = await this.reservationsRepository.save(reservation);
        this.logger.log(`Réservation #${id} mise à jour avec succès`);
        return updatedReservation;
    }
    async remove(id) {
        const reservation = await this.findOne(id);
        await this.sendReservationSMS(reservation, 'annulation');
        await this.reservationsRepository.remove(reservation);
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = ReservationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map