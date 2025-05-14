declare class CustomerDto {
    name: string;
    phone: string;
    email?: string;
}
declare class PickupInfoDto {
    date: string;
    time: string;
    isPickup: boolean;
}
declare class OrderItemDto {
    id: string;
    name: string;
    quantity: number;
    price: number;
    half?: boolean;
}
declare class PlateauDto {
    id: string;
    name: string;
    quantity: number;
    price: number;
}
export declare class CreateSeafoodOrderDto {
    customer: CustomerDto;
    pickupInfo: PickupInfoDto;
    plateaux: PlateauDto[];
    items: OrderItemDto[];
    specialRequests?: string;
    totalPrice: number;
    userId?: number;
}
export {};
