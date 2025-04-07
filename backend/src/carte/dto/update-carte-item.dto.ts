import { PartialType } from '@nestjs/swagger';
import { CreateCarteItemDto } from './create-carte-item.dto';

export class UpdateCarteItemDto extends PartialType(CreateCarteItemDto) {} 