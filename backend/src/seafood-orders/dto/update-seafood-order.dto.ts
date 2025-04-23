import { IsEnum, IsOptional, IsString } from 'class-validator';
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
} 