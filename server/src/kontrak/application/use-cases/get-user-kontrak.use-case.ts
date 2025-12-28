import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IKontrakRepository } from 'src/kontrak/domain/repositories/kontrak.repository.interface';
import { KontrakFilterDTO } from '../dtos/request/kontrak-filter.dto';
import { UserRequest } from 'src/common/types/UserRequest.dto';

@Injectable()
export class GetUserKontrakUseCase {
  constructor(
    @Inject(IKontrakRepository)
    private readonly kontrakRepo: IKontrakRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async execute(userId: string, filters: KontrakFilterDTO, user: UserRequest) {
    if (
      userId !== user.id &&
      (user.minorRole !== 'HR' || user.majorRole !== 'OWNER')
    ) {
      throw new UnauthorizedException('User tidak memiliki akses data ini');
    }
    const kontrak = await this.kontrakRepo.findByUserId(userId, filters);

    if (!kontrak) {
      throw new NotFoundException('Kontrak tidak ditemukan');
    }

    return kontrak;
  }
}
