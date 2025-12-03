import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { IGajiRepository } from '../domain/repositories/gaji.repository.interface';
import { GajiFilterDTO } from '../application/dtos/request/gaji-filter.dto';
import { UpdateGajiDTO } from '../application/dtos/request/update-gaji.dto';
import { MinorRole } from '@prisma/client';
import { RolesMinor } from 'src/common/decorators/minor-role.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('gaji')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class GajiController {
  constructor(private readonly gajiRepo: IGajiRepository) {}

  // implement nanti kalau ada case gaji untuk non kontrak
  // @Post()
  // create(@Body() createGajiDto: CreateGajiDto) {
  //   return this.gajiService.create(createGajiDto);
  // }

  @Get()
  findAll(@Query() filters: GajiFilterDTO) {
    return this.gajiRepo.findAll(filters);
  }

  @Get('by-userId/:id')
  findByUserId(@Param('id') id: string, @Query() filters: GajiFilterDTO) {
    return this.gajiRepo.findByUserId(id, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gajiRepo.findById(id);
  }

  @Patch('/pay/:id')
  @RolesMinor(MinorRole.HR)
  paySalary(@Param('id') id: string){
    return this.gajiRepo.paySalary(id);
  }

  @Patch(':id')
  @RolesMinor(MinorRole.HR)
  update(@Param('id') id: string, @Body() updateGajiDto: UpdateGajiDTO) {
    return this.gajiRepo.update(id, updateGajiDto);
  }

  @Delete(':id')
  @RolesMinor(MinorRole.HR)
  remove(@Param('id') id: string) {
    return this.gajiRepo.remove(id);
  }
}
