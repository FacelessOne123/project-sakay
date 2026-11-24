import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Route } from '../../routes/entities/route.entity';
import { Dispatch } from '../../dispatches/entities/dispatch.entity';
import { Location } from '../../locations/entities/location.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn() vehicleId: number;
  @Column({ length: 20, unique: true }) plateNumber: string;
  @Column({ length: 50 }) vehicleType: string;
  @Column('int') capacity: number;
  @Column({ length: 20, default: 'Available' }) status: string;
  @Column() routeId: number;
  @ManyToOne(() => Route, (r) => r.vehicles, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'routeId' }) route: Route;
  @OneToMany(() => Dispatch, (d) => d.vehicle) dispatches: Dispatch[];
  @OneToMany(() => Location, (l) => l.vehicle) locations: Location[];
}
