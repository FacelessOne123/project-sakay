import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispatch } from './entities/dispatch.entity';
import { Module } from '@nestjs/common';
import { DispatchesService } from './dispatches.service';
import { DispatchesController } from './dispatches.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dispatch])],
  controllers: [DispatchesController],
  providers: [DispatchesService],
})
export class DispatchesModule {}
