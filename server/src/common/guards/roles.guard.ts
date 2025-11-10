import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MajorRole, MinorRole } from '@prisma/client';
import { MAJOR_ROLES_KEY } from '../decorators/major-roles.decorator';
import { MINOR_ROLES_KEY } from '../decorators/minor-roles.decorator';

// Define the request type with user attached
interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    majorRole: MajorRole;
    minorRole?: MinorRole;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredMajorRoles = this.reflector.getAllAndOverride<MajorRole[]>(
      MAJOR_ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    const requiredMinorRoles = this.reflector.getAllAndOverride<MinorRole[]>(
      MINOR_ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!requiredMajorRoles && !requiredMinorRoles) {
      return true;
    }

    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No user found in request');
    }

    if (requiredMajorRoles && requiredMajorRoles.length > 0) {
      if (!user.majorRole) {
        throw new ForbiddenException('No role found for user');
      }
      if (!requiredMajorRoles.includes(user.majorRole)) {
        throw new ForbiddenException(
          `User major role ${user.majorRole} not permitted for this action`,
        );
      }
    }

    if (requiredMinorRoles && requiredMinorRoles.length > 0) {
      if (!user.minorRole) {
        throw new ForbiddenException('No subrole found for user');
      }
      if (!requiredMinorRoles.includes(user.minorRole)) {
        throw new ForbiddenException(
          `User minor role ${user.minorRole} not permitted for this action`,
        );
      }
    }

    return true;
  }
}
