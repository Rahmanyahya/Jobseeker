import { AddPortfolio, GetAllPortfolio, GetPortfolioById, UpdatePortfolio } from "Types/Portfolio.types";
import { PortfolioSchema } from "./Portfolio.schema";
import { Validator } from "Helper/Validator";
import { PortfolioRepository } from "./Portfolio.repository";
import { CloudinaryService } from "Config/Clodinary";
import Logger from "Config/Logger";
import { ErrorHandler, MetaData } from "Global/Global";
import { HttpErrorCode, HttpErrorMessage } from "Constant/HttpError";
import { Portfolio } from "@prisma/client";

export class PortfolioService {

    static async addPortfolio(payload: AddPortfolio): Promise<void> {
        const scp: string = 'Portfolio';
        const ctx: string = 'Add Portfolio';

        const userRequest = Validator.Validate(PortfolioSchema.ADD_PORTFOLIO, payload);

        const {public_id, secure_url } = await CloudinaryService.uploadImage(payload.file as Buffer);

        await PortfolioRepository.create({
          description: userRequest.description,
          file: secure_url,
          file_public_id: public_id,
          skill: userRequest.skill,
          user: { connect: { id: userRequest.userId } }
        });

        Logger.info(ctx, `Portfolio added`, scp);
    }

    static async updatePortfolio(payload: UpdatePortfolio, userId: number): Promise<void> {
        const scp: string = 'Portfolio';
        const ctx: string = 'Update Portfolio';

        const userRequest = Validator.Validate(PortfolioSchema.UPDATE_PORTFOLIO, payload);

        const portfolio = await PortfolioRepository.findOne({ id: userRequest.id }, userId);

        if (!portfolio) {
          Logger.info(ctx, `Portfolio not found`, scp);
          throw new ErrorHandler(HttpErrorCode.NOT_FOUND, HttpErrorMessage.NOT_FOUND);
        }

        if (payload.file) {
          const {public_id, secure_url } = await CloudinaryService.uploadImage(payload.file as Buffer);

          await CloudinaryService.deleteImage(portfolio.file_public_id);

          portfolio.file_public_id = public_id;
          portfolio.file = secure_url;
        }

        await PortfolioRepository.update({
          description: userRequest.description,
          file: portfolio.file,
          file_public_id: portfolio.file_public_id,
          skill: userRequest.skill,
        }, { id: userRequest.id });

        Logger.info(ctx, `Portfolio updated`, scp);
    }

    static async getPortfolioById(payload: GetPortfolioById, userId: number): Promise<Omit<Portfolio, 'userId' | 'createdAt' | 'updatedAt'> | null> {
        const scp: string = 'Portfolio';
        const ctx: string = 'Get Portfolio By Id';

        const portfolio = await PortfolioRepository.findOne({ id: payload.id }, userId);

        if (!portfolio) {
          Logger.info(ctx, `Portfolio not found`, scp);
          throw new ErrorHandler(HttpErrorCode.NOT_FOUND, HttpErrorMessage.NOT_FOUND);
        }

        return portfolio;
    }

    static async getAllPortfolio(payload: GetAllPortfolio): Promise<{ data: Omit<Portfolio, 'userId' | 'createdAt' | 'updatedAt'>[], MetaData: MetaData }> {
        const scp: string = 'Portfolio';
        const ctx: string = 'Get All Portfolio';

        const userRequest = Validator.Validate(PortfolioSchema.GET_ALL_PORTFOLIO, payload);

        const { MetaData, data } = await PortfolioRepository.findAll(userRequest);

        Logger.info(ctx, `Portfolio fetched`, scp);

        return { MetaData, data };
    }

    static async deletePortfolio(payload: GetPortfolioById, userId: number): Promise<void> {
        const scp: string = 'Portfolio';
        const ctx: string = 'Delete Portfolio';

        const portfolio = await PortfolioRepository.findOne({ id: payload.id }, userId);

        if (!portfolio) {
          Logger.info(ctx, `Portfolio not found`, scp);
          throw new ErrorHandler(HttpErrorCode.NOT_FOUND, HttpErrorMessage.NOT_FOUND);
        }

        await PortfolioRepository.delete({ id: payload.id });

        await CloudinaryService.deleteImage(portfolio.file_public_id);

        Logger.info(ctx, `Portfolio deleted`, scp);
    }

}