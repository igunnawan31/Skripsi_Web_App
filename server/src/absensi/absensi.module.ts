import { Module } from '@nestjs/common';
import { AbsensiController } from './presentation/absensi.controller';
import { CheckInUseCase } from './application/use-cases/check-in.use-case';
import { CheckOutUseCase } from './application/use-cases/check-out.use-case.dto';
import { AbsensiValidationService } from './domain/services/absensi-validation.service';
import { IAbsensiRepository } from './domain/repositories/absensi.repository.interface';
import { AbsensiRepository } from './infrastructure/persistence/absensi.repository';

@Module({
  imports: [AbsensiModule],
  controllers: [AbsensiController],
  providers: [
    CheckInUseCase,
    CheckOutUseCase,
    AbsensiValidationService,
    { provide: IAbsensiRepository, useClass: AbsensiRepository },
  ],
  exports: [IAbsensiRepository],
})
export class AbsensiModule { }
