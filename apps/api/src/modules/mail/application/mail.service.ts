import { Inject, Injectable } from '@nestjs/common';
import { MAIL_PORT } from '../domain/ports/mail.port';
import type { MailPort } from '../domain/ports/mail.port';

@Injectable()
export class MailService {
  constructor(@Inject(MAIL_PORT) private readonly mailer: MailPort) {}

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.mailer.send({
      to,
      subject: 'Welcome!',
      html: `<h1>Welcome, ${name}!</h1>`,
    });
  }

  async sendPasswordReset(to: string, token: string): Promise<void> {
    await this.mailer.send({
      to,
      subject: 'Reset your password',
      html: `<p>Your reset token: <strong>${token}</strong></p>`,
    });
  }

  async sendNewUserCredentials(to: string, name: string, password: string): Promise<void> {
    await this.mailer.send({
      to,
      subject: 'User Credentials',
      html: `<p>Your Credentials: <strong>${name}</strong>, <strong>${password}</strong></p>`,
    })
  }

  async sendUseAddedToProject(to: string, name: string, project: string): Promise<void> {
    await this.mailer.send({
      to,
      subject: 'New Project',
      html: `<p>${name}, you have been added to new project: ${project} <p>`
    })
  }
}
