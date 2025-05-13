import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { SeafoodOrderItem } from './seafood-order-item.entity';
import { SeafoodPlateau } from './seafood-plateau.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('seafood_orders')
export class SeafoodOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Informations client
  @Column()
  customerName: string;

  @Column()
  customerPhone: string;

  @Column({ nullable: true, type: 'varchar' })
  customerEmail: string | null;

  // Lien avec l'utilisateur (si connecté)
  @Column({ type: 'integer', nullable: true })
  userId?: number;

  // Infos de récupération
  @Column({ type: 'date' })
  pickupDate: Date;

  @Column()
  pickupTime: string;

  @Column({ default: true })
  isPickup: boolean;

  // Détails de la commande
  @OneToMany(() => SeafoodOrderItem, item => item.order, { cascade: true, eager: true })
  items: SeafoodOrderItem[];

  @OneToMany(() => SeafoodPlateau, plateau => plateau.order, { cascade: true, eager: true })
  plateaux: SeafoodPlateau[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'text', nullable: true })
  specialRequests: string | null;

  // Statut de la commande
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  // Suivi
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 