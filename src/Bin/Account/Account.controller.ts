import { HttpErrorCode } from 'Constant/HttpError';
import { NextFunction, Response } from 'express';
import { ClientRequest, ErrorHandler } from 'Global/Global';
import { AddProfile, RegisterAccount, UpdateProfile } from 'Types/Account.types';
import { AccountService } from './Account.service';
import { Wrapper } from 'Utils/Wrapper';
import { HttpSuccessCode, HttpSuccessMessage } from 'Constant/HttpSuccess';

export class AccountController {
  static async register(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: RegisterAccount = req.body as RegisterAccount;

      if (!req.file?.buffer)
        throw new ErrorHandler(HttpErrorCode.BAD_REQUEST, 'Photo Profile is required');

      request.avatar = req.file.buffer;

      await AccountService.register(request);

      Wrapper.success(res, [], HttpSuccessMessage.CREATED, HttpSuccessCode.CREATED);
    } catch (e) {
      next(e);
    }
  }

  static async addProfile(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: AddProfile = req.body as AddProfile;

      request.userId = req.user!.id!;

      await AccountService.addProfile(request);

      Wrapper.success(res, [], HttpSuccessMessage.CREATED, HttpSuccessCode.CREATED);
    } catch (e) {
      next(e);
    }
  }

  static async updateProfile(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: UpdateProfile = req.body as UpdateProfile;

      if (req.file?.buffer) request.avatar = req.file.buffer;

      request.userId = req.user!.id!;

      await AccountService.editProfile(request);

      Wrapper.success(res, [], HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }

  static async getProfile(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await AccountService.getProfile(req.user!.id!);

      Wrapper.success(res, response, HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }

  static async deleteProfile(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await AccountService.deleteAccount(req.user!.id!);

      Wrapper.success(res, [], HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }
}
