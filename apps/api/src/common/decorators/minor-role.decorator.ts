import { SetMetadata } from '@nestjs/common';
import { MinorRole } from 'src/generated/prisma/enums';

export const MINOR_ROLES_KEY = 'minor_roles';
export const RolesMinor = (...roles: MinorRole[]) => SetMetadata(MINOR_ROLES_KEY, roles);

