import { Prisma, StatusApllication } from '@prisma/client';
import prisma from 'Config/Prisma';
import { MetaData } from 'Global/Global';
import { GetHistoryApply, JobApplicantList } from 'Types/Apply.types';

export class ApplicantRepository {
  static async create(payload: Prisma.PositionAppliedCreateInput): Promise<void> {
    await prisma.positionApplied.create({ data: payload });
  }

  static async delete(where: Prisma.PositionAppliedWhereUniqueInput): Promise<void> {
    await prisma.positionApplied.delete({ where });
  }

  static async update(
    where: Prisma.PositionAppliedWhereUniqueInput,
    payload: Prisma.PositionAppliedUpdateInput
  ): Promise<void> {
    await prisma.positionApplied.update({ where, data: payload });
  }

  static async findOne(
    where: Prisma.PositionAppliedWhereUniqueInput
  ): Promise<Prisma.PositionAppliedGetPayload<{
    include: { user: { include: { Portfolio: true } } };
  }> | null> {
    return await prisma.positionApplied.findUnique({
      where,
      include: { user: { include: { Portfolio: true } } },
    });
  }

  static async findFirst(
    where: Prisma.PositionAppliedWhereInput
  ): Promise<Prisma.PositionAppliedGetPayload<{
    include: { user: { include: { Portfolio: true } } };
  }> | null> {
    return await prisma.positionApplied.findFirst({
      where,
      include: { user: { include: { Portfolio: true } } },
    });
  }

  static async findManyHistoryUser(
    where: GetHistoryApply
  ): Promise<{
    data: {
      id: number;
      applyDate: Date;
      status: StatusApllication;
      company: string;
      position: string;
    }[];
    MetaData: MetaData;
  }> {
    const whereClause: Prisma.PositionAppliedWhereInput = {
      user: {
        id: where.userId,
      },
      ...(where.search && {
        OR: [
          { AvaiblePosition: { position_name: { contains: where.search } } },
          { user: { Company: { some: { name: { contains: where.search } } } } },
        ],
      }),
      ...(where.status && { status: where.status }),
    };

    const [data, total] = await prisma.$transaction([
      prisma.positionApplied.findMany({
        where: whereClause,
        skip: (where.page - 1) * where.quantity,
        take: where.quantity,
        orderBy: { apply_date: 'desc' },
        include: { AvaiblePosition: { include: { company: true } } },
        omit: { updatedAt: true },
      }),
      prisma.positionApplied.count({ where: whereClause }),
    ]);

    return {
      data: data.map(item => ({
        id: item.id,
        applyDate: item.apply_date,
        status: item.status,
        company: item.AvaiblePosition.company.name,
        position: item.AvaiblePosition.position_name,
      })),
      MetaData: {
        total,
        page: where.page,
        quantity: where.quantity,
        totalPage: Math.ceil(total / where.quantity),
        currentPage: where.page,
      },
    };
  }

  static async findManyApplicantList(
    where: JobApplicantList
  ): Promise<{
    data: {
      id: number;
      applyDate: Date;
      status: StatusApllication;
      portfolio: { id: number; skill: string; file: string }[];
    }[];
    MetaData: MetaData;
  }> {
    const whereClause: Prisma.PositionAppliedWhereInput = {
      ...(where.search && {
        OR: [
          { AvaiblePosition: { position_name: { contains: where.search } } },
          { user: { Company: { some: { name: { contains: where.search } } } } },
        ],
      }),
      ...(where.status && { status: where.status }),
      AvaiblePosition: {
        company: {
          userId: where.userId,
        },
      },
    };

    const [data, total] = await prisma.$transaction([
      prisma.positionApplied.findMany({
        where: whereClause,
        skip: (where.page - 1) * where.quantity,
        take: where.quantity,
        orderBy: { apply_date: 'desc' },
        include: {
          AvaiblePosition: { include: { company: true } },
          user: { include: { Portfolio: true } },
        },
        omit: { updatedAt: true },
      }),
      prisma.positionApplied.count({ where: whereClause }),
    ]);

    return {
      data: data.map(item => ({
        id: item.id,
        applyDate: item.apply_date,
        status: item.status,
        portfolio: item.user.Portfolio.filter(
          portfolio => portfolio.createdAt < item.apply_date
        ).map(portfolio => ({
          id: portfolio.id,
          skill: portfolio.skill,
          file: portfolio.file,
        })),
      })),
      MetaData: {
        total,
        page: where.page,
        quantity: where.quantity,
        totalPage: Math.ceil(total / where.quantity),
        currentPage: where.page,
      },
    };
  }
}
