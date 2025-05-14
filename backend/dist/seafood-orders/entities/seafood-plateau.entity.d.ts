import { SeafoodOrder } from './seafood-order.entity';
export declare class SeafoodPlateau {
    id: string;
    plateauId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    order: SeafoodOrder;
}
