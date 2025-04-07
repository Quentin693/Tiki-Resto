import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsIn } from 'class-validator';

export class CreateGalleryItemDto {
  @ApiProperty({
    description: 'Titre de l\'image',
    example: 'Vue extérieure du restaurant'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description de l\'image',
    example: 'Notre terrasse vue de l\'extérieur pendant l\'été',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Chemin de l\'image',
    example: '/images/restaurant-terrasse.jpg'
  })
  @IsString()
  @IsNotEmpty()
  imagePath: string;

  @ApiProperty({
    description: 'Catégorie de l\'image',
    example: 'restaurant',
    enum: ['restaurant', 'dishes', 'events', 'ambiance', 'staff', 'other']
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['restaurant', 'dishes', 'events', 'ambiance', 'staff', 'other'])
  category: string;

  @ApiProperty({
    description: 'Ordre d\'affichage de l\'image (optionnel)',
    example: 1,
    required: false
  })
  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @ApiProperty({
    description: 'Indique si l\'image est active',
    example: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 