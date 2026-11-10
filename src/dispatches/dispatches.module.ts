import { Module } from '@nestjs/common';
import { DispatchesService } from './dispatches.service';
import { DispatchesController } from './dispatches.controller';

@Module({
  controllers: [DispatchesController],
  providers: [DispatchesService],
})
export class DispatchesModule {}
