import { NextFunction, Response } from 'express';
import { ClientRequest } from 'Global/Global';
import {
  ApplyJob,
  CancelApply,
  EditApply,
  GetHistoryApply,
  JobAplicantDetail,
  JobApplicantList,
} from 'Types/Apply.types';
import { ApplicantService } from './Applicant.service';
import { HttpSuccessCode, HttpSuccessMessage } from 'Constant/HttpSuccess';
import { Wrapper } from 'Utils/Wrapper';

export class ApplicantController {
  static async applyJob(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: ApplyJob = req.body as ApplyJob;

      await ApplicantService.applyJob(request, req.user!.id!);

      Wrapper.success(res, [], HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }

  static async getHistoryAppliciant(
    req: ClientRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: GetHistoryApply = req.query as unknown as GetHistoryApply;

      request.page = Number(request.page);
      request.quantity = Number(request.quantity);

      const { data, MetaData } = await ApplicantService.getHistoryApplycian(request, req.user!.id!);

      Wrapper.pagination(res, data, MetaData, HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }

  static async cancelApply(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: CancelApply = req.query as unknown as CancelApply;

      request.id = Number(request.id);

      await ApplicantService.cancelApply(request);

      Wrapper.success(res, [], HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }

  static async editApply(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: EditApply = req.body as EditApply;

      request.id = Number(request.id);

      await ApplicantService.editApply(request, req.user!.id!);

      Wrapper.success(res, [], HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }

  static async jobAppliciantDetail(
    req: ClientRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: JobAplicantDetail = req.query as unknown as JobAplicantDetail;

      request.id = Number(request.id);

      const response = await ApplicantService.jobApplyciantDetail(request, req.user!.id!);

      Wrapper.success(res, response, HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }

  static async jobApplicinatList(
    req: ClientRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: JobApplicantList = req.query as unknown as JobApplicantList;

      request.page = Number(request.page);
      request.quantity = Number(request.quantity);
      request.avaible_position_Id = Number(request.avaible_position_Id);

      const { data, MetaData } = await ApplicantService.jobAppliciantList(request, req.user!.id!);

      Wrapper.pagination(res, data, MetaData, HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }
}
