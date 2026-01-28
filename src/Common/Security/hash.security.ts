import bcrypt from 'bcryptjs';

export const Hash = (
  plainText: string,
  saltRound: number = Number(process.env.SALT_ROUND as string),
): string => {
  return bcrypt.hashSync(plainText, saltRound);
};

export const Compare = (plainText: string, hashed: string): boolean => {
  return bcrypt.compareSync(plainText, hashed);
};
