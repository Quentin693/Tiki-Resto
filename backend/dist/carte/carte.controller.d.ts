import { CarteService } from './carte.service';
import { CreateCarteItemDto } from './dto/create-carte-item.dto';
import { UpdateCarteItemDto } from './dto/update-carte-item.dto';
export declare class CarteController {
    private readonly carteService;
    private readonly logger;
    constructor(carteService: CarteService);
    create(createCarteItemDto: CreateCarteItemDto): Promise<import("./entities/carte-item.entity").CarteItem>;
    findAll(): Promise<{}>;
    findByCategory(category: string): Promise<import("./entities/carte-item.entity").CarteItem[]>;
    findOne(id: string): Promise<import("./entities/carte-item.entity").CarteItem>;
    update(id: string, updateCarteItemDto: UpdateCarteItemDto): Promise<import("./entities/carte-item.entity").CarteItem>;
    remove(id: string): Promise<import("./entities/carte-item.entity").CarteItem>;
}
