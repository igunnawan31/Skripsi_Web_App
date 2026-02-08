import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createClient } from 'redis';
import { ScheduleModule } from '@nestjs/schedule';
import { FilesModule } from './modules/files/files.module';
import { ReimburseModule } from './modules/reimburse/reimburse.module';
import { RedisModule } from './modules/database/redis/redis.module';
import { LoggerModule } from './modules/logger/logger.module';
import { PrismaModule } from './modules/database/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CutiModule } from './modules/cuti/cuti.module';
import { AbsensiModule } from './modules/absensi/absensi.module';
import { KontrakModule } from './modules/kontrak/kontrak.module';
import { ProjectModule } from './modules/project/project.module';
import { AgendaModule } from './modules/agenda/agenda.module';
import { SalaryModule } from './modules/salary/salary.module';
import { KpiModule } from './modules/kpi/kpi.module';

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
    SalaryModule,
    ProjectModule,
    KpiModule,
    ReimburseModule,
    AgendaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
