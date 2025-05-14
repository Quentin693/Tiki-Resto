import { WinesService } from './wines.service';
import { CreateWineDto } from './dto/create-wine.dto';
import { UpdateWineDto } from './dto/update-wine.dto';
import { Wine } from './entities/wine.entity';
export declare class WinesController {
    private readonly winesService;
    constructor(winesService: WinesService);
    create(createWineDto: CreateWineDto): Promise<Wine>;
    findAll(): Promise<{
        [key: string]: Wine[];
    }>;
    findOne(id: string): Promise<Wine>;
    update(id: string, updateWineDto: UpdateWineDto): Promise<Wine>;
    remove(id: string): Promise<void>;
}
