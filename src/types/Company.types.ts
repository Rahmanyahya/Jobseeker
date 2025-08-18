export type CreateCompany = {
  userId: number;
  name: string;
  address: string;
  phone: string;
  description: string;
};

export type UpdateCompany = Partial<Omit<CreateCompany, 'userId'>> & {
  userId: number;
};

export type GetCompany = {
  userId: number;
};
