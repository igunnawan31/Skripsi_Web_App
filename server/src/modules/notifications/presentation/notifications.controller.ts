import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { GetAllNotificationsUseCase } from '../application/use-cases/get-all-notifications.use-case';
import { GetNotificationUseCase } from '../application/use-cases/get-notification.use-case';
import { DeleteNotificationsUseCase } from '../application/use-cases/delete-notifications.use-case';
import { UserRequest } from 'src/common/types/UserRequest.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly getAllNotificationsUseCase: GetAllNotificationsUseCase,
    private readonly getNotificationUseCase: GetNotificationUseCase,
    private readonly deleteNotificationUseCase: DeleteNotificationsUseCase,
  ) {}

  @Get()
  findAll(@Req() req: Request & { user: UserRequest }) {
    return this.getAllNotificationsUseCase.execute(req.user.id);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.getNotificationUseCase.execute(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteNotificationUseCase.execute(id);
  }
}
