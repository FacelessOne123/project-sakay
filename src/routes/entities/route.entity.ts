import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Queue } from '../../queues/entities/queue.entity';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn() routeId: number;
  @Column({ length: 100 }) routeName: string;
  @Column({ length: 150 }) origin: string;
  @Column({ length: 150 }) destination: string;
  @Column('int') estimatedTravelTime: number; // minutes
  @OneToMany(() => Vehicle, (v) => v.route) vehicles: Vehicle[];
  @OneToMany(() => Queue, (q) => q.route) queues: Queue[];
}
