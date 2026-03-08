import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IReimburseRepository } from '../../domain/repositories/reimburse.repository.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { deleteFileArray } from 'src/common/utils/fileHelper';
import { UserRequest } from 'src/common/types/UserRequest.dto';

@Injectable()
export class DeleteReimburseUseCase {
  constructor(
    @Inject(IReimburseRepository)
    private readonly reimburseRepo: IReimburseRepository,
    private readonly eventEmitter: EventEmitter2,
  ) { }
  async execute(reimburseId: string, user: UserRequest) {
    const reimburse = await this.reimburseRepo.findById(reimburseId);

    if (!reimburse) {
      throw new NotFoundException('Data reimburse tidak ditemukan');
    }

    if (reimburse.approvalStatus === 'APPROVED')
      throw new BadRequestException(
        'Data reimburse tidak dapat dihapus karena telah disetujui',
      );

    if (reimburse.userId !== user.id) {
      throw new BadRequestException(
        'Hanya pemohon yang dapat menghapus permohonan reimburse',
      );
    }

    await deleteFileArray(reimburse.documents, 'Dokumen Reimburse');

    return this.reimburseRepo.remove(reimburseId);
  }
}
