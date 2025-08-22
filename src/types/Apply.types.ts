import { StatusApllication } from '@prisma/client';

export type ApplyJob = {
  avaible_position_id: number;
  userId: number;
};

export type CancelApply = {
  id: number;
};

export type GetHistoryApply = {
  userId: number;
  page: number;
  quantity: number;
  status?: StatusApllication;
  search?: string;
  applyDate?: Date;
};

export type EditApply = {
  id: number;
  status: StatusApllication;
};

export type JobAplicantDetail = {
  id: number;
};

export type JobApplicantList = {
  userId: number;
  avaible_position_Id: number;
  page: number;
  quantity: number;
  status?: StatusApllication;
  search?: string;
};
