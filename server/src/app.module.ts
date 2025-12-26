import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerService } from './logger/logger.service';
import { PrismaModule } from './database/prisma/prisma.module';
import { RedisModule } from './database/redis/redis.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createClient } from 'redis';
import { LoggerModule } from './logger/logger.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CutiModule } from './cuti/cuti.module';
import { AbsensiModule } from './absensi/absensi.module';
import { KontrakModule } from './kontrak/kontrak.module';
import { GajiModule } from './gaji/gaji.module';
import { ProjectModule } from './project/project.module';
import { KpiModule } from './kpi/kpi.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
    }),
    RedisModule,
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // const redisClient = redisService.getClient();
        const redisClient = createClient({
          socket: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
          },
          password: configService.get<string>('REDIS_PASSWORD'),
          database: configService.get<number>('REDIS_DB') || 0,
        });

        redisClient.on('error', (err) => {
          console.error('Redis cache client error:', err);
        });

        await redisClient.connect();
        return {
          store: {
            get: async (key: string) => {
              const data = await redisClient.get(key);
              return data ? JSON.parse(data) : null;
            },
            set: async (key: string, value: any, ttl?: number) => {
              const payload = JSON.stringify(value);
              if (ttl) {
                const seconds = Math.ceil(ttl / 1000);
                await redisClient.setEx(key, seconds, payload); // Note: setEx (capital E)
              } else {
                await redisClient.set(key, payload);
              }
            },
            del: async (key: string) => {
              await redisClient.del(key);
            },
          },
        };
      },
    }),
    ScheduleModule.forRoot(),
    LoggerModule,
    FilesModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    CutiModule,
    AbsensiModule,
    KontrakModule,
    GajiModule,
    ProjectModule,
    KpiModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})
export class AppModule { }
