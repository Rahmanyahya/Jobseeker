import { Company, Prisma } from '@prisma/client';
import prisma from 'Config/Prisma';

export class CompanyRepository {
  static async create(payload: Prisma.CompanyCreateInput): Promise<void> {
    await prisma.company.create({ data: payload });
  }

  static async update(
    where: Prisma.CompanyWhereUniqueInput,
    payload: Prisma.CompanyUpdateInput
  ): Promise<void> {
    await prisma.company.update({ where, data: payload });
  }

  static async findOne(where: Prisma.CompanyWhereUniqueInput): Promise<Company | null> {
    return await prisma.company.findUnique({ where });
  }
}
