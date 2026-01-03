import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { LoggerService } from 'src/modules/logger/logger.service';

export function handlePrismaError(
  error: unknown,
  entityName = 'Record',
  id?: string | number,
  logger?: LoggerService,
): never {
  if (logger) logger.error(error, 'PrismaHandler');

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictException(`${entityName} already exists`);
      case 'P2003':
        throw new BadRequestException(
          `Invalid foreign key reference for ${entityName}`,
        );
      case 'P2025':
        throw new NotFoundException(
          `${entityName} with id ${id ?? 'unknown'} not found`,
        );
      default:
        throw new InternalServerErrorException(
          `Unhandled Prisma error (${error.code}): ${error.message}`,
        );
    }
  }

  if (error instanceof PrismaClientValidationError) {
    throw new BadRequestException(
      `${entityName} validation failed: ${error.message}`,
    );
  }

  const message =
    error instanceof Error
      ? `${entityName} database operation failed: ${error.message}`
      : `${entityName} database operation failed`;

  throw new InternalServerErrorException(message);
}

