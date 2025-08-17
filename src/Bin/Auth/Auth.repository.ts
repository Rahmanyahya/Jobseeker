import { Prisma, User } from '@prisma/client';
import prisma from 'Config/Prisma';

export class AuthRepository {
  static async getUserByEmail(payload: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return await prisma.user.findUnique({ where: payload });
  }
}
