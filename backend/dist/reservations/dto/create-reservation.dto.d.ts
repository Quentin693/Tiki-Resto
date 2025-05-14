export declare class CreateReservationDto {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    numberOfGuests: number;
    reservationDateTime: string;
    specialRequests?: string;
    userId?: number;
    createdAt: string;
    isEvent?: boolean;
}
