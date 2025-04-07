import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Personnel } from './entities/personnel.entity';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';

@Injectable()
export class PersonnelService {
  private readonly logger = new Logger(PersonnelService.name);

  constructor(
    @InjectRepository(Personnel)
    private personnelRepository: Repository<Personnel>,
  ) {}

  async create(createPersonnelDto: CreatePersonnelDto): Promise<Personnel> {
    this.logger.debug(`Creating personnel: ${JSON.stringify(createPersonnelDto)}`);
    const personnel = this.personnelRepository.create(createPersonnelDto);
    return await this.personnelRepository.save(personnel);
  }

  async findAll(): Promise<Personnel[]> {
    this.logger.debug('Finding all personnel');
    return await this.personnelRepository.find({
      order: {
        service: 'ASC',
        lastName: 'ASC',
        firstName: 'ASC'
      }
    });
  }

  async findByService(service: string): Promise<Personnel[]> {
    this.logger.debug(`Finding personnel by service: ${service}`);
    return await this.personnelRepository.find({
      where: { service },
      order: {
        lastName: 'ASC',
        firstName: 'ASC'
      }
    });
  }

  async findOne(id: number): Promise<Personnel> {
    this.logger.debug(`Finding personnel with id: ${id}`);
    const personnel = await this.personnelRepository.findOneBy({ id });
    if (!personnel) {
      throw new NotFoundException(`Personnel avec l'ID ${id} non trouvé`);
    }
    return personnel;
  }

  async update(id: number, updatePersonnelDto: UpdatePersonnelDto): Promise<Personnel> {
    this.logger.debug(`Updating personnel ${id} with: ${JSON.stringify(updatePersonnelDto)}`);
    const personnel = await this.findOne(id);
    Object.assign(personnel, updatePersonnelDto);
    return await this.personnelRepository.save(personnel);
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Removing personnel with id: ${id}`);
    const result = await this.personnelRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Personnel avec l'ID ${id} non trouvé`);
    }
  }
} 