import { SetMetadata } from '@nestjs/common';

// This decorator lets us tag any route with the roles that are
// allowed to access it. The RolesGuard reads this metadata.
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);