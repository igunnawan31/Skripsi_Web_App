import { Module } from '@nestjs/common';
import { MAIL_PORT } from './domain/ports/mail.port';
import { MailService } from './application/mail.service';
import { ResendAdapter } from './infrastructure/resend/resend.adapter';
import { DateUtilService } from 'src/common/utils/dateUtil';

@Module({
  providers: [
    {
      provide: MAIL_PORT,
      useClass: ResendAdapter,
    },
    MailService,
    DateUtilService,
  ],
  exports: [MailService],
})
export class MailModule { }
