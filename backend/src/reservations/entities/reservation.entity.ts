import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Reservation {
  @ApiProperty({ example: 1, description: 'Identifiant unique de la réservation' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Nom du client' })
  @Column()
  customerName: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email du client' })
  @Column()
  customerEmail: string;

  @ApiProperty({ example: '0601020304', description: 'Numéro de téléphone du client' })
  @Column()
  customerPhone: string;

  @ApiProperty({ example: 4, description: 'Nombre de convives' })
  @Column()
  numberOfGuests: number;

  @ApiProperty({ example: '2023-04-01T19:30:00Z', description: 'Date et heure de la réservation' })
  @Column({ type: 'timestamp' })
  reservationDateTime: Date;

  @ApiProperty({ example: 'Allergies aux fruits de mer', description: 'Demandes spéciales', required: false })
  @Column({ nullable: true })
  specialRequests: string;

  @ApiProperty({ example: '2023-03-25T10:30:00Z', description: 'Date de création de la réservation' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2023-03-25T10:30:00Z', description: 'Date de dernière mise à jour de la réservation' })
  @UpdateDateColumn()
  updatedAt: Date;
} 