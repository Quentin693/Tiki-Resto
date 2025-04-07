import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';

export class CreatePersonnelDto {
  @ApiProperty({
    description: 'Prénom du membre du personnel',
    example: 'Greg'
  })
  @IsString()
  firstName: string;
  
  @ApiProperty({
    description: 'Nom de famille du membre du personnel',
    example: 'Maire'
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Type de service',
    example: 'salle',
    enum: ['salle', 'cuisine']
  })
  @IsEnum(['salle', 'cuisine'])
  service: string;
  
  @ApiProperty({
    description: 'Poste/rôle occupé',
    example: 'Vieux Loup'
  })
  @IsString()
  role: string;
  
  @ApiProperty({
    description: 'Description du membre du personnel',
    example: 'Fort de 20 ans d\'expérience dans la cuisine polynésienne, Michel dirige notre cuisine avec passion et créativité.',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;
  
  @ApiProperty({
    description: 'Spécialité du membre du personnel',
    example: 'Poissons crus et marinades traditionnelles',
    required: false
  })
  @IsString()
  @IsOptional()
  speciality?: string;
  
  @ApiProperty({
    description: 'Expérience du membre du personnel',
    example: '20 ans d\'expérience',
    required: false
  })
  @IsString()
  @IsOptional()
  experience?: string;
  
  @ApiProperty({
    description: 'Horaires de travail du membre du personnel',
    example: 'Service du soir',
    required: false
  })
  @IsString()
  @IsOptional()
  schedule?: string;
  
  @ApiProperty({
    description: 'Chemin de l\'image du membre du personnel',
    example: '/equipe/greg.jpg'
  })
  @IsString()
  @IsOptional()
  imagePath?: string;
} 