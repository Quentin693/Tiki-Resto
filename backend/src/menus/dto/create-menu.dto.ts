import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({
    description: 'Nom du menu',
    example: 'Menu Grenouilles à Volonté'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Prix du menu',
    example: '35€'
  })
  @IsNotEmpty()
  @IsString()
  price: string;

  @ApiProperty({
    description: 'Liste des plats inclus dans le menu',
    example: ['Entrée au choix', 'Grenouilles à volonté', 'Dessert au choix']
  })
  @IsNotEmpty()
  @IsArray()
  items: string[];

  @ApiProperty({
    description: 'Informations supplémentaires (ex: horaires, contraintes)',
    example: 'Les soirs uniquement',
    required: false
  })
  @IsOptional()
  @IsString()
  info?: string;

  @ApiProperty({
    description: 'Indique si le menu doit être mis en évidence',
    example: true,
    required: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  highlight?: boolean;
} 