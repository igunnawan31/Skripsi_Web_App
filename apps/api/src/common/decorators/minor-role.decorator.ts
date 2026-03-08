import { SetMetadata } from '@nestjs/common';
import { MinorRole } from '@prisma/client';

export const MINOR_ROLES_KEY = 'minor_roles';
export const RolesMinor = (...roles: MinorRole[]) => SetMetadata(MINOR_ROLES_KEY, roles);

