import {
  BadGatewayException,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';

export function handleRedisError(error: unknown, logger?: LoggerService): never {
  if (logger) logger.error(error, 'RedisHandler');

  if (error instanceof Error) {
    if (error.message.includes('ECONNREFUSED')) {
      throw new ServiceUnavailableException('Redis connection refused');
    }

    if (error.message.includes('ETIMEDOUT')) {
      throw new BadGatewayException('Redis connection timed out');
    }

    if (error.message.includes('WRONGTYPE')) {
      throw new BadGatewayException('Redis operation type mismatch');
    }

    throw new InternalServerErrorException(`Redis error: ${error.message}`);
  }

  throw new InternalServerErrorException('Unknown Redis error occurred');
}

