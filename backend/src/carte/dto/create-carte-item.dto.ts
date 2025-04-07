import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCarteItemDto {
  @ApiProperty({ example: 'Salade Lyonnaise', description: 'Nom du plat' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Mélange exotique de mangue, avocat et crevettes', description: 'Description du plat' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 14, description: 'Prix du plat' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: '/entrees/saladeLyonnaise.png', description: 'Chemin de l\'image du plat' })
  @IsString()
  @IsOptional()
  imagePath?: string;

  @ApiProperty({ example: 'entrees', description: 'Catégorie du plat' })
  @IsString()
  @IsNotEmpty()
  category: string;
} 