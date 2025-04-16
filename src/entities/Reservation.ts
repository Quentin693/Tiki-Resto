import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientName: string;

  @Column()
  phoneNumber: string;

  @Column()
  numberOfGuests: number;

  @Column({ type: 'timestamp' })
  reservationDateTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.reservations)
  user: User;
} 