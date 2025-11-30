import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubmitCutiUseCase } from '../application/use-cases/submit-cuti.use-case';
import { ICutiRepository } from '../domain/repositories/cuti.repository.interface';

@Controller('cuti')
export class CutiController {
  constructor(
    private readonly cutiRepo: ICutiRepository,
    private readonly submitCutiUseCase: SubmitCutiUseCase,
  ) {}

  @Post()
  create(@Body() createCutiDto: CreateCutiDto) {
    return this.cutiService.create(createCutiDto);
  }

  @Get()
  findAll() {
    return this.cutiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cutiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCutiDto: UpdateCutiDto) {
    return this.cutiService.update(+id, updateCutiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cutiService.remove(+id);
  }
}
