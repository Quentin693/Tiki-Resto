import { IsEmail, IsNotEmpty, IsNumber, IsString, Min, Max, IsOptional, IsDateString, Matches, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateReservationDto {

  @ApiProperty({ example: 'John Doe', description: 'Nom du client' })
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email du client' })
  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: '06 XX XX XX XX', description: 'Numéro de téléphone du client (format: 06 XX XX XX XX)' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.replace(/\s/g, ''))
  @Matches(/^(04|06|07)[0-9]{8}$/, {
    message: 'Le numéro de téléphone doit être un numéro français valide commençant par 04, 06 ou 07',
  })
  customerPhone: string;

  @ApiProperty({ example: 4, description: 'Nombre de convives', minimum: 1, maximum: 20 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(20, { 
    message: 'Le nombre de convives ne peut pas dépasser 20 personnes pour une réservation normale. Pour les événements, activez l\'option isEvent.'
  })
  numberOfGuests: number;

  @ApiProperty({ example: '2023-04-01T19:30:00Z', description: 'Date et heure de la réservation' })
  @IsNotEmpty()
  @IsDateString()
  reservationDateTime: string;

  @ApiProperty({ example: 'Allergies aux fruits de mer', description: 'Demandes spéciales', required: false })
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiProperty({ example: 1, description: 'ID de l\'utilisateur', required: false })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ example: '2023-04-01T19:30:00Z', description: 'Date et heure de la réservation' })
  @IsNotEmpty()
  @IsDateString()
  createdAt: string;
  
  @ApiProperty({ example: false, description: 'Indique si c\'est un événement (permet >20 personnes)', required: false })
  @IsOptional()
  @IsBoolean()
  isEvent?: boolean;
} 