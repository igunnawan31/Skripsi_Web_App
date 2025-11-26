import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KontrakService } from './kontrak.service';
import { CreateKontrakDto } from './dto/create-kontrak.dto';
import { UpdateKontrakDto } from './dto/update-kontrak.dto';

@Controller('kontrak')
export class KontrakController {
  constructor(private readonly kontrakService: KontrakService) {}

  @Post()
  create(@Body() createKontrakDto: CreateKontrakDto) {
    return this.kontrakService.create(createKontrakDto);
  }

  @Get()
  findAll() {
    return this.kontrakService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kontrakService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKontrakDto: UpdateKontrakDto) {
    return this.kontrakService.update(+id, updateKontrakDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kontrakService.remove(+id);
  }
}
