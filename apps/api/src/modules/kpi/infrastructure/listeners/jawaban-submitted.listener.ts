import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/modules/logger/logger.service';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateIndikatorRecapUseCase } from '../../application/use-cases/rekap/create.use-case';
import { JawabanSubmitEvent } from '../../application/events/jawaban.events';

@Injectable()
export class JawabanSubmittedListener {
  constructor(
    private readonly createRekapUseCase: CreateIndikatorRecapUseCase,
    private readonly logger: LoggerService,
  ) {}

  @OnEvent('jawaban.submitted')
  async handleJawabanSubmitted(event: JawabanSubmitEvent) {
    try {
      await this.createRekapUseCase.execute(event.indikatorId, event.evaluateeId)
    } catch (err) {
      this.logger.error(err);
    }
  }
}
