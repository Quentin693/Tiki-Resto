import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    this.logger.debug(`Creating event: ${JSON.stringify(createEventDto)}`);
    const event = this.eventRepository.create(createEventDto);
    return await this.eventRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    this.logger.debug('Finding all events');
    return await this.eventRepository.find({
      order: {
        date: 'ASC',
        time: 'ASC'
      }
    });
  }

  async findByType(type: string): Promise<Event[]> {
    this.logger.debug(`Finding events by type: ${type}`);
    return await this.eventRepository.find({
      where: { type },
      order: {
        date: 'ASC',
        time: 'ASC'
      }
    });
  }

  async findOne(id: number): Promise<Event> {
    this.logger.debug(`Finding event with id: ${id}`);
    const event = await this.eventRepository.findOneBy({ id });
    if (!event) {
      throw new NotFoundException(`Événement avec l'ID ${id} non trouvé`);
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    this.logger.debug(`Updating event ${id} with: ${JSON.stringify(updateEventDto)}`);
    const event = await this.findOne(id);
    Object.assign(event, updateEventDto);
    return await this.eventRepository.save(event);
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Removing event with id: ${id}`);
    const result = await this.eventRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Événement avec l'ID ${id} non trouvé`);
    }
  }
} 