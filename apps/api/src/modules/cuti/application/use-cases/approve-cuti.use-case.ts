import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateCutiResponseDTO } from '../dtos/response/update-response.dto';
import { StatusCuti } from '@prisma/client';
import { CutiApprovedEvent } from '../events/cuti.events';
import { ApprovalCutiDTO, ApprovalCutiInput } from '../dtos/request/approval.dto';
import { ICutiRepository } from '../../domain/repositories/cuti.repository.interface';
import { IUserRepository } from 'src/modules/users/domain/repositories/users.repository.interface';
import { CutiAuthorizationService } from '../../domain/services/cuti-approval-authorization.service';

@Injectable()
export class ApproveCutiUseCase {
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
    const formattedStartDate = new Date(cuti.startDate);
    const formattedEndDate = new Date(cuti.endDate);
    if (!cuti) {
      throw new NotFoundException('Cuti tidak ditemukan');
    }

    if (cuti.status !== StatusCuti.MENUNGGU) {
      throw new BadRequestException(
        `Cuti sudah ${cuti.status.toLowerCase()}. Tidak dapat diapprove lagi.`,
      );
    }

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
        `Role ${approver.minorRole || approver.majorRole} tidak memiliki akses untuk approve cuti dari ${requester.minorRole || requester.majorRole}`,
      );
    }
    if (cuti.userId === approverId) {
      throw new BadRequestException('Tidak dapat approve cuti sendiri');
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (/*formattedEndDate < today ||*/ formattedStartDate < today) {
      throw new BadRequestException(
        'Tidak dapat approve cuti yang tanggalnya sudah lewat',
      );
    }

    const payload: ApprovalCutiInput = {
      ...dto,
      status: StatusCuti.DITERIMA,
      catatan: dto.catatan || `Disetujui oleh ${approver.name}`,
    };

    const updatedCuti = await this.cutiRepo.cutiApproval(
      cutiId,
      payload,
      approverId,
    );

    this.eventEmitter.emit(
      'cuti.approved',
      new CutiApprovedEvent(
        updatedCuti.id,
        requester.id,
        requester.name,
        approver.name,
        formattedStartDate,
        formattedEndDate,
        dto.catatan,
      ),
    );

    return updatedCuti;
  }
}
