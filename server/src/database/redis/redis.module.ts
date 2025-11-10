import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

export type RedisClient = ReturnType<typeof createClient>;

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule { }
