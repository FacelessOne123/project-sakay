import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from '../queues/entities/queue.entity';
import { User } from '../users/entities/user.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Dispatch } from './entities/dispatch.entity';
import { Module } from '@nestjs/common';
import { DispatchesService } from './dispatches.service';
import { DispatchesController } from './dispatches.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dispatch, Queue, Vehicle, User])],
  controllers: [DispatchesController],
  providers: [DispatchesService],
})
export class DispatchesModule {}
