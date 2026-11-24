import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from '../routes/entities/route.entity';
import { User } from '../users/entities/user.entity';
import { Queue } from './entities/queue.entity';
import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { QueuesController } from './queues.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Queue, User, Route])],
  controllers: [QueuesController],
  providers: [QueuesService],
})
export class QueuesModule {}
