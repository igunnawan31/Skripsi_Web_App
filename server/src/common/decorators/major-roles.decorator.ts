import { SetMetadata } from '@nestjs/common';
import { MajorRole } from '@prisma/client';

export const MAJOR_ROLES_KEY = 'major_roles';
export const Roles = (...roles: MajorRole[]) => SetMetadata(MAJOR_ROLES_KEY, roles);

