import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
  ) {}

  private async assertVehicleExists(vehicleId: number): Promise<void> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { vehicleId },
    });
    if (!vehicle) {
      throw new BadRequestException(
        `vehicleId ${vehicleId} does not reference an existing vehicle`,
      );
    }
  }

  private findEntity(locationId: number): Promise<Location | null> {
    return this.locationsRepository.findOne({
      where: { locationId },
      relations: { vehicle: true },
    });
  }

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    await this.assertVehicleExists(createLocationDto.vehicleId);

    const location = this.locationsRepository.create(createLocationDto);
    const saved = await this.locationsRepository.save(location);
    return this.findOne(saved.locationId);
  }

  findAll(): Promise<Location[]> {
    return this.locationsRepository.find({
      relations: { vehicle: true },
      order: { locationId: 'ASC' },
    });
  }

  async findOne(locationId: number): Promise<Location> {
    const location = await this.findEntity(locationId);
    if (!location) {
      throw new NotFoundException(
        `Location with id ${locationId} was not found`,
      );
    }
    return location;
  }

  async update(
    locationId: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.findOne(locationId);

    if (
      updateLocationDto.vehicleId !== undefined &&
      updateLocationDto.vehicleId !== location.vehicleId
    ) {
      await this.assertVehicleExists(updateLocationDto.vehicleId);
    }

    Object.assign(location, updateLocationDto);
    await this.locationsRepository.save(location);
    return this.findOne(locationId);
  }

  async remove(
    locationId: number,
  ): Promise<{ deleted: true; locationId: number }> {
    const location = await this.findOne(locationId);
    await this.locationsRepository.remove(location);
    return { deleted: true, locationId };
  }
}
