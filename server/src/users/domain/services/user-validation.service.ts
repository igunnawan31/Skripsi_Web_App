import { Injectable } from '@nestjs/common';
import { MajorRole, MinorRole } from '@prisma/client';
import { UserRequest } from 'src/common/types/UserRequest.dto';
import { RetrieveUserResponseDTO } from 'src/users/application/dtos/response/read-response.dto';

@Injectable()
export class UserValidationService {
  validatePasswordStrength(password: string): {
    valid: boolean;
    message: string;
  } {
    if (password.length < 8) {
      return {
        valid: false,
        message: 'Password minimal 8 karakter',
      };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return {
        valid: false,
        message:
          'Password harus mengandung huruf besar, huruf kecil, dan angka',
      };
    }

    return {
      valid: true,
      message: 'Password valid',
    };
  }

  canDeleteUser(user: RetrieveUserResponseDTO): boolean {
    if (user.majorRole === MajorRole.OWNER) {
      return false;
    }

    return true;
  }

  canUpdateRole(
    currentUser: UserRequest,
    targetUser: RetrieveUserResponseDTO,
  ): boolean {
    // Only OWNER can change roles
    if (currentUser.majorRole === MajorRole.OWNER) {
      return true;
    }

    console.log("Passed");
    // HR can change specific roles
    if (currentUser.minorRole === MinorRole.HR) {
      const allowedRoles = [
        MinorRole.ADMIN,
        MinorRole.PROJECT_MANAGER,
        MinorRole.FRONTEND,
        MinorRole.BACKEND,
        MinorRole.UI_UX,
      ];
      return targetUser.minorRole && targetUser.minorRole !== MinorRole.HR
        ? allowedRoles.includes(targetUser.minorRole)
        : false;
    }
    console.log("Passed");

    return false;
  }
}
