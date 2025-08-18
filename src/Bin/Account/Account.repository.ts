import { Prisma, Society, User } from '@prisma/client';
import prisma from 'Config/Prisma';

export class AccountRepository {
  static async createAccount(payload: Prisma.UserCreateInput): Promise<void> {
    await prisma.user.create({ data: payload });
  }

  static async create(payload: Prisma.SocietyCreateInput): Promise<void> {
    await prisma.society.create({ data: payload });
  }

  static async findOne(
    payload: Prisma.UserWhereUniqueInput
  ): Promise<Omit<Prisma.UserGetPayload<{ include: { Society: true } }>, 'password' | 'role'>> {
    return (await prisma.user.findUnique({
      where: payload,
      omit: { password: true, role: true },
      include: { Society: true },
    })) as Omit<Prisma.UserGetPayload<{ include: { Society: true } }>, 'password' | 'role'>;
  }

  static async update(
    payload: Prisma.SocietyUpdateInput,
    where: Prisma.SocietyWhereUniqueInput
  ): Promise<void> {
    await prisma.society.update({ where, data: payload });
  }

  static async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return await prisma.user.delete({ where });
  }

  static async updateAccount(
    payload: Prisma.UserUpdateInput,
    where: Prisma.UserWhereUniqueInput
  ): Promise<void> {
    await prisma.user.update({ where, data: payload });
  }
}
