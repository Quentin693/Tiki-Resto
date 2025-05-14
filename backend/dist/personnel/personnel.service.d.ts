import { Repository } from 'typeorm';
import { Personnel } from './entities/personnel.entity';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
export declare class PersonnelService {
    private personnelRepository;
    private readonly logger;
    constructor(personnelRepository: Repository<Personnel>);
    create(createPersonnelDto: CreatePersonnelDto): Promise<Personnel>;
    findAll(): Promise<Personnel[]>;
    findByService(service: string): Promise<Personnel[]>;
    findOne(id: number): Promise<Personnel>;
    update(id: number, updatePersonnelDto: UpdatePersonnelDto): Promise<Personnel>;
    remove(id: number): Promise<void>;
}
