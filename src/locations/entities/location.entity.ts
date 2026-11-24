import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

// mysql returns DECIMAL as a string, so convert it back to a number
const decimal = { to: (v: number) => v, from: (v: string) => parseFloat(v) };

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn() locationId: number;
  @Column() vehicleId: number;
  @Column('decimal', { precision: 9, scale: 6, transformer: decimal }) latitude: number;
  @Column('decimal', { precision: 9, scale: 6, transformer: decimal }) longitude: number;
  @CreateDateColumn() recordedAt: Date;
  @ManyToOne(() => Vehicle, (v) => v.locations, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'vehicleId' }) vehicle: Vehicle;
}
