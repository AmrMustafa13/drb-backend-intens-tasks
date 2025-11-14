import { compare, hash } from 'bcrypt';

export const hashVal = async (value: string) => {
  const saltRounds = 10;
  return await hash(value, saltRounds);
};

export const compareHash = async (value: string, hash: string) => {
  return await compare(value, hash);
};
