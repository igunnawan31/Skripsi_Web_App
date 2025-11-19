import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GajiService } from './gaji.service';
import { CreateGajiDto } from './dto/create-gaji.dto';
import { UpdateGajiDto } from './dto/update-gaji.dto';

@Controller('gaji')
export class GajiController {
  constructor(private readonly gajiService: GajiService) {}

  @Post()
  create(@Body() createGajiDto: CreateGajiDto) {
    return this.gajiService.create(createGajiDto);
  }

  @Get()
  findAll() {
    return this.gajiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gajiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGajiDto: UpdateGajiDto) {
    return this.gajiService.update(+id, updateGajiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gajiService.remove(+id);
  }
}
