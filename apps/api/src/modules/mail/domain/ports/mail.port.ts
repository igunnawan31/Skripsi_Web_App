export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export const MAIL_PORT = 'MAIL_PORT';

export interface MailPort {
  send(options: MailOptions): Promise<void>;
}
