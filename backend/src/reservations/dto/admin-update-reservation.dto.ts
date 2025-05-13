import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';

export class AdminUpdateReservationDto {
  @ApiProperty({ 
    example: 5, 
    description: 'Numéro de table attribué à la réservation', 
    required: false 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tableNumber?: number;

  @ApiProperty({ 
    example: true, 
    description: 'Indique si le client est arrivé au restaurant', 
    required: false 
  })
  @IsOptional()
  @IsBoolean()
  isArrived?: boolean;
} 