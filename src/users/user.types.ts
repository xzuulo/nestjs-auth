import { Role } from './role.enum.js';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;

  refreshTokenHash?: string;
}
