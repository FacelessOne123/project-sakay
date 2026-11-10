import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DispatchesService } from './dispatches.service';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { UpdateDispatchDto } from './dto/update-dispatch.dto';

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
  findOne(@Param('id') id: string) {
    return this.dispatchesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDispatchDto: UpdateDispatchDto) {
    return this.dispatchesService.update(+id, updateDispatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dispatchesService.remove(+id);
  }
}
