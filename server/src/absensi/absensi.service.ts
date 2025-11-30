import { Injectable } from '@nestjs/common';
import { CreateAbsensiDto } from './dto/create-absensi.dto';
import { UpdateAbsensiDto } from './dto/update-absensi.dto';

@Injectable()
export class AbsensiService {
  create(createAbsensiDto: CreateAbsensiDto) {
    return 'This action adds a new absensi';
  }

  findAll() {
    return `This action returns all absensi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} absensi`;
  }

  update(id: number, updateAbsensiDto: UpdateAbsensiDto) {
    return `This action updates a #${id} absensi`;
  }

  remove(id: number) {
    return `This action removes a #${id} absensi`;
  }
}
