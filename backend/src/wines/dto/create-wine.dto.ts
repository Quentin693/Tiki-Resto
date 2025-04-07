import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateWineDto {
  @ApiProperty({
    description: 'Nom du vin',
    example: 'Côtes du Rhône'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Région du vin',
    example: 'Vallée du Rhône'
  })
  @IsNotEmpty()
  @IsString()
  region: string;

  @ApiProperty({
    description: 'Prix de la bouteille',
    example: '28€'
  })
  @IsNotEmpty()
  @IsString()
  bottlePrice: string;

  @ApiProperty({
    description: 'Prix du verre (optionnel)',
    example: '6€',
    required: false
  })
  @IsOptional()
  @IsString()
  glassPrice?: string;

  @ApiProperty({
    description: 'Catégorie du vin',
    example: 'rouges',
    enum: ['rouges', 'blancs', 'roses', 'champagnes']
  })
  @IsNotEmpty()
  @IsString()
  category: string;
} 