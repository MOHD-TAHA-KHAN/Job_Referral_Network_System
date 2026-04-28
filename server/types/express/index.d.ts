import { UserInstance } from '../../models/pg/user';

declare global {
  namespace Express {
    export interface User extends UserInstance {
      id: string;
      role: 'FRESHER' | 'PROFESSIONAL' | 'HR';
    }
    export interface Request {
      user?: User;
    }
  }
}
