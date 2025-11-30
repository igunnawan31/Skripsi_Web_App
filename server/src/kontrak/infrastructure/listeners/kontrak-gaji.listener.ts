import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { KontrakCreatedEvent } from 'src/kontrak/application/events/kontrak.events';

@Injectable()
export class KontrakGajiListener {
  @OnEvent('kontrak.created')
  async handleKontrakCreated(event: KontrakCreatedEvent) {
    console.log(`💰 Kontrak created: Setup gaji schedule for user ${event.userId}`);
    console.log(`Unimplemented: TO DO`)
    
    // If BULANAN, schedule monthly salary generation
    // This will be handled by Gaji module scheduler
    
    // If TERMIN, create termin records
    // If FULL, create single payment record
  }
}
