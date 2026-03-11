import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { MailOptions, MailPort } from '../../domain/ports/mail.port';

@Injectable()
export class ResendAdapter implements MailPort {
  private resend: Resend;

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
  }

  async send(options: MailOptions): Promise<void> {
    const from =
      this.config.get<string>('MAIL_FROM') ?? 'onboarding@resend.dev';

    await this.resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}
