import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getPublic(): string {
    return 'Unauthenticated!';
  }

  getPrivate(): string {
    return 'Success!';
  }
}
