import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CutiCancelledEvent } from '../events/cuti.events';
import { ICutiRepository } from 'src/cuti/domain/repositories/cuti.repository.interface';
import { IUserRepository } from 'src/users/domain/repositories/users.repository.interface';
import { CutiAuthorizationService } from 'src/cuti/domain/services/cuti-approval-authorization.service';
import { MajorRole, MinorRole, StatusCuti } from '@prisma/client';
import { DeleteCutiResponseDTO } from '../dtos/response/delete-response.dto';
import { UpdateCutiResponseDTO } from '../dtos/response/update-response.dto';
import { UpdateCutiDTO } from '../dtos/request/update-cuti.dto';

@Injectable()
export class CancelCutiUseCase {
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
    userId: string,
    dto: UpdateCutiDTO,
  ): Promise<DeleteCutiResponseDTO> {
    const cuti = await this.cutiRepo.findById(cutiId);
    const formattedStartDate = new Date(cuti.startDate);
    const formattedEndDate = new Date(cuti.endDate);
    const MAX_CUTI_CANCEL = 3; // Maksimal batal cuti h-3 jika sudah approved
    if (!cuti) {
      throw new NotFoundException('Cuti tidak ditemukan');
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const authCheck = this.authzService.canCancelCuti(user, cuti);
    if (!authCheck.canCancel) {
      throw new ForbiddenException(
        authCheck.reason || 'Tidak dapat membatalkan cuti ini',
      );
    }

    // Case: sudah approved tetapi mau cancel
    if (cuti.status === StatusCuti.DITERIMA) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const daysUntilCuti = Math.floor(
        (formattedStartDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24),
      );

      if (daysUntilCuti < MAX_CUTI_CANCEL && user.id === cuti.userId) {
        throw new BadRequestException(
          `Cuti yang sudah disetujui harus dibatalkan minimal 3 hari sebelumnya. Sisa waktu: ${daysUntilCuti} hari.`,
        );
      }

      // Owner/HR can cancel anytime
      if (
        user.majorRole !== MajorRole.OWNER &&
        user.minorRole !== MinorRole.HR
      ) {
        if (daysUntilCuti < MAX_CUTI_CANCEL) {
          throw new BadRequestException(
            'Cuti yang sudah disetujui harus dibatalkan minimal 3 hari sebelumnya',
          );
        }
      }
    }

    const cancelReason = dto.reason
      ? `Dibatalkan oleh ${user.name}: ${dto.reason}`
      : `Dibatalkan oleh ${user.name}`;

    const updatedCuti = await this.cutiRepo.cutiApproval(cutiId, {
      status: StatusCuti.BATAL,
      catatan: cancelReason,
    });

    this.eventEmitter.emit(
      'cuti.cancelled',
      new CutiCancelledEvent(updatedCuti.id, cuti.userId, user.id, dto.reason),
    );

    return updatedCuti;
  }
}
