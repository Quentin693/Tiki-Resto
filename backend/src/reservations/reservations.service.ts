import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AdminUpdateReservationDto } from './dto/admin-update-reservation.dto';
import { TimeSlotDto, TimeSlotsResponseDto } from './dto/time-slot.dto';

// Définir la capacité maximale du restaurant par créneau
const MAX_CAPACITY_PER_SLOT = 30;

@Injectable()
export class ReservationsService {
  private twilioClient: twilio.Twilio;
  private readonly logger = new Logger(ReservationsService.name);

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

    // Générer un lien vers la page d'inscription qui redirigera ensuite vers les réservations
    const siteUrl = this.configService.get('FRONTEND_URL') || 'https://tikiaureunion.fr';
    const signupLink = `${siteUrl}/signup?redirect=mes-reservations&email=${encodeURIComponent(reservation.customerEmail)}`;
    
    // Message avec lien d'inscription pour gérer la réservation
    const message = `Votre réservation chez le Tiki Au Bord de l'eau pour ${reservation.numberOfGuests} personnes le ${formatDate(reservation.reservationDateTime)} est confirmée ! 
    
Pour modifier ou annuler votre réservation, créez un compte avec ce lien: ${signupLink}
    
À bientôt !`;

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
  private async checkAvailability(dateTime: Date, numberOfGuests: number, isEvent: boolean = false): Promise<boolean> {
    // Si c'est un événement, on ignore la vérification de capacité
    if (isEvent) {
      console.log('Événement détecté - Validation de capacité ignorée pour:', dateTime, numberOfGuests, 'personnes');
      return true;
    }
    
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
    
    // Détecter si c'est un événement, soit par le flag isEvent, soit par le nombre de personnes > 20
    const isEvent = Boolean(createReservationDto.isEvent) || 
                   createReservationDto.numberOfGuests > 20 || 
                   (createReservationDto.specialRequests && 
                    typeof createReservationDto.specialRequests === 'string' && 
                    createReservationDto.specialRequests.toLowerCase().includes('événement'));
    
    console.log(`Création réservation: ${createReservationDto.numberOfGuests} personnes, isEvent: ${isEvent}`);
    
    // Si c'est un événement avec plus de 20 personnes, on vérifie si plusieurs créneaux sont nécessaires
    if (isEvent && createReservationDto.numberOfGuests > 20) {
      console.log(`Événement détecté avec ${createReservationDto.numberOfGuests} personnes`);
    }
    
    // Vérifier si le créneau est disponible
    const isAvailable = await this.checkAvailability(
      reservationDateTime, 
      createReservationDto.numberOfGuests,
      Boolean(isEvent) // Convertir explicitement en boolean
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

  async findByUserId(userId: number): Promise<Reservation[]> {
    console.log(`Service: Recherche des réservations pour l'utilisateur ID: ${userId}`);
    const reservations = await this.reservationsRepository.find({
      where: { userId },
      order: { reservationDateTime: 'ASC' }
    });

    if (reservations.length === 0) {
      console.log(`Service: Aucune réservation trouvée pour l'utilisateur ID: ${userId}`);
    } else {
      console.log(`Service: ${reservations.length} réservations trouvées pour l'utilisateur ID: ${userId}`);
    }

    return reservations;
  }

  async findByContact(email?: string, phone?: string): Promise<Reservation[]> {
    console.log(`Service: Recherche des réservations par contact: Email=${email}, Téléphone=${phone}`);
    
    // Construire la requête en fonction des paramètres fournis
    let query = {};
    
    if (email && phone) {
      // Si les deux sont fournis, chercher l'un ou l'autre
      query = [
        { customerEmail: email },
        { customerPhone: phone }
      ];
    } else if (email) {
      query = { customerEmail: email };
    } else if (phone) {
      query = { customerPhone: phone };
    }
    
    const reservations = await this.reservationsRepository.find({
      where: query,
      order: { reservationDateTime: 'ASC' }
    });
    
    if (reservations.length === 0) {
      console.log(`Service: Aucune réservation trouvée pour Email=${email}, Téléphone=${phone}`);
    } else {
      console.log(`Service: ${reservations.length} réservations trouvées pour Email=${email}, Téléphone=${phone}`);
    }
    
    return reservations;
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
    
    // Pour empêcher la mise à jour des champs admin via cet endpoint
    if (updateReservationDto.hasOwnProperty('tableNumber') || updateReservationDto.hasOwnProperty('isArrived')) {
      this.logger.warn(`Tentative de mise à jour des champs admin via l'endpoint standard pour réservation #${id}`);
      const { tableNumber, isArrived, ...safeUpdateData } = updateReservationDto as any;
      Object.assign(reservation, safeUpdateData);
    } else {
      Object.assign(reservation, updateReservationDto);
    }
    
    // Si la date et l'heure ont changé, vérifier la disponibilité
    if (updateReservationDto.reservationDateTime) {
      const newDateTime = new Date(updateReservationDto.reservationDateTime);
      const oldDateTime = new Date(reservation.reservationDateTime);
      
      // Ne vérifier que si la date/heure a réellement changé
      if (newDateTime.getTime() !== oldDateTime.getTime()) {
        // Vérifier si le nouveau créneau est disponible
        const isAvailable = await this.checkAvailability(
          newDateTime, 
          updateReservationDto.numberOfGuests || reservation.numberOfGuests,
          Boolean(reservation.isEvent)
        );
        
        if (!isAvailable) {
          throw new BadRequestException(
            'Ce créneau n\'est plus disponible ou la capacité est dépassée. Veuillez choisir un autre horaire.'
          );
        }
        
        // Mettre à jour la date/heure
        reservation.reservationDateTime = newDateTime;
      }
    }
    
    return this.reservationsRepository.save(reservation);
  }

  /**
   * Mettre à jour les champs administratifs d'une réservation
   * Cette méthode est réservée aux administrateurs
   */
  async adminUpdate(id: number, adminUpdateDto: AdminUpdateReservationDto): Promise<Reservation> {
    this.logger.log(`Service: Mise à jour admin de la réservation #${id}: ${JSON.stringify(adminUpdateDto)}`);
    
    const reservation = await this.findOne(id);
    
    // Vérifier si nous avons des données à mettre à jour
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

  async remove(id: number): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationsRepository.remove(reservation);
  }
} 