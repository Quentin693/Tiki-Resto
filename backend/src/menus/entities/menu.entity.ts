import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('menus')
export class Menu {
  @ApiProperty({
    description: 'Identifiant unique du menu',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nom du menu',
    example: 'Menu Grenouilles à Volonté'
  })
  @Column()
  name: string;
  
  @ApiProperty({
    description: 'Prix du menu',
    example: '35€'
  })
  @Column()
  price: string;

  @ApiProperty({
    description: 'Liste des plats inclus dans le menu',
    example: ['Entrée au choix', 'Grenouilles à volonté', 'Dessert au choix'],
    required: false
  })
  @Column('simple-array', { nullable: true, default: null })
  items: string[];

  @ApiProperty({
    description: 'Informations supplémentaires (ex: horaires, contraintes)',
    example: 'Les soirs uniquement',
    required: false
  })
  @Column({ nullable: true })
  info: string;
  
  @ApiProperty({
    description: 'Indique si le menu doit être mis en évidence',
    example: true,
    default: false
  })
  @Column({ default: false })
  highlight: boolean;

  @ApiProperty({
    description: 'URL de l\'image du menu (optionnel)',
    example: '/uploads/images/1234abcd.jpg',
    required: false
  })
  @Column({ nullable: true })
  imageUrl: string;
} 