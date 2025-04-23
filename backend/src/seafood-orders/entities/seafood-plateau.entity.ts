import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SeafoodOrder } from './seafood-order.entity';

@Entity('seafood_plateaux')
export class SeafoodPlateau {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  plateauId: string;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @ManyToOne(() => SeafoodOrder, order => order.plateaux, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: SeafoodOrder;
} 