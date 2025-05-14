import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AdminUpdateReservationDto } from './dto/admin-update-reservation.dto';
import { TimeSlotsResponseDto } from './dto/time-slot.dto';
export declare class ReservationsService {
    private readonly reservationsRepository;
    private configService;
    private twilioClient;
    private readonly logger;
    constructor(reservationsRepository: Repository<Reservation>, configService: ConfigService);
    private sendConfirmationSMS;
    private checkAvailability;
    getAvailableTimeSlots(date: string): Promise<TimeSlotsResponseDto>;
    create(createReservationDto: CreateReservationDto): Promise<Reservation>;
    findAll(): Promise<Reservation[]>;
    findByUserId(userId: number): Promise<Reservation[]>;
    findByContact(email?: string, phone?: string): Promise<Reservation[]>;
    findOne(id: number): Promise<Reservation>;
    update(id: number, updateReservationDto: UpdateReservationDto): Promise<Reservation>;
    adminUpdate(id: number, adminUpdateDto: AdminUpdateReservationDto): Promise<Reservation>;
    remove(id: number): Promise<void>;
}
