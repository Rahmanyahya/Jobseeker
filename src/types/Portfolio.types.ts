export type AddPortfolio = {
  userId: number;
  skill: string;
  description: string;
  file: string | Buffer;
  file_public_id: string;
};

export type UpdatePortfolio = Partial<Omit<AddPortfolio, 'userId'>> & {
  id: number;
};

export type GetPortfolioById = {
  id: number;
};

export type GetAllPortfolio = {
  userId: number;
  page: number;
  quantity: number;
  search?: string;
};

export type DeletePortfolio = {
  id: number;
};
