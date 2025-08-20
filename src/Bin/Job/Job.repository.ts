import { AvaiblePosition, Prisma } from '@prisma/client';
import prisma from 'Config/Prisma';
import { MetaData } from 'Global/Global';
import { SearchJob } from 'Types/Job.types';

export class JobRepository {
  static async create(payload: Prisma.AvaiblePositionCreateInput): Promise<void> {
    await prisma.avaiblePosition.create({ data: payload });
  }

  static async update(
    payload: Prisma.AvaiblePositionUpdateInput,
    where: Prisma.AvaiblePositionWhereUniqueInput
  ): Promise<void> {
    await prisma.avaiblePosition.update({ where, data: payload });
  }

  static async delete(where: Prisma.AvaiblePositionWhereUniqueInput): Promise<void> {
    await prisma.avaiblePosition.delete({ where });
  }

  static async findOne(
    where: Prisma.AvaiblePositionWhereUniqueInput
  ): Promise<Prisma.AvaiblePositionGetPayload<{ include: { company: true } }> | null> {
    return await prisma.avaiblePosition.findUnique({ where, include: { company: true } });
  }

  static async findAll(
    where: SearchJob,
    userId?: number
  ): Promise<
    {
      id: number;
      position_name: string;
      capacity: number;
      description: string;
      submition_start_date: Date;
      submition_end_date: Date;
      companyName: string;
    }[]
  > {
    const whereClause: Prisma.AvaiblePositionWhereInput = {
      ...(where.search && { position_name: { contains: where.search } }),
      ...(where.startDate && { submition_start_date: { gte: new Date(where.startDate) } }),
      ...(where.endDate && { submition_end_date: { lte: new Date(where.endDate) } }),
      ...(where.skill && { description: { contains: where.skill.join(', ') } }),
      ...(userId && { company: { userId } }),
    };

    const data = await prisma.avaiblePosition.findMany({
      where: whereClause,
      skip: where.offset,
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { company: true },
      omit: { createdAt: true, updatedAt: true, companyId: true },
    });

    return data.map(item => ({
      id: item.id,
      position_name: item.position_name,
      capacity: item.capacity,
      description: item.description,
      submition_start_date: item.submition_start_date,
      submition_end_date: item.submition_end_date,
      companyName: item.company.name,
    }));
  }
}
