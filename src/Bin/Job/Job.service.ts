import { CreateJob, DeleteJob, GetJobById, SearchJob, UpdateJob } from 'Types/Job.types';
import { JobSchema } from './Job.schema';
import { Validator } from 'Helper/Validator';
import { JobRepository } from './Job.repository';
import Logger from 'Config/Logger';
import { ErrorHandler } from 'Global/Global';
import { HttpErrorCode, HttpErrorMessage } from 'Constant/HttpError';
import { AvaiblePosition } from '@prisma/client';
import { CompanyRepository } from 'Bin/Company/Company.repository';

export class JobService {
  static async createJob(payload: CreateJob, userId: number): Promise<void> {
    const scp: string = 'Job';
    const ctx: string = 'Create Job';

    const userRequest = Validator.Validate(JobSchema.ADD_JOB, payload);

    userRequest.userId = userId;

    const company = await CompanyRepository.findOne({ userId: userRequest.userId });

    if (!company) {
      Logger.info(ctx, `Company not found`, scp);
      throw new ErrorHandler(HttpErrorCode.NOT_FOUND, 'You do not have a company');
    }

    userRequest.companyId = company.id;

    await JobRepository.create({
      position_name: userRequest.position_name,
      capacity: userRequest.capacity,
      description: userRequest.description,
      submition_start_date: userRequest.submition_start_date,
      submition_end_date: userRequest.submition_end_date,
      company: { connect: { id: userRequest.companyId } },
    });

    Logger.info(ctx, `Job added`, scp);
  }

  static async updateJob(payload: UpdateJob, userId: number): Promise<void> {
    const scp: string = 'Job';
    const ctx: string = 'Update Job';

    const userRequest = Validator.Validate(JobSchema.UPDATE_JOB, payload);

    userRequest.userId = userId;

    const company = await CompanyRepository.findOne({ userId: userRequest.userId });

    if (!company) {
      Logger.info(ctx, `Company not found`, scp);
      throw new ErrorHandler(HttpErrorCode.NOT_FOUND, 'You do not have a company');
    }

    const job = await JobRepository.findOne({ id: userRequest.id, companyId: company.id });

    if (!job) {
      Logger.info(ctx, `Job not found`, scp);
      throw new ErrorHandler(HttpErrorCode.NOT_FOUND, HttpErrorMessage.NOT_FOUND);
    }

    await JobRepository.update(
      {
        position_name: userRequest.position_name,
        capacity: userRequest.capacity,
        description: userRequest.description,
        submition_start_date: userRequest.submition_start_date,
        submition_end_date: userRequest.submition_end_date,
      },
      { id: userRequest.id }
    );

    Logger.info(ctx, `Job updated`, scp);
  }

  static async deleteJob(payload: DeleteJob, userId: number): Promise<void> {
    const scp: string = 'Job';
    const ctx: string = 'Delete Job';

    const userRequest = Validator.Validate(JobSchema.DELETE_JOB, payload);

    userRequest.userId = userId;

    const company = await CompanyRepository.findOne({ userId: userRequest.userId });

    if (!company) {
      Logger.info(ctx, `Company not found`, scp);
      throw new ErrorHandler(HttpErrorCode.NOT_FOUND, 'You do not have a company');
    }

    const job = await JobRepository.findOne({ id: userRequest.id, companyId: company.id });

    if (!job) {
      Logger.info(ctx, `Job not found`, scp);
      throw new ErrorHandler(HttpErrorCode.NOT_FOUND, HttpErrorMessage.NOT_FOUND);
    }

    await JobRepository.delete({ id: userRequest.id });

    Logger.info(ctx, `Job deleted`, scp);
  }

  static async getJobById(
    payload: GetJobById
  ): Promise<
    Omit<AvaiblePosition, 'companyId' | 'createdAt' | 'updatedAt'> & { companyName: string }
  > {
    const scp: string = 'Job';
    const ctx: string = 'Get Job';

    const userRequest = Validator.Validate(JobSchema.GET_JOB_BY_ID, payload);

    const job = await JobRepository.findOne({
      id: userRequest.id,
      company: { userId: userRequest.userId },
    });

    if (!job) {
      Logger.info(ctx, `Job not found`, scp);
      throw new ErrorHandler(HttpErrorCode.NOT_FOUND, HttpErrorMessage.NOT_FOUND);
    }

    if (userRequest.userId) {
      const company = await CompanyRepository.findOne({ userId: userRequest.userId });

      if (!company) {
        Logger.info(ctx, `Company not found`, scp);
        throw new ErrorHandler(HttpErrorCode.NOT_FOUND, 'You do not have a company');
      }

      if (job.companyId !== company.id) {
        Logger.info(ctx, `Job not found`, scp);
        throw new ErrorHandler(HttpErrorCode.NOT_FOUND, HttpErrorMessage.NOT_FOUND);
      }
    }

    return {
      id: job.id,
      position_name: job.position_name,
      capacity: job.capacity,
      description: job.description,
      submition_start_date: job.submition_start_date,
      submition_end_date: job.submition_end_date,
      companyName: job.company.name,
    };
  }

  static async getJobList(
    payload: SearchJob,
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
    const scp: string = 'Job';
    const ctx: string = 'Get Job List';

    const userRequest = Validator.Validate(JobSchema.GET_ALL_JOB, payload);

    const jobs = await JobRepository.findAll(userRequest, userId);

    Logger.info(ctx, `Job list fetched`, scp);

    return jobs;
  }
}
