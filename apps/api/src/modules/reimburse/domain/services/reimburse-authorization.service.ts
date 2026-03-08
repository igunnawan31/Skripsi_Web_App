import { ForbiddenException, Injectable } from '@nestjs/common';
import { MajorRole, MinorRole } from '@prisma/client';
import { RetrieveUserResponseDTO } from 'src/modules/users/application/dtos/response/read-response.dto';

@Injectable()
export class ReimburseAuthorizationService {
  private readonly REIMBURSE_APPROVAL_POLICY: Record<
    MinorRole,
    (approver: RetrieveUserResponseDTO) => boolean
  > = {
      [MinorRole.ADMIN]: (approver) => approver.majorRole === MajorRole.OWNER,

      [MinorRole.HR]: (approver) =>
        approver.majorRole === MajorRole.OWNER ||
        approver.minorRole === MinorRole.ADMIN,

      [MinorRole.BACKEND]: (approver) =>
        approver.majorRole === MajorRole.OWNER ||
        approver.minorRole === MinorRole.ADMIN,

      [MinorRole.FRONTEND]: (approver) =>
        approver.majorRole === MajorRole.OWNER ||
        approver.minorRole === MinorRole.ADMIN,

      [MinorRole.PROJECT_MANAGER]: (approver) =>
        approver.majorRole === MajorRole.OWNER ||
        approver.minorRole === MinorRole.ADMIN,

      [MinorRole.UI_UX]: (approver) =>
        approver.majorRole === MajorRole.OWNER ||
        approver.minorRole === MinorRole.ADMIN,
    };

  assertApprovalAuthorization(
    approver: RetrieveUserResponseDTO,
    requester: RetrieveUserResponseDTO,
  ): boolean {
    const policy = this.REIMBURSE_APPROVAL_POLICY[requester.minorRole];

    if (!policy) {
      throw new Error(
        `No approval policy defined for requester role: ${requester.minorRole}`,
      );
    }
    if (!policy(approver)) {
      throw new ForbiddenException(
        `Role ${approver.minorRole || approver.majorRole} tidak memiliki akses untuk approve/reject permohonan reimburse dari ${requester.minorRole || requester.majorRole}`,
      );
    }


    return policy(approver);
  }
}
