import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class Users {
  @ApiProperty({ example: 1, description: 'Identifiant unique de l\'utilisateur' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Nom de l\'utilisateur' })
  @Column()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email de l\'utilisateur' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'hashed_password', description: 'Mot de passe hashé' })
  @Column()
  password: string;

  @ApiProperty({ example: 'user', description: 'Rôle de l\'utilisateur (user ou admin)' })
  @Column({ default: 'user' })
  role: string;

  @ApiProperty({ example: '0612345678', description: 'Numéro de téléphone de l\'utilisateur' })
  @Column({ nullable: true, name: 'phone_number' })
  phone_number: string;

  @ApiProperty({ example: '2023-03-25T10:30:00Z', description: 'Date de création du compte' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2023-03-25T10:30:00Z', description: 'Date de dernière mise à jour du compte' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 