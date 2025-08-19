import { CreateCompany, GetCompany, UpdateCompany } from 'Types/Company.types';
import { CompanySchema } from './Company.schema';
import { Validator } from 'Helper/Validator';
import Logger from 'Config/Logger';
import { ErrorHandler } from 'Global/Global';
import { HttpErrorCode, HttpErrorMessage } from 'Constant/HttpError';
import { CompanyRepository } from './Company.repository';
import { Company } from '@prisma/client';

export class CompanyService {
  static async addCompany(payload: CreateCompany): Promise<void> {
    const ctx: string = 'Add Company';
    const scp: string = 'Company';

    const userRequest = Validator.Validate(CompanySchema.CREATE_COMPANY, payload);

    const userData = await CompanyRepository.findOne({ userId: userRequest.userId });

    if (userData) {
      Logger.info(ctx, `User already have a company`, scp);
      throw new ErrorHandler(HttpErrorCode.BAD_REQUEST, 'You already have a company');
    }

    await CompanyRepository.create({
      address: userRequest.address,
      description: userRequest.description,
      name: userRequest.name,
      phone: userRequest.phone,
      user: { connect: { id: userRequest.userId } },
    });

    Logger.info(ctx, `Company added`, scp);
  }

  static async editCompany(payload: UpdateCompany): Promise<void> {
    const ctx: string = 'Edit Company';
    const scp: string = 'Company';

    const userRequest = Validator.Validate(CompanySchema.UPDATE_COMPANY, payload);

    await CompanyRepository.update(
      {
        userId: userRequest.userId,
      },
      {
        address: userRequest.address,
        description: userRequest.description,
        name: userRequest.name,
        phone: userRequest.phone,
      }
    );

    Logger.info(ctx, `Company edited`, scp);
  }

  static async getCompany(
    payload: GetCompany
  ): Promise<Partial<Omit<Company, 'userId' | 'createdAt' | 'updatedAt'>>> {
    const ctx: string = 'Get Company';
    const scp: string = 'Company';

    const userRequest = Validator.Validate(CompanySchema.GET_COMPANY, payload);

    const company = await CompanyRepository.findOne({ userId: userRequest.userId });

    Logger.info(ctx, `Company fetched`, scp);

    return {
      address: company?.address,
      description: company?.description,
      name: company?.name,
      phone: company?.phone,
    };
  }
}
