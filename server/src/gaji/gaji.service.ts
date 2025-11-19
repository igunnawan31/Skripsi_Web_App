import { Injectable } from '@nestjs/common';
import { CreateGajiDto } from './dto/create-gaji.dto';
import { UpdateGajiDto } from './dto/update-gaji.dto';

@Injectable()
export class GajiService {
  create(createGajiDto: CreateGajiDto) {
    return 'This action adds a new gaji';
  }

  findAll() {
    return `This action returns all gaji`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gaji`;
  }

  update(id: number, updateGajiDto: UpdateGajiDto) {
    return `This action updates a #${id} gaji`;
  }

  remove(id: number) {
    return `This action removes a #${id} gaji`;
  }
}
