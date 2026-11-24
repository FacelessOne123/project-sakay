import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from '../queues/entities/queue.entity';
import { User } from '../users/entities/user.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { UpdateDispatchDto } from './dto/update-dispatch.dto';
import { Dispatch } from './entities/dispatch.entity';

@Injectable()
export class DispatchesService {
  constructor(
    @InjectRepository(Dispatch)
    private readonly dispatchesRepository: Repository<Dispatch>,
    @InjectRepository(Queue)
    private readonly queuesRepository: Repository<Queue>,
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private async assertQueueExists(queueId: number): Promise<void> {
    const queue = await this.queuesRepository.findOne({ where: { queueId } });
    if (!queue) {
      throw new BadRequestException(
        `queueId ${queueId} does not reference an existing queue`,
      );
    }
  }

  private async getVehicleOrFail(vehicleId: number): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { vehicleId },
    });
    if (!vehicle) {
      throw new BadRequestException(
        `vehicleId ${vehicleId} does not reference an existing vehicle`,
      );
    }
    return vehicle;
  }

  private async assertDispatcherExists(dispatcherId: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { userId: dispatcherId },
    });
    if (!user) {
      throw new BadRequestException(
        `dispatcherId ${dispatcherId} does not reference an existing user`,
      );
    }
  }

  private assertCapacity(vehicle: Vehicle, passengerCount: number): void {
    if (passengerCount > vehicle.capacity) {
      throw new BadRequestException(
        `passengerCount ${passengerCount} exceeds the vehicle capacity of ${vehicle.capacity}`,
      );
    }
  }

  private findEntity(dispatchId: number): Promise<Dispatch | null> {
    return this.dispatchesRepository.findOne({
      where: { dispatchId },
      relations: { queue: true, vehicle: true, dispatcher: true },
    });
  }

  async create(createDispatchDto: CreateDispatchDto): Promise<Dispatch> {
    const [, vehicle] = await Promise.all([
      this.assertQueueExists(createDispatchDto.queueId),
      this.getVehicleOrFail(createDispatchDto.vehicleId),
      this.assertDispatcherExists(createDispatchDto.dispatcherId),
    ]);

    this.assertCapacity(vehicle, createDispatchDto.passengerCount);

    const dispatch = this.dispatchesRepository.create(createDispatchDto);
    const saved = await this.dispatchesRepository.save(dispatch);
    return this.findOne(saved.dispatchId);
  }

  findAll(): Promise<Dispatch[]> {
    return this.dispatchesRepository.find({
      relations: { queue: true, vehicle: true, dispatcher: true },
      order: { dispatchId: 'ASC' },
    });
  }

  async findOne(dispatchId: number): Promise<Dispatch> {
    const dispatch = await this.findEntity(dispatchId);
    if (!dispatch) {
      throw new NotFoundException(
        `Dispatch with id ${dispatchId} was not found`,
      );
    }
    return dispatch;
  }

  async update(
    dispatchId: number,
    updateDispatchDto: UpdateDispatchDto,
  ): Promise<Dispatch> {
    const dispatch = await this.findOne(dispatchId);

    if (
      updateDispatchDto.queueId !== undefined &&
      updateDispatchDto.queueId !== dispatch.queueId
    ) {
      await this.assertQueueExists(updateDispatchDto.queueId);
    }
    if (
      updateDispatchDto.dispatcherId !== undefined &&
      updateDispatchDto.dispatcherId !== dispatch.dispatcherId
    ) {
      await this.assertDispatcherExists(updateDispatchDto.dispatcherId);
    }

    const vehicleId = updateDispatchDto.vehicleId ?? dispatch.vehicleId;
    const vehicle = await this.getVehicleOrFail(vehicleId);
    const passengerCount =
      updateDispatchDto.passengerCount ?? dispatch.passengerCount;
    this.assertCapacity(vehicle, passengerCount);

    Object.assign(dispatch, updateDispatchDto);
    await this.dispatchesRepository.save(dispatch);
    return this.findOne(dispatchId);
  }

  async remove(
    dispatchId: number,
  ): Promise<{ deleted: true; dispatchId: number }> {
    const dispatch = await this.findOne(dispatchId);
    await this.dispatchesRepository.remove(dispatch);
    return { deleted: true, dispatchId };
  }
}
