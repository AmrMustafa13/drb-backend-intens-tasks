import { compare, hash } from 'bcrypt';
import { createHash } from 'crypto';

export const hashVal = async (value: string) => {
  const saltRounds = 10;
  return await hash(value, saltRounds);
};

export const compareHash = async (value: string, hash: string) => {
  return await compare(value, hash);
};

export const hashToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};
