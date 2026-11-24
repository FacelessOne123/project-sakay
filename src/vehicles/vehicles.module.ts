import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from '../routes/entities/route.entity';
import { Vehicle } from './entities/vehicle.entity';
import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Route])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
