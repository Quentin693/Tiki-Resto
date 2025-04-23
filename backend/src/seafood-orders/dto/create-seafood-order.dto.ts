import { IsString, IsEmail, IsOptional, IsNumber, IsArray, Min, IsBoolean, IsDateString, Validate, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CustomerDto {
  @ApiProperty({ description: 'Nom du client' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Numéro de téléphone du client' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Email du client (optionnel)' })
  @IsEmail()
  @IsOptional()
  email?: string;
}

class PickupInfoDto {
  @ApiProperty({ description: 'Date de récupération (YYYY-MM-DD)' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Heure de récupération (HH:MM)' })
  @IsString()
  time: string;

  @ApiProperty({ description: 'À emporter (true) ou sur place (false)' })
  @IsBoolean()
  isPickup: boolean;
}

class OrderItemDto {
  @ApiProperty({ description: 'ID du produit' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Nom du produit' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Quantité commandée' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Prix unitaire' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Demi-douzaine pour les huîtres' })
  @IsBoolean()
  @IsOptional()
  half?: boolean;
}

class PlateauDto {
  @ApiProperty({ description: 'ID du plateau' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Nom du plateau' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Quantité commandée' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Prix unitaire' })
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateSeafoodOrderDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => PickupInfoDto)
  pickupInfo: PickupInfoDto;

  @ApiProperty({ type: [PlateauDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlateauDto)
  @IsOptional()
  plateaux: PlateauDto[] = [];

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsOptional()
  items: OrderItemDto[] = [];

  @ApiProperty({ description: 'Demandes spéciales (optionnel)' })
  @IsString()
  @IsOptional()
  specialRequests?: string;

  @ApiProperty({ description: 'Prix total de la commande' })
  @IsNumber()
  @Min(0)
  totalPrice: number;
} 