import { User } from 'src/database/schemas/user.schema';

declare global {
  namespace Express {
    interface Request {
      user?: Partial<User> & { _id: string };
    }
  }
}

export {};
