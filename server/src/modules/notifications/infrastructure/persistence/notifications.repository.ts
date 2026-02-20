import { PrismaService } from 'src/modules/database/prisma/prisma.service';
import { INotificationRepository } from '../../domain/repositories/notifications.repository.interface';
import { RetrieveNotificationResponseDTO } from '../../application/dtos/response/read-response.dto';
import { CreateNotificationResponseDTO } from '../../application/dtos/response/create-response.dto';
import { CreateNotificationDTO } from '../../application/dtos/request/create-notifications.dto';
import { handlePrismaError } from 'src/common/errors/prisma-exception';
import { LoggerService } from 'src/modules/logger/logger.service';
import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async findAll(
    userId: string,
  ): Promise<RetrieveNotificationResponseDTO[] | null> {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          userId,
        },
      });
      if (!notifications) return null;
      return notifications.map((n) =>
        plainToInstance(RetrieveNotificationResponseDTO, n),
      );
    } catch (err) {
      handlePrismaError(err, 'Notification', '', this.logger);
    }
  }
  async findById(id: string): Promise<RetrieveNotificationResponseDTO | null> {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: {
          id,
        },
      });
      if (!notification) return null;
      return plainToInstance(RetrieveNotificationResponseDTO, notification)
    } catch (err) {
      handlePrismaError(err, 'Notification', id, this.logger);
    }
  }
  async create(
    data: CreateNotificationDTO,
  ): Promise<CreateNotificationResponseDTO> {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId: data.userId,
          title: data.title,
          category: data.category,
          content: data.content,
        }
      });
      return plainToInstance(RetrieveNotificationResponseDTO, notification)
    } catch (err) {
      handlePrismaError(err, 'Notification', '', this.logger);
    }
  }
  async remove(id: string): Promise<void> {
    try {
      await this.prisma.notification.delete({
        where: {
          id,
        }
      });
    } catch (err) {
      handlePrismaError(err, 'Notification', id, this.logger);
    }
  }
}
