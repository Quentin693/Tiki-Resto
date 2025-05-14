import { Repository } from 'typeorm';
import { SeafoodOrder } from './entities/seafood-order.entity';
import { SeafoodOrderItem } from './entities/seafood-order-item.entity';
import { SeafoodPlateau } from './entities/seafood-plateau.entity';
import { CreateSeafoodOrderDto } from './dto/create-seafood-order.dto';
import { UpdateSeafoodOrderDto } from './dto/update-seafood-order.dto';
export declare class SeafoodOrdersService {
    private ordersRepository;
    private orderItemsRepository;
    private plateauxRepository;
    constructor(ordersRepository: Repository<SeafoodOrder>, orderItemsRepository: Repository<SeafoodOrderItem>, plateauxRepository: Repository<SeafoodPlateau>);
    create(createOrderDto: CreateSeafoodOrderDto): Promise<SeafoodOrder>;
    findAll(): Promise<SeafoodOrder[]>;
    findByUser(userId: number): Promise<SeafoodOrder[]>;
    search(email?: string, phone?: string): Promise<SeafoodOrder[]>;
    findOne(id: string): Promise<SeafoodOrder>;
    update(id: string, updateOrderDto: UpdateSeafoodOrderDto): Promise<SeafoodOrder>;
    remove(id: string): Promise<void>;
    getOrderStats(startDate: Date, endDate: Date): Promise<{
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
