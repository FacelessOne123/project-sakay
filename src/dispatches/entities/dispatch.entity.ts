import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Queue } from '../../queues/entities/queue.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { User } from '../../users/entities/user.entity';

@Entity('dispatches')
export class Dispatch {
  @PrimaryGeneratedColumn() dispatchId: number;
  @Column() queueId: number;
  @Column() vehicleId: number;
  @Column() dispatcherId: number;
  @CreateDateColumn() dispatchTime: Date;
  @Column('int') passengerCount: number;
  @Column({ length: 20, default: 'Dispatched' }) status: string;
  @ManyToOne(() => Queue, (q) => q.dispatches, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'queueId' }) queue: Queue;
  @ManyToOne(() => Vehicle, (v) => v.dispatches, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'vehicleId' }) vehicle: Vehicle;
  @ManyToOne(() => User, (u) => u.dispatches, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'dispatcherId' }) dispatcher: User;
}
