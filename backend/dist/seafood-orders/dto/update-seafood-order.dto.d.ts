import { OrderStatus } from '../entities/seafood-order.entity';
export declare class UpdateSeafoodOrderDto {
    status?: OrderStatus;
    comment?: string;
    pickupDate?: string;
    pickupTime?: string;
    isPickup?: boolean;
    specialRequests?: string;
}
