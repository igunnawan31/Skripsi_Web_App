// src/cuti/application/services/cuti-authorization.service.ts

import { Injectable } from '@nestjs/common';
import { MajorRole, MinorRole, StatusCuti } from '@prisma/client';
import { RetrieveUserResponseDTO } from 'src/modules/users/application/dtos/response/read-response.dto';
import { RetrieveCutiResponseDTO } from '../../application/dtos/response/read-response.dto';

@Injectable()
export class CutiAuthorizationService {
  // Policy: siapa yang boleh approve cuti berdasarkan minorRole pemohon
  private readonly LEAVE_APPROVAL_POLICY: Record<
    MinorRole,
    (approver: RetrieveUserResponseDTO) => boolean
  > = {
      [MinorRole.HR]: (approver) => approver.majorRole === MajorRole.OWNER,

      [MinorRole.ADMIN]: (approver) =>
        approver.majorRole === MajorRole.OWNER ||
        approver.minorRole === MinorRole.HR,

      [MinorRole.BACKEND]: (approver) =>
        approver.majorRole === MajorRole.OWNER ||
        approver.minorRole === MinorRole.HR,

      [MinorRole.FRONTEND]: (approver) =>
        approver.majorRole === MajorRole.OWNER ||
        approver.minorRole === MinorRole.HR,

      [MinorRole.PROJECT_MANAGER]: (approver) =>
        approver.majorRole === MajorRole.OWNER ||
        approver.minorRole === MinorRole.HR,

      [MinorRole.UI_UX]: (approver) =>
        approver.majorRole === MajorRole.OWNER ||
        approver.minorRole === MinorRole.HR,
    };

  canApproveCuti(
    approver: RetrieveUserResponseDTO,
    requester: RetrieveUserResponseDTO,
  ): boolean {
    const policy = this.LEAVE_APPROVAL_POLICY[requester.minorRole];

    if (!policy) {
      throw new Error(
        `No approval policy defined for requester role: ${requester.minorRole}`,
      );
    }

    return policy(approver);
  }

  canCancelCuti(
    user: RetrieveUserResponseDTO,
    cuti: RetrieveCutiResponseDTO,
  ): {
    canCancel: boolean;
    reason?: string;
  } {
    // Business Rule 1: Cannot cancel if already approved
    if (cuti.status === StatusCuti.DITERIMA) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const formattedStartDate = new Date(cuti.startDate);

      // Check if cuti has started
      if (formattedStartDate <= today) {
        return {
          canCancel: false,
          reason: 'Tidak dapat membatalkan cuti yang sudah dimulai',
        };
      }

      // Can cancel approved cuti if not started yet (with conditions)
      if (user.id === cuti.userId) {
        // User can cancel their own approved cuti (before it starts)
        return { canCancel: true };
      }
    }

    // Business Rule 2: Cannot cancel if already rejected
    if (cuti.status === StatusCuti.DITOLAK) {
      return {
        canCancel: false,
        reason: 'Cuti yang sudah ditolak tidak dapat dibatalkan',
      };
    }

    // Business Rule 3: User can cancel their own pending cuti
    if (cuti.userId === user.id && cuti.status === StatusCuti.MENUNGGU) {
      return { canCancel: true };
    }

    // Business Rule 4: Owner can cancel any cuti
    if (user.majorRole === MajorRole.OWNER) {
      return { canCancel: true };
    }

    // Business Rule 5: HR can cancel cuti from specific roles
    if (user.minorRole === MinorRole.HR) {
      // HR can cancel if they have approval rights for this user
      return { canCancel: true };
    }

    return {
      canCancel: false,
      reason: 'Anda tidak memiliki akses untuk membatalkan cuti ini',
    };
  }
}
