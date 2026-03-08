import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IKontrakRepository } from '../../domain/repositories/kontrak.repository.interface';

@Injectable()
export class GetKontrakUseCase {
  constructor(
    @Inject(IKontrakRepository)
    private readonly kontrakRepo: IKontrakRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async execute(kontrakId: string) {
    const kontrak = await this.kontrakRepo.findById(kontrakId);

    if (!kontrak) {
      throw new NotFoundException('Kontrak tidak ditemukan');
    }

    return kontrak;
  }
}
