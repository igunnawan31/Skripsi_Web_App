import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InternalUpdateReimburseDTO } from '../dtos/request/update.dto';
import { UpdateReimburseResponseDTO } from '../dtos/response/update.dto';
import { ApprovalStatus } from '@prisma/client';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { IReimburseRepository } from '../../domain/repositories/reimburse.repository.interface';
import { ReimburseAuthorizationService } from '../../domain/services/reimburse-authorization.service';
import { IUserRepository } from 'src/modules/users/domain/repositories/users.repository.interface';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class ApprovalReimburseUseCase {
  constructor(
    @Inject(IReimburseRepository)
    private readonly reimburseRepo: IReimburseRepository,
    private readonly authzService: ReimburseAuthorizationService,
    @Inject(IUserRepository)
    private readonly userRepo: IUserRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(
    reimburseId: string,
    approverReq: UserRequest,
    dto: InternalUpdateReimburseDTO,
  ): Promise<UpdateReimburseResponseDTO> {
    const reimburse = await this.reimburseRepo.findById(reimburseId);
    if (!reimburse)
      throw new NotFoundException(`Data reimburse tidak ditemukan`);
    if (reimburse.approvalStatus !== ApprovalStatus.PENDING) {
      const status =
        reimburse.approvalStatus === 'APPROVED' ? 'disetujui' : 'ditolak';
      throw new BadRequestException(
        `Permohonan sudah ${status}. Tidak dapat melakukan approval kembali.`,
      );
    }

    const [approver, requester] = await Promise.all([
      this.userRepo.findById(approverReq.id),
      this.userRepo.findById(reimburse.userId),
    ]);

    if (!approver) {
      throw new NotFoundException('Approver tidak ditemukan');
    }

    if (!requester) {
      throw new NotFoundException('User tidak ditemukan');
    }

    if (reimburse.userId === approverReq.id) {
      throw new BadRequestException(
        'Tidak dapat approve/reject permohonan reimburse sendiri',
      );
    }

    this.authzService.assertApprovalAuthorization(approver, requester);

    const updatedReimburse = await this.reimburseRepo.update(reimburseId, {
      ...dto,
      approverId: approver.id,
    });

    this.logger.log(
      `${approverReq.email} ${dto.approvalStatus?.toLowerCase()} reimburse ${reimburseId}`,
    );
    return updatedReimburse;
  }
}
