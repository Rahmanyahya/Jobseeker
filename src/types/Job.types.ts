export type CreateJob = {
  userId: number;
  companyId: number;
  position_name: string;
  capacity: number;
  description: string;
  submition_start_date: Date;
  submition_end_date: Date;
};

export type UpdateJob = Partial<Omit<CreateJob, 'companyId'>> & {
  id: number;
};

export type GetJobById = {
  id: number;
  userId?: number;
};

export type SearchJob = {
  offset: number;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  skill?: string[];
};

export type DeleteJob = GetJobById;
