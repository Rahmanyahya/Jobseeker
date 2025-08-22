import { Validator } from 'Helper/Validator';
import {
  ApplyJob,
  CancelApply,
  EditApply,
  GetHistoryApply,
  JobAplicantDetail,
  JobApplicantList,
} from 'Types/Apply.types';
import { ApplicantSchema } from './Applicant.schema';
import { AccountRepository } from 'Bin/Account/Account.repository';
import { ErrorHandler, MetaData } from 'Global/Global';
import Logger from 'Config/Logger';
import { HttpErrorCode, HttpErrorMessage } from 'Constant/HttpError';
import { JobRepository } from 'Bin/Job/Job.repository';
import { ApplicantRepository } from './Applicant.repository';
import { Prisma, StatusApllication } from '@prisma/client';
import { CompanyRepository } from 'Bin/Company/Company.repository';

export class ApplicantService {
  static async applyJob(payload: ApplyJob, userId: number): Promise<void> {
    const ctx: string = 'Apply Job';
    const scp: string = 'Applicant';

    const userRequest = Validator.Validate(ApplicantSchema.APPLY_JOB, payload);

    userRequest.userId = userId;

    const userData = await AccountRepository.findOne({ id: userRequest.userId });

    if (!userData.Society) {
      Logger.info(ctx, `User not found`, scp);
      throw new ErrorHandler(
        HttpErrorCode.BAD_REQUEST,
        'Sorry you must be completed your profile before applying for a job'
      );
    }

    const job = await JobRepository.findOne({ id: userRequest.avaible_position_id });

    if (!job) {
      Logger.info(ctx, `Job not found`, scp);
      throw new ErrorHandler(HttpErrorCode.NOT_FOUND, HttpErrorMessage.NOT_FOUND);
    }

    if (job.submition_end_date < new Date()) {
      Logger.info(ctx, `Job not found`, scp);
      throw new ErrorHandler(HttpErrorCode.NOT_FOUND, HttpErrorMessage.NOT_FOUND);
    }

    if (job.accepted === job.capacity) {
      Logger.info(ctx, `Job is full`, scp);
      throw new ErrorHandler(HttpErrorCode.FORBIDDEN, 'This job is full');
    }

    const applicant = await ApplicantRepository.findFirst({
      userId: userRequest.userId,
      avaible_position_id: userRequest.avaible_position_id,
    });

    if (applicant) {
      Logger.info(ctx, `Job already applied`, scp);
      throw new ErrorHandler(HttpErrorCode.BAD_REQUEST, 'You have already applied for this job');
    }

    await ApplicantRepository.create({
      user: { connect: { id: userRequest.userId } },
      AvaiblePosition: { connect: { id: userRequest.avaible_position_id } },
    });

    Logger.info(ctx, `Job applied`, scp);
  }

  static async getHistoryApplycian(
    payload: GetHistoryApply,
    userId: number
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
    const ctx: string = 'Get History Apply';
    const scp: string = 'Applicant';

    const userRequest = Validator.Validate(ApplicantSchema.GET_HISTORY_APPLYCIANT, payload);

    userRequest.userId = userId;

    const { MetaData, data } = await ApplicantRepository.findManyHistoryUser(userRequest);

    Logger.info(ctx, `History applied fetched`, scp);

    return { MetaData, data };
  }

  static async cancelApply(payload: CancelApply): Promise<void> {
    const ctx: string = 'Cancel History Apply';
    const scp: string = 'Applicant';

    const userRequest = Validator.Validate(ApplicantSchema.CANCEL_APPLY, payload);

    const applicant = await ApplicantRepository.findOne({ id: userRequest.id });

    if (!applicant) {
      Logger.info(ctx, `Applciant not found`, scp);
      throw new ErrorHandler(HttpErrorCode.NOT_FOUND, HttpErrorMessage.NOT_FOUND);
    }

    if (applicant.status !== 'PENDING') {
      Logger.info(ctx, `Applicant cannot be canceled`, scp);
      throw new ErrorHandler(
        HttpErrorCode.BAD_REQUEST,
        'You can only cancel applications in PENDING status'
      );
    }

    await ApplicantRepository.delete({ id: userRequest.id });

    Logger.info(ctx, `History applied canceled`, scp);
  }

  static async editApply(payload: EditApply, userId: number): Promise<void> {
    const ctx: string = 'Edit History Apply';
    const scp: string = 'Applicant';

    const userRequest = Validator.Validate(ApplicantSchema.EDIT_APPLICANT, payload);

    const applicant = await ApplicantRepository.findOne({
      id: userRequest.id,
      AvaiblePosition: { company: { userId } },
    });

    if (!applicant) {
      Logger.info(ctx, `Applyciant not found`, scp);
      throw new ErrorHandler(HttpErrorCode.NOT_FOUND, HttpErrorMessage.NOT_FOUND);
    }

    userRequest.status === 'ACCEPTED'
      ? await ApplicantRepository.update(
          { id: userRequest.id },
          {
            status: userRequest.status,
            AvaiblePosition: { update: { accepted: { increment: 1 } } },
          }
        )
      : await ApplicantRepository.update({ id: userRequest.id }, { status: userRequest.status });

    Logger.info(ctx, `History applied edited`, scp);
  }

  static async jobApplyciantDetail(
    payload: JobAplicantDetail,
    userId: number
  ): Promise<
    Prisma.PositionAppliedGetPayload<{ include: { user: { include: { Portfolio: true } } } }>
  > {
    const ctx: string = 'Get History Apply';
    const scp: string = 'Applicant';

    const userRequest = Validator.Validate(ApplicantSchema.APPLICANT_DETAILS, payload);

    const applyciant = await ApplicantRepository.findOne({
      id: userRequest.id,
      AvaiblePosition: { company: { userId } },
    });

    if (!applyciant) {
      Logger.info(ctx, `Applciant not found`, scp);
      throw new ErrorHandler(HttpErrorCode.NOT_FOUND, HttpErrorMessage.NOT_FOUND);
    }

    return applyciant;
  }

  static async jobAppliciantList(
    payload: JobApplicantList,
    userId: number
  ): Promise<{
    data: {
      id: number;
      applyDate: Date;
      status: StatusApllication;
      portfolio: { id: number; skill: string; file: string }[];
    }[];
    MetaData: MetaData;
  }> {
    const ctx: string = 'Get History Apply';
    const scp: string = 'Applicant';

    const userRequest = Validator.Validate(ApplicantSchema.JOB_APPLICANT_LIST, payload);

    userRequest.userId = userId;

    const userCompany = await CompanyRepository.findOne({ userId: userRequest.userId });

    if (!userCompany) {
      Logger.info(ctx, `Company not found`, scp);
      throw new ErrorHandler(HttpErrorCode.NOT_FOUND, 'You do not have a company');
    }

    const { MetaData, data } = await ApplicantRepository.findManyApplicantList(userRequest);

    Logger.info(ctx, `History applied fetched`, scp);

    return { MetaData, data };
  }
}
