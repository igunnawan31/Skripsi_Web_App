import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IKontrakRepository } from 'src/kontrak/domain/repositories/kontrak.repository.interface';
import { KontrakFilterDTO } from '../dtos/request/kontrak-filter.dto';

@Injectable()
export class GetAllKontrakUseCase {
  constructor(
    @Inject(IKontrakRepository)
    private readonly kontrakRepo: IKontrakRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async execute(filters: KontrakFilterDTO) {
    const kontrak = await this.kontrakRepo.findAll(filters);

    if (!kontrak) {
      throw new NotFoundException('Kontrak tidak ditemukan');
    }

    return kontrak;
  }
}
