import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly logDir = path.join(__dirname, '..', '..', 'logs');

  private getLogFileName(): string {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(this.logDir, `log-${dateStr}.log`);
  }

  private async cleanupOldLogs(): Promise<void> {
    try {
      const files = await fsPromises.readdir(this.logDir);
      const now = Date.now();

      for (const file of files) {
        const fullPath = path.join(this.logDir, file);
        const stat = await fsPromises.stat(fullPath);

        // keep only last 30 days
        const ageDays = (now - stat.mtime.getTime()) / (1000 * 60 * 60 * 24);
        if (ageDays > 30) {
          await fsPromises.unlink(fullPath);
        }
      }
    } catch (e) {
      if (e instanceof Error) super.error(`Cleanup error: ${e.message}`);
    }
  }

  private async logToFile(entry: string): Promise<void> {
    const formattedEntry = `${Intl.DateTimeFormat('id-ID', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'Asia/Jakarta',
    }).format(new Date())}\t${entry}\n`;

    try {
      if (!fs.existsSync(this.logDir)) {
        await fsPromises.mkdir(this.logDir, { recursive: true });
      }

      const logFile = this.getLogFileName();
      await fsPromises.appendFile(logFile, formattedEntry);

      // run cleanup once per day
      if (new Date().getHours() === 0) {
        void this.cleanupOldLogs();
      }
    } catch (e) {
      if (e instanceof Error) super.error(`File log error: ${e.message}`);
    }
  }

  log(message: any, context?: string) {
    const entry = `${context ?? 'App'}\t${message}`;
    void this.logToFile(entry);
    super.log(message, context);
  }

  error(message: any, stackOrContext?: string, context?: string) {
    const entry = `${context ?? stackOrContext ?? 'App'}\t${message}`;
    void this.logToFile(entry);
    super.error(message, stackOrContext, context);
  }

  warn(message: any, context?: string) {
    const entry = `${context ?? 'App'}\t${message}`;
    void this.logToFile(entry);
    super.warn(message, context);
  }

  debug(message: any, context?: string) {
    const entry = `${context ?? 'App'}\t${message}`;
    void this.logToFile(entry);
    super.debug(message, context);
  }

  verbose(message: any, context?: string) {
    const entry = `${context ?? 'App'}\t${message}`;
    void this.logToFile(entry);
    super.verbose(message, context);
  }
}

