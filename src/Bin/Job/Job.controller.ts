import { NextFunction, Response } from 'express';
import { ClientRequest } from 'Global/Global';
import { CreateJob, GetJobById, SearchJob, UpdateJob } from 'Types/Job.types';
import { JobService } from './Job.service';
import { Wrapper } from 'Utils/Wrapper';
import { HttpSuccessCode, HttpSuccessMessage } from 'Constant/HttpSuccess';

export class JobController {
  static async createJob(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: CreateJob = req.body as CreateJob;

      await JobService.createJob(request, req.user!.id!);

      Wrapper.success(res, [], HttpSuccessMessage.CREATED, HttpSuccessCode.CREATED);
    } catch (e) {
      next(e);
    }
  }

  static async updateJob(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: UpdateJob = req.body as UpdateJob;

      await JobService.updateJob(request, req.user!.id!);

      Wrapper.success(res, [], HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }

  static async getJobById(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: GetJobById = req.query as unknown as GetJobById;

      request.id = Number(request.id);

      const response =
        req.user && req.user.role === 'HRD'
          ? await JobService.getJobById({ id: request.id, userId: req.user.id! })
          : await JobService.getJobById(request);

      Wrapper.success(res, response, HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }

  static async getJobs(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: SearchJob = req.query as unknown as SearchJob;

      request.offset = Number(request.offset);

      const response =
        req.user && req.user.role === 'HRD'
          ? await JobService.getJobList(request, req.user.id!)
          : await JobService.getJobList(request);

      Wrapper.success(res, response, HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }

  static async deleteJob(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: GetJobById = req.query as unknown as GetJobById;

      request.id = Number(request.id);

      await JobService.deleteJob(request, req.user!.id!);

      Wrapper.success(res, [], HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }
}
