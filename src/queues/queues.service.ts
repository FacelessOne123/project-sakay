import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isRowReferencedError } from '../common/utils/database-error.util';
import { Route } from '../routes/entities/route.entity';
import { User } from '../users/entities/user.entity';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { Queue } from './entities/queue.entity';

@Injectable()
export class QueuesService {
  constructor(
    @InjectRepository(Queue)
    private readonly queuesRepository: Repository<Queue>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Route)
    private readonly routesRepository: Repository<Route>,
  ) {}

  private async assertUserExists(userId: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) {
      throw new BadRequestException(
        `userId ${userId} does not reference an existing user`,
      );
    }
  }

  private async assertRouteExists(routeId: number): Promise<void> {
    const route = await this.routesRepository.findOne({ where: { routeId } });
    if (!route) {
      throw new BadRequestException(
        `routeId ${routeId} does not reference an existing route`,
      );
    }
  }

  private findEntity(queueId: number): Promise<Queue | null> {
    return this.queuesRepository.findOne({
      where: { queueId },
      relations: { user: true, route: true },
    });
  }

  async create(createQueueDto: CreateQueueDto): Promise<Queue> {
    await Promise.all([
      this.assertUserExists(createQueueDto.userId),
      this.assertRouteExists(createQueueDto.routeId),
    ]);

    const queue = this.queuesRepository.create(createQueueDto);
    const saved = await this.queuesRepository.save(queue);
    return this.findOne(saved.queueId);
  }

  findAll(): Promise<Queue[]> {
    return this.queuesRepository.find({
      relations: { user: true, route: true },
      order: { queueId: 'ASC' },
    });
  }

  async findOne(queueId: number): Promise<Queue> {
    const queue = await this.findEntity(queueId);
    if (!queue) {
      throw new NotFoundException(`Queue with id ${queueId} was not found`);
    }
    return queue;
  }

  async update(
    queueId: number,
    updateQueueDto: UpdateQueueDto,
  ): Promise<Queue> {
    const queue = await this.findOne(queueId);

    if (
      updateQueueDto.userId !== undefined &&
      updateQueueDto.userId !== queue.userId
    ) {
      await this.assertUserExists(updateQueueDto.userId);
    }
    if (
      updateQueueDto.routeId !== undefined &&
      updateQueueDto.routeId !== queue.routeId
    ) {
      await this.assertRouteExists(updateQueueDto.routeId);
    }

    Object.assign(queue, updateQueueDto);
    await this.queuesRepository.save(queue);
    return this.findOne(queueId);
  }

  async remove(queueId: number): Promise<{ deleted: true; queueId: number }> {
    const queue = await this.findOne(queueId);

    try {
      await this.queuesRepository.remove(queue);
    } catch (error) {
      if (isRowReferencedError(error)) {
        throw new ConflictException(
          'This queue is referenced by dispatches and cannot be deleted',
        );
      }
      throw error;
    }

    return { deleted: true, queueId };
  }
}
