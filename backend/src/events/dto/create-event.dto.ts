import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    description: 'Titre de l\'événement',
    example: 'Soirée Brasero'
  })
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @ApiProperty({
    description: 'Description de l\'événement',
    example: 'Profitez d\'une soirée conviviale autour de notre brasero et dégustez des grillades tropicales.'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Date de l\'événement',
    example: '2024-12-24'
  })
  @IsString()
  @IsNotEmpty()
  date: string;
  
  @ApiProperty({
    description: 'Heure de l\'événement',
    example: '19:00'
  })
  @IsString()
  @IsNotEmpty()
  time: string;
  
  @ApiProperty({
    description: 'Capacité de l\'événement',
    example: '120 places'
  })
  @IsString()
  @IsNotEmpty()
  capacity: string;
  
  @ApiProperty({
    description: 'Chemin de l\'image de l\'événement',
    example: '/events/brasero.jpg',
    required: false
  })
  @IsString()
  @IsOptional()
  imagePath?: string;
  
  @ApiProperty({
    description: 'Type d\'événement',
    example: 'brasero',
    enum: ['brasero', 'tapas', 'afterwork', 'anniversaire', 'fête', 'autre']
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['brasero', 'tapas', 'afterwork', 'anniversaire', 'fête', 'autre'])
  type: string;
} 