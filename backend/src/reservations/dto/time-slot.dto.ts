import { ApiProperty } from '@nestjs/swagger';

export class TimeSlotDto {
  @ApiProperty({ example: '12:00', description: 'Heure du créneau' })
  time: string;

  @ApiProperty({ example: true, description: 'Indique si le créneau est disponible' })
  available: boolean;

  @ApiProperty({ example: 25, description: 'Nombre de places restantes' })
  remainingCapacity: number;
}

export class TimeSlotsResponseDto {
  @ApiProperty({ type: [TimeSlotDto], description: 'Créneaux disponibles pour le déjeuner' })
  lunch: TimeSlotDto[];

  @ApiProperty({ type: [TimeSlotDto], description: 'Créneaux disponibles pour le dîner' })
  dinner: TimeSlotDto[];
} 