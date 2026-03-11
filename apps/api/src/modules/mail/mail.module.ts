import { Module } from '@nestjs/common';
import { MAIL_PORT } from './domain/ports/mail.port';
import { MailService } from './application/mail.service';
import { ResendAdapter } from './infrastructure/resend/resend.adapter';

@Module({
  providers: [
    {
      provide: MAIL_PORT,
      useClass: ResendAdapter,
    },
    MailService,
  ],
  exports: [MailService],
})
export class MailModule {}
