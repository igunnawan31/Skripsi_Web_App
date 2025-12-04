import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IKPIRepository } from '../domain/repositories/kpi.repository.interface';

@Controller('kpi')
export class KpiController {
  constructor(private readonly kpiRepo: IKPIRepository) {}

  // @Post()
  // create(@Body() createKpiDto: CreateKpiDT) {
  //   return this.kpiRepo.create(createKpiDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.kpiRepo.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.kpiRepo.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateKpiDto: UpdateKpiDto) {
  //   return this.kpiRepo.update(+id, updateKpiDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.kpiRepo.remove(+id);
  // }
}
