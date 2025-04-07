import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('wines')
export class Wine {
  @ApiProperty({
    description: 'Identifiant unique du vin',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nom du vin',
    example: 'Côtes du Rhône'
  })
  @Column()
  name: string;
  
  @ApiProperty({
    description: 'Région du vin',
    example: 'Vallée du Rhône'
  })
  @Column()
  region: string;

  @ApiProperty({
    description: 'Prix de la bouteille',
    example: '28€'
  })
  @Column()
  bottlePrice: string;
  
  @ApiProperty({
    description: 'Prix du verre (optionnel)',
    example: '6€',
    required: false
  })
  @Column({ nullable: true })
  glassPrice: string;
  
  @ApiProperty({
    description: 'Catégorie du vin',
    example: 'rouges',
    enum: ['rouges', 'blancs', 'roses', 'champagnes']
  })
  @Column()
  category: string;
} 