import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { KontrakCreatedEvent } from '../../application/events/kontrak.events';

@Injectable()
export class KontrakGajiListener {
  @OnEvent('kontrak.created')
  async handleKontrakCreated(event: KontrakCreatedEvent) {
    // If BULANAN, schedule monthly salary generation
    // This will be handled by Gaji module scheduler
    
    // If TERMIN, create termin records
    // If FULL, create single payment record
  }
}
