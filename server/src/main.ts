import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger/logger.service';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import passport from 'passport';
import { RedisService } from './database/redis/redis.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const port = Number(config.getOrThrow<number>('PORT'));
  const sessionSecretKey = config.getOrThrow<string>('SESSION_SECRET');
  const redisService = app.get(RedisService)
  await redisService.onModuleInit();
  const redisClient = redisService.getClient();

  app.useLogger(app.get(LoggerService));
  app.use(
    session({
      store: new RedisStore({
        client: redisClient as any,
        prefix: 'sess:',
        ttl: 86400, // 1d
        serializer: {
          parse: (s: string) => JSON.parse(s),
          stringify: (s: any) => JSON.stringify(s),
        },
      }),
      secret: sessionSecretKey,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: config.get('NODE_ENV') === 'production',
        httpOnly: true,
        sameSite: 'lax',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN')?.split(',') ?? [],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(port);
  console.log(`🚀 Server running at http://localhost:${port}`);
}
bootstrap().catch((err) => {
  console.error('Bootstrap Failed', err);
  process.exit(1);
});
