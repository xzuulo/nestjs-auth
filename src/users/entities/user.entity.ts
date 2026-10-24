import { PrimaryGeneratedColumn, Column, Entity, Unique } from 'typeorm';
import { Role } from '../role.enum.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  email: string;
  @Column()
  passwordHash: string;
  @Column()
  role: Role;
  @Column({ nullable: true })
  refreshTokenHash: string;
}
