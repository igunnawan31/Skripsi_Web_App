import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { LoggerService } from './modules/logger/logger.service';
import { config as loadEnv } from 'dotenv';
import { HttpAdapterHost } from '@nestjs/core';

loadEnv({ path: '../../.env' }); // load env dari root monorepo

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfig = app.get(ConfigService);
  const { httpAdapter } = app.get(HttpAdapterHost);

  const port = Number(appConfig.getOrThrow<number>('PORT'));

  // Logger
  app.useLogger(app.get(LoggerService));

  // CORS
  app.enableCors({
    origin: appConfig.get<string>('CORS_ORIGIN')?.split(',') ?? [],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global Interceptors
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );

  // Global Filters
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
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
