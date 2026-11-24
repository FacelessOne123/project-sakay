import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Queue } from '../../queues/entities/queue.entity';
import { Dispatch } from '../../dispatches/entities/dispatch.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn() userId: number;
  @Column({ length: 100 }) fullName: string;
  @Column({ length: 100, unique: true }) email: string;
  @Column({ length: 255, select: false }) passwordHash: string;
  @Column({ length: 30 }) role: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) phoneNumber: string | null;
  @OneToMany(() => Queue, (q) => q.user) queues: Queue[];
  @OneToMany(() => Dispatch, (d) => d.dispatcher) dispatches: Dispatch[];
}
