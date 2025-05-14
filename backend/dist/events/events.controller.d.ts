import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsController {
    private readonly eventsService;
    private readonly logger;
    constructor(eventsService: EventsService);
    create(createEventDto: CreateEventDto): Promise<import("./entities/event.entity").Event>;
    findAll(): Promise<import("./entities/event.entity").Event[]>;
    findByType(type: string): Promise<import("./entities/event.entity").Event[]>;
    findOne(id: string): Promise<import("./entities/event.entity").Event>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<import("./entities/event.entity").Event>;
    remove(id: string): Promise<void>;
}
