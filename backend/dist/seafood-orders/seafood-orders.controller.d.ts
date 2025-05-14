import { SeafoodOrdersService } from './seafood-orders.service';
import { CreateSeafoodOrderDto } from './dto/create-seafood-order.dto';
import { UpdateSeafoodOrderDto } from './dto/update-seafood-order.dto';
export declare class SeafoodOrdersController {
    private readonly seafoodOrdersService;
    constructor(seafoodOrdersService: SeafoodOrdersService);
    create(createOrderDto: CreateSeafoodOrderDto): Promise<import("./entities/seafood-order.entity").SeafoodOrder>;
    findAll(): Promise<import("./entities/seafood-order.entity").SeafoodOrder[]>;
    findByUser(userId: number): Promise<import("./entities/seafood-order.entity").SeafoodOrder[]>;
    search(email?: string, phone?: string): Promise<import("./entities/seafood-order.entity").SeafoodOrder[]>;
    findOne(id: string): Promise<import("./entities/seafood-order.entity").SeafoodOrder>;
    update(id: string, updateOrderDto: UpdateSeafoodOrderDto): Promise<import("./entities/seafood-order.entity").SeafoodOrder>;
    remove(id: string): Promise<void>;
    getStats(startDate?: string, endDate?: string): Promise<{
        totalOrders: number;
        revenue: number;
        byStatus: {
            pending: number;
            confirmed: number;
            processing: number;
            ready: number;
            completed: number;
            cancelled: number;
        };
    }>;
}
