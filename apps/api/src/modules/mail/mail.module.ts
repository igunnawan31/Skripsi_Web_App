import { Module } from '@nestjs/common';
import { MAIL_PORT } from './domain/ports/mail.port';
import { NodemailerAdapter } from './infrastructure/nodemailer/nodemailer.adapter';
import { MailService } from './application/mail.service';

@Module({
  providers: [
    {
      provide: MAIL_PORT,
      useClass: NodemailerAdapter,
    },
    MailService,
  ],
  exports: [MailService],
})
export class MailModule {}
