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
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { UpdateDispatchDto } from './dto/update-dispatch.dto';
import { DispatchesService } from './dispatches.service';

@UseGuards(JwtAuthGuard)
@Controller('dispatches')
export class DispatchesController {
  constructor(private readonly dispatchesService: DispatchesService) {}

  @Post()
  create(@Body() createDispatchDto: CreateDispatchDto) {
    return this.dispatchesService.create(createDispatchDto);
  }

  @Get()
  findAll() {
    return this.dispatchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dispatchesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDispatchDto: UpdateDispatchDto,
  ) {
    return this.dispatchesService.update(id, updateDispatchDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.dispatchesService.remove(id);
  }
}
