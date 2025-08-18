import { ROLE } from '@prisma/client';

export type RegisterAccount = {
  name: string;
  email: string;
  password: string;
  role: ROLE;
  avatar: string | Buffer;
};

export type AddProfile = {
  userId: number;
  address: string;
  phone: string;
  dob: Date;
  gender: 'L' | 'P';
};

export type UpdateProfile = Partial<Omit<RegisterAccount, 'role'>> & Partial<AddProfile>;
