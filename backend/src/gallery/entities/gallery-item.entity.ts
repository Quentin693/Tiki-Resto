import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('gallery_items')
export class GalleryItem {
  @ApiProperty({
    description: 'Identifiant unique de l\'image',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Titre de l\'image',
    example: 'Vue extérieure du restaurant'
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Description de l\'image',
    example: 'Notre terrasse vue de l\'extérieur pendant l\'été'
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Chemin de l\'image',
    example: '/images/restaurant-terrasse.jpg'
  })
  @Column()
  imagePath: string;

  @ApiProperty({
    description: 'Catégorie de l\'image',
    example: 'restaurant',
    enum: ['restaurant', 'dishes', 'events', 'ambiance', 'staff', 'other']
  })
  @Column()
  category: string;

  @ApiProperty({
    description: 'Ordre d\'affichage de l\'image (optionnel)',
    example: 1
  })
  @Column({ default: 999 })
  displayOrder: number;

  @ApiProperty({
    description: 'Indique si l\'image est active',
    example: true
  })
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 