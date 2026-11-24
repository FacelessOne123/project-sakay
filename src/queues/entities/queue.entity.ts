import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Route } from '../../routes/entities/route.entity';
import { Dispatch } from '../../dispatches/entities/dispatch.entity';

@Entity('queues')
export class Queue {
  @PrimaryGeneratedColumn() queueId: number;
  @Column() userId: number;
  @Column() routeId: number;
  @Column('int') queueNumber: number;
  @CreateDateColumn() dateCreated: Date;
  @Column('int', { default: 0 }) estimatedWaitTime: number; // minutes
  @Column({ length: 20, default: 'Waiting' }) status: string;
  @ManyToOne(() => User, (u) => u.queues, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' }) user: User;
  @ManyToOne(() => Route, (r) => r.queues, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'routeId' }) route: Route;
  @OneToMany(() => Dispatch, (d) => d.queue) dispatches: Dispatch[];
}
