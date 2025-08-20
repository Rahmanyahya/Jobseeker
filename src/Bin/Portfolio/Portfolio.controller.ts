import { NextFunction, Response } from 'express';
import {
  AddPortfolio,
  DeletePortfolio,
  GetAllPortfolio,
  GetPortfolioById,
  UpdatePortfolio,
} from 'Types/Portfolio.types';
import { PortfolioService } from './Porfolio.service';
import { HttpSuccessCode, HttpSuccessMessage } from 'Constant/HttpSuccess';
import { Wrapper } from 'Utils/Wrapper';
import { ClientRequest } from 'Global/Global';

export class PortfolioController {
  static async addPortfolio(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: AddPortfolio = req.body as AddPortfolio;

      if (req.file?.buffer) request.file = req.file.buffer;

      await PortfolioService.addPortfolio(request, req.user!.id!);

      Wrapper.success(res, [], HttpSuccessMessage.CREATED, HttpSuccessCode.CREATED);
    } catch (e) {
      next(e);
    }
  }

  static async updatePortfolio(
    req: ClientRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: UpdatePortfolio = req.body as UpdatePortfolio;

      if (req.file) request.file = req.file.buffer;

      request.id = Number(request.id);

      await PortfolioService.updatePortfolio(request, req.user!.id!);

      Wrapper.success(res, [], HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }

  static async getPortfolioById(
    req: ClientRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: GetPortfolioById = req.query as unknown as GetPortfolioById;

      request.id = Number(request.id);

      const response = await PortfolioService.getPortfolioById(request, req.user!.id!);

      Wrapper.success(res, response, HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }

  static async getAllPortfolio(
    req: ClientRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: GetAllPortfolio = req.query as unknown as GetAllPortfolio;

      request.page = Number(request.page);
      request.quantity = Number(request.quantity);

      const { data, MetaData } = await PortfolioService.getAllPortfolio(request, req.user!.id!);

      Wrapper.pagination(res, data, MetaData, HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }

  static async deletPortfolio(
    req: ClientRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: DeletePortfolio = req.query as unknown as DeletePortfolio;

      request.id = Number(request.id);

      await PortfolioService.deletePortfolio(request, req.user!.id!);

      Wrapper.success(res, [], HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }
}
