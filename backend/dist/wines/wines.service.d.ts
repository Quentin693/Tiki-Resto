import { Repository } from 'typeorm';
import { Wine } from './entities/wine.entity';
import { CreateWineDto } from './dto/create-wine.dto';
import { UpdateWineDto } from './dto/update-wine.dto';
export declare class WinesService {
    private wineRepository;
    constructor(wineRepository: Repository<Wine>);
    create(createWineDto: CreateWineDto): Promise<Wine>;
    findAll(): Promise<{
        [key: string]: Wine[];
    }>;
    findOne(id: number): Promise<Wine>;
    update(id: number, updateWineDto: UpdateWineDto): Promise<Wine>;
    remove(id: number): Promise<void>;
}
