import { Repository } from 'typeorm';
import { CreateCarteItemDto } from './dto/create-carte-item.dto';
import { UpdateCarteItemDto } from './dto/update-carte-item.dto';
import { CarteItem } from './entities/carte-item.entity';
export declare class CarteService {
    private carteItemRepository;
    private readonly logger;
    constructor(carteItemRepository: Repository<CarteItem>);
    create(createCarteItemDto: CreateCarteItemDto): Promise<CarteItem>;
    findAll(): Promise<{}>;
    findByCategory(category: string): Promise<CarteItem[]>;
    findOne(id: number): Promise<CarteItem>;
    update(id: number, updateCarteItemDto: UpdateCarteItemDto): Promise<CarteItem>;
    remove(id: number): Promise<CarteItem>;
}
