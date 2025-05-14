import { SeafoodOrder } from './seafood-order.entity';
export declare class SeafoodOrderItem {
    id: string;
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    isHalfDozen: boolean;
    order: SeafoodOrder;
}
