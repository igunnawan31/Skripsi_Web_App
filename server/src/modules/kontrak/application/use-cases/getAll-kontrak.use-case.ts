import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { KontrakFilterDTO } from '../dtos/request/kontrak-filter.dto';
import { IKontrakRepository } from '../../domain/repositories/kontrak.repository.interface';

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
