import { NextFunction, Response } from 'express';
import { ClientRequest } from 'Global/Global';
import { CreateCompany, UpdateCompany } from 'Types/Company.types';
import { CompanyService } from './Company.service';
import { Wrapper } from 'Utils/Wrapper';
import { HttpSuccessCode, HttpSuccessMessage } from 'Constant/HttpSuccess';

export class CompanyController {
  static async addCompany(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: CreateCompany = req.body as CreateCompany;

      request.userId = req.user!.id!;

      await CompanyService.addCompany(request);

      Wrapper.success(res, [], HttpSuccessMessage.CREATED, HttpSuccessCode.CREATED);
    } catch (e) {
      next(e);
    }
  }

  static async updateCompany(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: UpdateCompany = req.body as UpdateCompany;

      request.userId = req.user!.id!;

      await CompanyService.editCompany(request);

      Wrapper.success(res, [], HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }

  static async getCompany(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await CompanyService.getCompany({ userId: req.user!.id! });

      Wrapper.success(res, response, HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }
}
