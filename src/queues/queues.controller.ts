import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { QueuesService } from './queues.service';

@UseGuards(JwtAuthGuard)
@Controller('queues')
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}

  @Post()
  create(@Body() createQueueDto: CreateQueueDto) {
    return this.queuesService.create(createQueueDto);
  }

  @Get()
  findAll() {
    return this.queuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.queuesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQueueDto: UpdateQueueDto,
  ) {
    return this.queuesService.update(id, updateQueueDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.queuesService.remove(id);
  }
}
