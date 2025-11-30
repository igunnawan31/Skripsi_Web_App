import { Module } from '@nestjs/common';
import { CutiService } from './cuti.service';
import { CutiController } from './cuti.controller';

@Module({
  controllers: [CutiController],
  providers: [CutiService],
})
export class CutiModule {}
