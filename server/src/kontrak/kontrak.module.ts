import { Module } from '@nestjs/common';

@Module({
  controllers: [KontrakController],
  providers: [KontrakService],
})
export class KontrakModule {}
