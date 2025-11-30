import { Module } from '@nestjs/common';
import { AbsensiService } from './absensi.service';
import { AbsensiController } from './absensi.controller';

@Module({
  controllers: [AbsensiController],
  providers: [AbsensiService],
})
export class AbsensiModule {}
