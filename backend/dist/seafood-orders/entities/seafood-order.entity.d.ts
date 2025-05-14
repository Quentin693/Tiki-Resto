import { SeafoodOrderItem } from './seafood-order-item.entity';
import { SeafoodPlateau } from './seafood-plateau.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PROCESSING = "processing",
    READY = "ready",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class SeafoodOrder {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string | null;
    userId?: number;
    pickupDate: Date;
    pickupTime: string;
    isPickup: boolean;
    items: SeafoodOrderItem[];
    plateaux: SeafoodPlateau[];
    totalPrice: number;
    specialRequests: string | null;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}
