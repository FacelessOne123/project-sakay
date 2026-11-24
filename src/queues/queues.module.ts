import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './entities/queue.entity';
import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { QueuesController } from './queues.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Queue])],
  controllers: [QueuesController],
  providers: [QueuesService],
})
export class QueuesModule {}
