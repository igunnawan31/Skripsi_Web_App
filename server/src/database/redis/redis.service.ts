import { Injectable, Inject } from '@nestjs/common';
import { RedisClient } from './redis.module';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private client: RedisClient;

  constructor(private readonly config: ConfigService) { }

  async onModuleInit() {
    this.client = createClient({
      socket: {
        host: this.config.getOrThrow<string>('REDIS_HOST'),
        port: this.config.getOrThrow<number>('REDIS_PORT'),
      },
      password: this.config.get<string>('REDIS_PASSWORD'),
      database: this.config.get<number>('REDIS_DB') || 0,
    });

    this.client.on('connect', () => console.log('Redis Connected'));
    this.client.on('ready', () => console.log('Redis Ready'));
    this.client.on('error', (err) => console.error('Redis Error:', err));
    this.client.on('end', () => console.log('Redis Disconnected'));

    await this.client.connect();
    console.log('Redis client connected successfully');
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      console.log('Redis client disconnected');
    }
  }

  getClient(): RedisClient {
    if (!this.client || !this.client.isReady) {
      throw new Error('Redis client is not ready');
    }
    return this.client;
  }
}
