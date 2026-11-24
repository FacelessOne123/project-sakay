import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Location } from './entities/location.entity';
import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Vehicle])],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
