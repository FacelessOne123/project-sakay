import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isRowReferencedError } from '../common/utils/database-error.util';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route } from './entities/route.entity';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routesRepository: Repository<Route>,
  ) {}

  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    const route = this.routesRepository.create(createRouteDto);
    return this.routesRepository.save(route);
  }

  findAll(): Promise<Route[]> {
    return this.routesRepository.find({ order: { routeId: 'ASC' } });
  }

  async findOne(routeId: number): Promise<Route> {
    const route = await this.routesRepository.findOne({ where: { routeId } });
    if (!route) {
      throw new NotFoundException(`Route with id ${routeId} was not found`);
    }
    return route;
  }

  async update(
    routeId: number,
    updateRouteDto: UpdateRouteDto,
  ): Promise<Route> {
    const route = await this.findOne(routeId);
    Object.assign(route, updateRouteDto);
    return this.routesRepository.save(route);
  }

  async remove(routeId: number): Promise<{ deleted: true; routeId: number }> {
    const route = await this.findOne(routeId);

    try {
      await this.routesRepository.remove(route);
    } catch (error) {
      if (isRowReferencedError(error)) {
        throw new ConflictException(
          'This route is referenced by vehicles or queues and cannot be deleted',
        );
      }
      throw error;
    }

    return { deleted: true, routeId };
  }
}
