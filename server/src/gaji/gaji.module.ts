import { Module } from '@nestjs/common';
import { GajiController } from './presentation/gaji.controller';
import { IGajiRepository } from './domain/repositories/gaji.repository.interface';
import { GajiValidationService } from './domain/services/gaji-validation.service';
import { GajiSchedulingService } from './domain/services/gaji-scheduling.service';
import { GajiRepository } from './infrastructure/persistence/gaji.repository';

@Module({
  imports: [GajiModule],
  controllers: [GajiController],
  providers: [
    GajiValidationService,
    GajiSchedulingService,
    { provide: IGajiRepository, useClass: GajiRepository },
  ],
  exports: [IGajiRepository],
})
export class GajiModule { }
