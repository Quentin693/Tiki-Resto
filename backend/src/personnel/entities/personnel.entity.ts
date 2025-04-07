import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('personnel')
export class Personnel {
  @ApiProperty({
    description: 'Identifiant unique du personnel',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Prénom du membre du personnel',
    example: 'Greg'
  })
  @Column()
  firstName: string;
  
  @ApiProperty({
    description: 'Nom de famille du membre du personnel',
    example: 'Maire'
  })
  @Column()
  lastName: string;

  @ApiProperty({
    description: 'Type de service',
    example: 'salle',
    enum: ['salle', 'cuisine']
  })
  @Column()
  service: string;
  
  @ApiProperty({
    description: 'Poste/rôle occupé',
    example: 'Vieux Loup'
  })
  @Column()
  role: string;
  
  @ApiProperty({
    description: 'Description du membre du personnel',
    example: 'Fort de 20 ans d\'expérience dans la cuisine polynésienne, Michel dirige notre cuisine avec passion et créativité.'
  })
  @Column('text', { nullable: true })
  description: string;
  
  @ApiProperty({
    description: 'Spécialité du membre du personnel',
    example: 'Poissons crus et marinades traditionnelles'
  })
  @Column({ nullable: true })
  speciality: string;
  
  @ApiProperty({
    description: 'Expérience du membre du personnel',
    example: '20 ans d\'expérience'
  })
  @Column({ nullable: true })
  experience: string;
  
  @ApiProperty({
    description: 'Horaires de travail du membre du personnel',
    example: 'Service du soir'
  })
  @Column({ nullable: true })
  schedule: string;
  
  @ApiProperty({
    description: 'Chemin de l\'image du membre du personnel',
    example: '/equipe/greg.jpg'
  })
  @Column({ nullable: true })
  imagePath: string;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 