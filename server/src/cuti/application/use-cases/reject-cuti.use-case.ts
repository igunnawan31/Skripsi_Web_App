import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CutiRejectedEvent } from '../events/cuti.events';
import { ICutiRepository } from 'src/cuti/domain/repositories/cuti.repository.interface';
import { IUserRepository } from 'src/users/domain/repositories/users.repository.interface';
import { CutiAuthorizationService } from 'src/cuti/domain/services/cuti-approval-authorization.service';
import { UpdateCutiResponseDTO } from '../dtos/response/update-response.dto';
import { StatusCuti } from '@prisma/client';
import { ApprovalCutiDTO, ApprovalCutiInput } from '../dtos/request/approval.dto';

@Injectable()
export class RejectCutiUseCase {
  constructor(
    @Inject(ICutiRepository)
    private readonly cutiRepo: ICutiRepository,
    @Inject(IUserRepository)
    private readonly userRepo: IUserRepository,
    private readonly authzService: CutiAuthorizationService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async execute(
    cutiId: string,
    approverId: string,
    dto: ApprovalCutiDTO,
  ): Promise<UpdateCutiResponseDTO> {
    const cuti = await this.cutiRepo.findById(cutiId);
    if (!cuti) {
      throw new NotFoundException('Cuti tidak ditemukan');
    }

    // STEP 2: Check if cuti is still pending
    if (cuti.status !== StatusCuti.MENUNGGU) {
      throw new BadRequestException(
        `Cuti sudah ${cuti.status.toLowerCase()}. Tidak dapat direject lagi.`,
      );
    }

    // STEP 3: Validate rejection reason
    if (!dto.catatan || dto.catatan.trim().length < 10) {
      throw new BadRequestException(
        'Alasan penolakan wajib diisi minimal 10 karakter',
      );
    }

    // STEP 4: Load approver and requester
    const [approver, requester] = await Promise.all([
      this.userRepo.findById(approverId),
      this.userRepo.findById(cuti.userId),
    ]);

    if (!approver) {
      throw new NotFoundException('Approver tidak ditemukan');
    }

    if (!requester) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const canApprove = this.authzService.canApproveCuti(approver, requester);
    if (!canApprove) {
      throw new ForbiddenException(
        `Role ${approver.minorRole || approver.majorRole} tidak memiliki akses untuk reject cuti dari ${requester.minorRole || requester.majorRole}`,
      );
    }

    if (cuti.userId === approverId) {
      throw new BadRequestException('Tidak dapat reject cuti sendiri');
    }

    const payload: ApprovalCutiInput = {
      status: StatusCuti.BATAL,
      catatan: `Ditolak oleh ${approver.name}: ${dto.catatan}`,
    };
    const updatedCuti = await this.cutiRepo.cutiApproval(
      cutiId,
      payload,
      approverId,
    );

    this.eventEmitter.emit(
      'cuti.rejected',
      new CutiRejectedEvent(
        updatedCuti.id,
        requester.id,
        requester.name,
        approver.name,
        dto.catatan,
      ),
    );

    return updatedCuti;
  }
}
