import { SetMetadata } from '@nestjs/common';
import { MajorRole } from 'src/generated/prisma/enums';

export const MAJOR_ROLES_KEY = 'major_roles';
export const RolesMajor = (...roles: MajorRole[]) => SetMetadata(MAJOR_ROLES_KEY, roles);

