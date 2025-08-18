import { Portfolio, Prisma } from '@prisma/client';
import prisma from 'Config/Prisma';
import { MetaData } from 'Global/Global';
import { GetAllPortfolio } from 'Types/Portfolio.types';

export class PortfolioRepository {
  static async create(payload: Prisma.PortfolioCreateInput): Promise<void> {
    await prisma.portfolio.create({ data: payload });
  }

  static async update(
    payload: Prisma.PortfolioUpdateInput,
    where: Prisma.PortfolioWhereUniqueInput
  ): Promise<void> {
    await prisma.portfolio.update({ where, data: payload });
  }

  static async delete(where: Prisma.PortfolioWhereUniqueInput): Promise<void> {
    await prisma.portfolio.delete({ where });
  }

  static async findOne(
    where: Prisma.PortfolioWhereUniqueInput,
    userId: number
  ): Promise<Omit<Portfolio, 'userId' | 'createdAt' | 'updatedAt'> | null> {
    return await prisma.portfolio.findUnique({
      where: {
        id: where.id,
        userId,
      },
      omit: { userId: true, createdAt: true, updatedAt: true },
    });
  }

  static async findAll(paylod: GetAllPortfolio): Promise<{
    data: Omit<Portfolio, 'userId' | 'createdAt' | 'updatedAt'>[];
    MetaData: MetaData;
  }> {
    const where: Prisma.PortfolioWhereInput = {
      userId: paylod.userId,
      skill: {
        contains: paylod.search,
      },
    };

    const [data, total] = await prisma.$transaction([
      prisma.portfolio.findMany({
        where,
        skip: (paylod.page - 1) * paylod.quantity,
        take: paylod.quantity,
        orderBy: { createdAt: 'desc' },
        omit: { userId: true, createdAt: true, updatedAt: true },
      }),
      prisma.portfolio.count({ where }),
    ]);

    return {
      data,
      MetaData: {
        total,
        page: paylod.page,
        quantity: paylod.quantity,
        totalPage: Math.ceil(total / paylod.quantity),
        currentPage: paylod.page,
      },
    };
  }
}
