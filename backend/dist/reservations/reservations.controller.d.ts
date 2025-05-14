import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AdminUpdateReservationDto } from './dto/admin-update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { TimeSlotsResponseDto } from './dto/time-slot.dto';
export declare class ReservationsController {
    private readonly reservationsService;
    private readonly logger;
    constructor(reservationsService: ReservationsService);
    create(createReservationDto: CreateReservationDto): Promise<Reservation>;
    findAll(): Promise<Reservation[]>;
    findMyReservations(req: any): Promise<Reservation[]>;
    findByUserId(id: string): Promise<Reservation[]>;
    getAvailableTimeSlots(date: string): Promise<TimeSlotsResponseDto>;
    findOne(id: string): Promise<Reservation>;
    update(id: string, updateReservationDto: UpdateReservationDto): Promise<Reservation>;
    remove(id: string): Promise<void>;
    findByContact(email?: string, phone?: string): Promise<Reservation[]>;
}
export declare class AdminReservationsController {
    private readonly reservationsService;
    private readonly logger;
    constructor(reservationsService: ReservationsService);
    adminUpdate(id: string, adminUpdateReservationDto: AdminUpdateReservationDto): Promise<Reservation>;
}
