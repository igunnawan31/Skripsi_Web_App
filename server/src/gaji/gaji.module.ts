import { Module } from '@nestjs/common';
import { GajiController } from './presentation/gaji.controller';
import { IGajiRepository } from './domain/repositories/gaji.repository.interface';

@Module({
  imports: [GajiModule],
  controllers: [GajiController],
  providers: [],
  exports: [IGajiRepository],
})
export class GajiModule {}
