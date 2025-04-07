import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { TimeSlotDto, TimeSlotsResponseDto } from './dto/time-slot.dto';

// Définir la capacité maximale du restaurant par créneau
const MAX_CAPACITY_PER_SLOT = 40;

@Injectable()
export class ReservationsService {
  private twilioClient: twilio.Twilio;

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    private configService: ConfigService,
  ) {
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    if (accountSid && authToken) {
      this.twilioClient = twilio(accountSid, authToken);
    }
  }

  private async sendConfirmationSMS(reservation: Reservation) {
    if (!this.twilioClient) return;

    const formatDate = (date: Date) => {
      return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const message = `Votre réservation chez le Tiki Au Bord de l'eau pour ${reservation.numberOfGuests} personnes le ${formatDate(reservation.reservationDateTime)} est confirmée ! À bientôt !`;

    try {
      const phoneNumber = reservation.customerPhone.startsWith('0') 
        ? '+33' + reservation.customerPhone.substring(1) 
        : reservation.customerPhone;
        
      await this.twilioClient.messages.create({
        body: message,
        to: phoneNumber,
        from: this.configService.get('TWILIO_PHONE_NUMBER'),
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  }

  // Vérifier la disponibilité pour un créneau spécifique
  private async checkAvailability(dateTime: Date, numberOfGuests: number): Promise<boolean> {
    // Récupérer les réservations à l'heure exacte
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    
    // Récupérer toutes les réservations pour cette date
    const targetDate = new Date(dateTime);
    targetDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const dayReservations = await this.reservationsRepository.find({
      where: {
        reservationDateTime: Between(targetDate, nextDay)
      }
    });
    
    // Filtrer les réservations pour ce créneau horaire exact
    const slotReservations = dayReservations.filter(res => {
      const resTime = new Date(res.reservationDateTime);
      return resTime.getHours() === hours && resTime.getMinutes() === minutes;
    });

    // Calculer le nombre total de convives déjà réservés
    const totalGuests = slotReservations.reduce((sum, res) => sum + res.numberOfGuests, 0);

    // Vérifier si l'ajout des nouveaux convives dépasse la capacité
    return (totalGuests + numberOfGuests) <= MAX_CAPACITY_PER_SLOT;
  }

  // Récupérer les créneaux disponibles pour une date donnée
  async getAvailableTimeSlots(date: string): Promise<TimeSlotsResponseDto> {
    // Définir les créneaux possibles
    const lunchSlots = ['12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30'];
    const dinnerSlots = ['19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30'];

    // Formater la date
    const formattedDate = new Date(date);
    formattedDate.setHours(0, 0, 0, 0);
    
    // Récupérer toutes les réservations pour cette journée
    const nextDay = new Date(formattedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const reservations = await this.reservationsRepository.find({
      where: {
        reservationDateTime: Between(formattedDate, nextDay)
      }
    });

    // Fonction pour vérifier la disponibilité d'un créneau
    const checkSlotAvailability = (timeStr: string): TimeSlotDto => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      const slotTime = new Date(formattedDate);
      slotTime.setHours(hours, minutes, 0, 0);
      
      // Vérifier uniquement les réservations à cette heure exacte
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
    
    // Vérifier la disponibilité pour chaque créneau
    const lunchAvailability = lunchSlots.map(checkSlotAvailability);
    const dinnerAvailability = dinnerSlots.map(checkSlotAvailability);
    
    return {
      lunch: lunchAvailability,
      dinner: dinnerAvailability
    };
  }

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const reservationDateTime = new Date(createReservationDto.reservationDateTime);
    
    // Vérifier si le créneau est disponible
    const isAvailable = await this.checkAvailability(
      reservationDateTime, 
      createReservationDto.numberOfGuests
    );
    
    if (!isAvailable) {
      throw new BadRequestException(
        'Ce créneau n\'est plus disponible ou la capacité est dépassée. Veuillez choisir un autre horaire.'
      );
    }
    
    // Créer la réservation
    const reservation = this.reservationsRepository.create({
      ...createReservationDto,
      reservationDateTime
    });
    
    const savedReservation = await this.reservationsRepository.save(reservation);
    
    // Envoyer un SMS de confirmation
    await this.sendConfirmationSMS(savedReservation);
    
    return savedReservation;
  }

  findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      order: {
        reservationDateTime: 'ASC'
      }
    });
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOneBy({ id });
    if (!reservation) {
      throw new NotFoundException(`Reservation #${id} not found`);
    }
    return reservation;
  }

  async update(id: number, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.findOne(id);
    
    // Si la mise à jour concerne le nombre de convives ou la date/heure
    if (
      (updateReservationDto.numberOfGuests && updateReservationDto.numberOfGuests !== reservation.numberOfGuests) ||
      (updateReservationDto.reservationDateTime && updateReservationDto.reservationDateTime !== reservation.reservationDateTime.toISOString())
    ) {
      const newDateTime = updateReservationDto.reservationDateTime 
        ? new Date(updateReservationDto.reservationDateTime)
        : reservation.reservationDateTime;
        
      const newGuestCount = updateReservationDto.numberOfGuests || reservation.numberOfGuests;
      
      // Vérifier si le nouveau créneau est disponible
      const isAvailable = await this.checkAvailability(newDateTime, newGuestCount);
      
      if (!isAvailable) {
        throw new BadRequestException(
          'Ce créneau n\'est plus disponible ou la capacité est dépassée. Veuillez choisir un autre horaire.'
        );
      }
    }

    const updatedReservation = {
      ...reservation,
      ...updateReservationDto
    };

    return await this.reservationsRepository.save(updatedReservation);
  }

  async remove(id: number): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationsRepository.delete(id);
  }
} 