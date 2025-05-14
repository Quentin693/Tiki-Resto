import { PersonnelService } from './personnel.service';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { Personnel } from './entities/personnel.entity';
export declare class PersonnelController {
    private readonly personnelService;
    constructor(personnelService: PersonnelService);
    create(createPersonnelDto: CreatePersonnelDto): Promise<Personnel>;
    findAll(service?: string): Promise<Personnel[]>;
    findOne(id: string): Promise<Personnel>;
    update(id: string, updatePersonnelDto: UpdatePersonnelDto): Promise<Personnel>;
    remove(id: string): Promise<void>;
}
