import { IsEnum, IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../entities/seafood-order.entity';

export class UpdateSeafoodOrderDto {
  @ApiProperty({ 
    enum: OrderStatus,
    description: 'Statut de la commande'
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({ description: 'Commentaire sur la commande' })
  @IsString()
  @IsOptional()
  comment?: string;
  
  @ApiProperty({ description: 'Date de récupération (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  pickupDate?: string;
  
  @ApiProperty({ description: 'Heure de récupération (HH:MM)' })
  @IsString()
  @IsOptional()
  pickupTime?: string;
  
  @ApiProperty({ description: 'À emporter (true) ou sur place (false)' })
  @IsBoolean()
  @IsOptional()
  isPickup?: boolean;
  
  @ApiProperty({ description: 'Demandes spéciales (optionnel)' })
  @IsString()
  @IsOptional()
  specialRequests?: string;
} 