import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('events')
export class Event {
  @ApiProperty({
    description: 'Identifiant unique de l\'événement',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Titre de l\'événement',
    example: 'Soirée Brasero'
  })
  @Column()
  title: string;
  
  @ApiProperty({
    description: 'Description de l\'événement',
    example: 'Profitez d\'une soirée conviviale autour de notre brasero et dégustez des grillades tropicales.'
  })
  @Column('text')
  description: string;

  @ApiProperty({
    description: 'Date de l\'événement',
    example: '2024-12-24'
  })
  @Column()
  date: string;
  
  @ApiProperty({
    description: 'Heure de l\'événement',
    example: '19:00'
  })
  @Column()
  time: string;
  
  @ApiProperty({
    description: 'Capacité de l\'événement',
    example: '120 places'
  })
  @Column()
  capacity: string;
  
  @ApiProperty({
    description: 'Chemin de l\'image de l\'événement',
    example: '/events/brasero.jpg'
  })
  @Column({ nullable: true })
  imagePath: string;
  
  @ApiProperty({
    description: 'Type d\'événement',
    example: 'brasero',
    enum: ['brasero', 'tapas', 'afterwork', 'anniversaire', 'fête', 'autre']
  })
  @Column()
  type: string;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 