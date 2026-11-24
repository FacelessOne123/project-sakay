import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  isDuplicateEntry,
  isRowReferencedError,
} from '../common/utils/database-error.util';
import { Route } from '../routes/entities/route.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(Route)
    private readonly routesRepository: Repository<Route>,
  ) {}

  private async assertRouteExists(routeId: number): Promise<void> {
    const route = await this.routesRepository.findOne({ where: { routeId } });
    if (!route) {
      throw new BadRequestException(
        `routeId ${routeId} does not reference an existing route`,
      );
    }
  }

  private async findEntity(vehicleId: number): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { vehicleId },
      relations: { route: true },
    });
    if (!vehicle) {
      throw new NotFoundException(
        `Vehicle with id ${vehicleId} was not found`,
      );
    }
    return vehicle;
  }

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    await this.assertRouteExists(createVehicleDto.routeId);

    const vehicle = this.vehiclesRepository.create(createVehicleDto);
    try {
      const saved = await this.vehiclesRepository.save(vehicle);
      return this.findEntity(saved.vehicleId);
    } catch (error) {
      if (isDuplicateEntry(error)) {
        throw new ConflictException(
          `A vehicle with plate number ${createVehicleDto.plateNumber} already exists`,
        );
      }
      throw error;
    }
  }

  findAll(): Promise<Vehicle[]> {
    return this.vehiclesRepository.find({
      relations: { route: true },
      order: { vehicleId: 'ASC' },
    });
  }

  findOne(vehicleId: number): Promise<Vehicle> {
    return this.findEntity(vehicleId);
  }

  async update(
    vehicleId: number,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const vehicle = await this.findEntity(vehicleId);

    if (
      updateVehicleDto.routeId !== undefined &&
      updateVehicleDto.routeId !== vehicle.routeId
    ) {
      await this.assertRouteExists(updateVehicleDto.routeId);
    }

    Object.assign(vehicle, updateVehicleDto);

    try {
      await this.vehiclesRepository.save(vehicle);
      return this.findEntity(vehicleId);
    } catch (error) {
      if (isDuplicateEntry(error)) {
        throw new ConflictException('A vehicle with this plate number already exists');
      }
      throw error;
    }
  }

  async remove(
    vehicleId: number,
  ): Promise<{ deleted: true; vehicleId: number }> {
    const vehicle = await this.findEntity(vehicleId);

    try {
      await this.vehiclesRepository.remove(vehicle);
    } catch (error) {
      if (isRowReferencedError(error)) {
        throw new ConflictException(
          'This vehicle is referenced by dispatches or locations and cannot be deleted',
        );
      }
      throw error;
    }

    return { deleted: true, vehicleId };
  }
}
