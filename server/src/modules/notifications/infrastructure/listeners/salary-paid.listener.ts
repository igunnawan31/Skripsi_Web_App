import { Injectable } from "@nestjs/common";
import { CreateNotificationUseCase } from "../../application/use-cases/create-notifications.use-cases";
import { OnEvent } from "@nestjs/event-emitter";
import { SalaryUpdateEvent } from "src/modules/salary/application/events/gaji.events";
import { CreateNotificationDTO } from "../../application/dtos/request/create-notifications.dto";
import { LoggerService } from "src/modules/logger/logger.service";

@Injectable()
export class SalaryPaidListener {
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly logger: LoggerService,
  ) {}

  @OnEvent('salary.paid')
  async handleSalaryPaid(event: SalaryUpdateEvent){
    try {
      console.log('salary paid invoked')
      const payload: CreateNotificationDTO = {
        userId: event.userId,
        title: 'Gaji Paid',
        category: 'Gaji',
        content: 'Gaji sudah dibayarkan',
      }
      await this.createNotificationUseCase.execute(payload);
      return;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
