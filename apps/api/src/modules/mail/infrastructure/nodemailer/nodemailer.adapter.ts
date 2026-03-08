import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailOptions, MailPort } from '../../domain/ports/mail.port';

@Injectable()
export class NodemailerAdapter implements MailPort {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: this.config.get<number>('MAIL_PORT'),

      secure: false,
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    });
  }

  async send(options: MailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: `"No Reply" <${this.config.get('MAIL_FROM')}>`,
      ...options,
    });
  }
}
